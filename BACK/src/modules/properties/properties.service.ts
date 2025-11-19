import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { StellarService } from '../stellar/stellar.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    private stellarService: StellarService,
    private configService: ConfigService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyEntity> {
    try {
      this.logger.log(`Creating property: ${createPropertyDto.propertyId}`);

      // 1. Deploy nuevo PropertyToken contract usando el Deployer
      const deployResult = await this.stellarService.deployPropertyToken(
        createPropertyDto.adminSecretKey,
        parseInt(createPropertyDto.propertyId.replace(/\D/g, '')) || Date.now(),
        createPropertyDto.name,
        createPropertyDto.propertyId.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4),
        createPropertyDto.totalSupply,
      );

      this.logger.log(`PropertyToken deployed: ${deployResult.contractId}`);

      // 2. Obtener admin address
      const adminKeypair = this.stellarService['Keypair'].fromSecret(createPropertyDto.adminSecretKey);
      const adminAddress = adminKeypair.publicKey();

      // 3. Guardar en base de datos
      const property = this.propertyRepository.create({
        contractId: deployResult.contractId,
        propertyId: createPropertyDto.propertyId,
        name: createPropertyDto.name,
        description: createPropertyDto.description,
        address: createPropertyDto.address,
        totalSupply: (createPropertyDto.totalSupply * 10000000).toString(),
        valuation: (createPropertyDto.valuation * 10000000).toString(),
        decimals: 7,
        legalOwner: createPropertyDto.legalOwner,
        adminAddress: adminAddress,
        metadata: createPropertyDto.metadata,
        verified: false,
      });

      const savedProperty = await this.propertyRepository.save(property);

      // 4. Registrar en Registry contract
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

      return savedProperty;
    } catch (error) {
      this.logger.error(`Failed to create property: ${error.message}`);
      throw new BadRequestException(`Failed to create property: ${error.message}`);
    }
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      relations: ['ownerships', 'listings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['ownerships', 'listings'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findByContractId(contractId: string): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({
      where: { contractId },
      relations: ['ownerships', 'listings'],
    });

    if (!property) {
      throw new NotFoundException(`Property with contract ${contractId} not found`);
    }

    return property;
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<PropertyEntity> {
    const property = await this.findOne(id);
    
    Object.assign(property, updatePropertyDto);
    
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

  async remove(id: number): Promise<void> {
    const property = await this.findOne(id);
    await this.propertyRepository.remove(property);
  }

  async getHistory(id: number): Promise<any[]> {
    // Retorna historial de transacciones de la propiedad
    // Por ahora retorna array vacío, necesita TransactionEntity
    return [];
  }

  async addImages(id: number, files: Express.Multer.File[]): Promise<PropertyEntity> {
    const property = await this.findOne(id);

    const imagePaths = files.map(file => `/uploads/properties/${file.filename}`);

    if (!property.images) {
      property.images = imagePaths;
    } else {
      property.images = [...property.images, ...imagePaths];
    }

    return this.propertyRepository.save(property);
  }

  async findByOwner(ownerAddress: string): Promise<PropertyEntity[]> {
    this.logger.log(`Finding properties owned by: ${ownerAddress}`);

    return this.propertyRepository.find({
      where: { adminAddress: ownerAddress },
      relations: ['ownerships', 'listings'],
      order: { createdAt: 'DESC' },
    });
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
