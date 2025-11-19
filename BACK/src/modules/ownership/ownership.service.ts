import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnershipEntity } from './entities/ownership.entity';
import { PropertyEntity } from '../properties/entities/property.entity';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class OwnershipService {
  constructor(
    @InjectRepository(OwnershipEntity)
    private ownershipRepository: Repository<OwnershipEntity>,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    private stellarService: StellarService,
  ) {}

  async findByProperty(propertyId: number): Promise<OwnershipEntity[]> {
    return this.ownershipRepository.find({
      where: { propertyId },
      relations: ['property'],
      order: { balance: 'DESC' },
    });
  }

  async findByOwner(ownerAddress: string): Promise<OwnershipEntity[]> {
    return this.ownershipRepository.find({
      where: { ownerAddress },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOwnershipPercentage(propertyId: number, ownerAddress: string): Promise<number> {
    const ownership = await this.ownershipRepository.findOne({
      where: { propertyId, ownerAddress },
    });

    return ownership ? ownership.percentage : 0;
  }

  async syncOwnershipFromBlockchain(propertyId: number): Promise<OwnershipEntity[]> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const ownerships = await this.ownershipRepository.find({
      where: { propertyId },
    });

    for (const ownership of ownerships) {
      const balance = await this.stellarService.getTokenBalance(
        property.contractId,
        ownership.ownerAddress,
      );

      ownership.balance = (balance * 10000000).toString();
      ownership.percentage = (balance / (parseFloat(property.totalSupply) / 10000000)) * 100;
      
      await this.ownershipRepository.save(ownership);
    }

    return this.findByProperty(propertyId);
  }
}
