import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { StellarService } from '../stellar/stellar.service';
import { ConfigService } from '@nestjs/config';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { Keypair } from '@stellar/stellar-sdk';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    private stellarService: StellarService,
    private configService: ConfigService,
    private cloudflareService: CloudflareService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, userStellarPublicKey: string): Promise<PropertyEntity> {
    try {
      this.logger.log(`Creating property: ${createPropertyDto.propertyId} for user: ${userStellarPublicKey}`);

      let contractId: string;
      const adminAddress = userStellarPublicKey; // Always use authenticated user's public key

      // Check if adminSecretKey is provided
      if (createPropertyDto.adminSecretKey) {
        this.logger.log('Admin secret key provided - deploying contract to blockchain');

        // Validate that the provided secret key matches the user's public key
        const providedKeypair = Keypair.fromSecret(createPropertyDto.adminSecretKey);
        if (providedKeypair.publicKey() !== userStellarPublicKey) {
          throw new BadRequestException('Admin secret key does not match your Stellar public key');
        }

        // 1. Deploy nuevo PropertyToken contract usando el Deployer
        const deployResult = await this.stellarService.deployPropertyToken(
          createPropertyDto.adminSecretKey,
          parseInt(createPropertyDto.propertyId.replace(/\D/g, '')) || Date.now(),
          createPropertyDto.name,
          createPropertyDto.propertyId.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4),
          createPropertyDto.totalSupply,
        );

        this.logger.log(`PropertyToken deployed: ${deployResult.contractId}`);
        contractId = deployResult.contractId;
      } else {
        this.logger.log('No admin secret key - creating property without blockchain deployment');

        // Generate placeholder contractId (can be updated later)
        contractId = `PENDING_${Date.now()}_${createPropertyDto.propertyId}`;
      }

      // 3. Guardar en base de datos
      const property = this.propertyRepository.create({
        contractId: contractId,
        propertyId: createPropertyDto.propertyId,
        name: createPropertyDto.name,
        description: createPropertyDto.description,
        address: createPropertyDto.address,
        totalSupply: (createPropertyDto.totalSupply * 10000000).toString(),
        valuation: (createPropertyDto.valuation * 10000000).toString(),
        decimals: 7,
        legalOwner: createPropertyDto.legalOwner,
        adminAddress: adminAddress,
        metadata: typeof createPropertyDto.metadata === 'object'
          ? JSON.stringify(createPropertyDto.metadata)
          : createPropertyDto.metadata,
        verified: false,
      });

      const savedProperty = await this.propertyRepository.save(property);

      // 4. Registrar en Registry contract (solo si se deployó)
      if (createPropertyDto.adminSecretKey) {
        try {
          const registryTxHash = await this.stellarService.registerProperty(
            createPropertyDto.adminSecretKey,
            savedProperty.id,
            createPropertyDto.propertyId,
            adminAddress,
            createPropertyDto.valuation,
          );

          savedProperty.registryTxHash = registryTxHash;
          await this.propertyRepository.save(savedProperty);
          this.logger.log(`Property registered in Registry: ${registryTxHash}`);
        } catch (error) {
          this.logger.warn(`Failed to register in Registry: ${error.message}`);
        }
      } else {
        this.logger.log('Skipping registry registration - no admin secret key');
      }

      return savedProperty;
    } catch (error) {
      this.logger.error(`Failed to create property: ${error.message}`);
      throw new BadRequestException(`Failed to create property: ${error.message}`);
    }
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      relations: ['ownerships', 'listings', 'evaluator'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['ownerships', 'listings', 'evaluator'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findByContractId(contractId: string): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({
      where: { contractId },
      relations: ['ownerships', 'listings', 'evaluator'],
    });

    if (!property) {
      throw new NotFoundException(`Property with contract ${contractId} not found`);
    }

    return property;
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto, userStellarPublicKey?: string): Promise<PropertyEntity> {
    const property = await this.findOne(id);

    // Validate ownership if userStellarPublicKey is provided
    if (userStellarPublicKey && property.adminAddress !== userStellarPublicKey) {
      this.logger.warn(`User ${userStellarPublicKey} attempted to update property ${id} owned by ${property.adminAddress}`);
      throw new BadRequestException('No tienes permisos para actualizar esta propiedad');
    }

    // Convert valuation and totalSupply if provided (multiply by 10000000 for Stellar stroop format)
    const updateData: any = { ...updatePropertyDto };

    if (updatePropertyDto.valuation !== undefined) {
      updateData.valuation = (updatePropertyDto.valuation * 10000000).toString();
    }

    if (updatePropertyDto.totalSupply !== undefined) {
      updateData.totalSupply = (updatePropertyDto.totalSupply * 10000000).toString();
    }

    // Convert metadata to JSON string if it's an object
    if (updatePropertyDto.metadata && typeof updatePropertyDto.metadata === 'object') {
      updateData.metadata = JSON.stringify(updatePropertyDto.metadata);
    }

    Object.assign(property, updateData);

    this.logger.log(`Property ${id} updated by owner ${userStellarPublicKey}`);
    return this.propertyRepository.save(property);
  }

  async verifyProperty(id: number, adminSecretKey: string): Promise<PropertyEntity> {
    const property = await this.findOne(id);

    try {
      const txHash = await this.stellarService.verifyProperty(adminSecretKey, id);
      
      property.verified = true;
      property.registryTxHash = txHash;
      
      return this.propertyRepository.save(property);
    } catch (error) {
      throw new BadRequestException(`Failed to verify property: ${error.message}`);
    }
  }

  async getTokenInfo(id: number): Promise<any> {
    const property = await this.findOne(id);
    
    try {
      const tokenInfo = await this.stellarService.getTokenInfo(property.contractId);
      return {
        ...property,
        blockchainData: tokenInfo,
      };
    } catch (error) {
      this.logger.error(`Failed to get token info: ${error.message}`);
      return property;
    }
  }

  async remove(id: number, userStellarPublicKey?: string): Promise<void> {
    const property = await this.findOne(id);

    // Validate ownership if userStellarPublicKey is provided
    if (userStellarPublicKey && property.adminAddress !== userStellarPublicKey) {
      this.logger.warn(`User ${userStellarPublicKey} attempted to delete property ${id} owned by ${property.adminAddress}`);
      throw new BadRequestException('No tienes permisos para eliminar esta propiedad');
    }

    this.logger.log(`Property ${id} deleted by owner ${userStellarPublicKey}`);
    await this.propertyRepository.remove(property);
  }

  async getHistory(id: number): Promise<any[]> {
    // Retorna historial de transacciones de la propiedad
    // Por ahora retorna array vacío, necesita TransactionEntity
    return [];
  }

  async addImages(id: number, files: Express.Multer.File[]): Promise<PropertyEntity> {
    this.logger.log('=== PROPERTY ADD IMAGES START ===');
    this.logger.log(`🏠 Property ID: ${id}`);
    this.logger.log(`📸 Files received: ${files.length}`);

    const property = await this.findOne(id);
    this.logger.log(`✅ Property found: ${property.name}`);
    this.logger.log(`📷 Current images: ${property.images?.length || 0}`);

    this.logger.log(`🚀 Starting upload to Cloudflare R2...`);

    // Upload all images to Cloudflare R2
    const imageUrls = await this.cloudflareService.uploadMultipleToCloudflare(files, 'properties');

    this.logger.log(`✅ Successfully uploaded ${imageUrls.length} images to Cloudflare`);
    this.logger.log(`🔗 New URLs: ${JSON.stringify(imageUrls, null, 2)}`);

    if (!property.images) {
      property.images = imageUrls;
    } else {
      property.images = [...property.images, ...imageUrls];
    }

    this.logger.log(`💾 Saving property with ${property.images.length} total images...`);
    const savedProperty = await this.propertyRepository.save(property);

    this.logger.log(`✅ Property saved successfully with images!`);
    this.logger.log('=== PROPERTY ADD IMAGES END ===');

    return savedProperty;
  }

  async addValuationDocument(id: number, file: Express.Multer.File): Promise<PropertyEntity> {
    const property = await this.findOne(id);

    this.logger.log(`Uploading valuation document for property ${id} to Cloudflare R2`);

    // Upload document to Cloudflare R2
    const uploadResult = await this.cloudflareService.uploadToCloudflare(file, 'valuations');

    this.logger.log(`Successfully uploaded valuation document to Cloudflare: ${uploadResult.url}`);

    property.valuationDocument = uploadResult.url;

    return this.propertyRepository.save(property);
  }

  async findByOwner(ownerAddress: string): Promise<PropertyEntity[]> {
    this.logger.log(`🔍 Finding properties owned by: ${ownerAddress}`);

    const properties = await this.propertyRepository.find({
      where: { adminAddress: ownerAddress },
      relations: ['ownerships', 'listings'],
      order: { createdAt: 'DESC' },
    });

    // DEBUG: Log results
    this.logger.log(`🔍 Found ${properties.length} properties for owner ${ownerAddress}`);
    properties.forEach(p => {
      this.logger.log(`🔍   - Property ID ${p.id}: adminAddress = ${p.adminAddress}`);
    });

    return properties;
  }

  async findInvestments(stellarPublicKey: string): Promise<any[]> {
    this.logger.log(`Finding investments for: ${stellarPublicKey}`);

    // Query properties where user has ownership (has tokens)
    const properties = await this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.ownerships', 'ownership')
      .leftJoinAndSelect('property.listings', 'listings')
      .where('ownership.ownerAddress = :address', { address: stellarPublicKey })
      .andWhere('CAST(ownership.balance AS DECIMAL) > 0')
      .orderBy('ownership.createdAt', 'DESC')
      .getMany();

    return properties.map(property => {
      const ownership = property.ownerships.find(o => o.ownerAddress === stellarPublicKey);
      return {
        ...property,
        myOwnership: {
          balance: ownership?.balance,
          percentage: ownership?.percentage,
          acquiredAt: ownership?.createdAt,
        },
      };
    });
  }
}
