import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluatorEntity } from './entities/evaluator.entity';
import { CreateEvaluatorDto } from './dto/create-evaluator.dto';
import { UpdateEvaluatorDto } from './dto/update-evaluator.dto';

@Injectable()
export class EvaluatorsService {
  private readonly logger = new Logger(EvaluatorsService.name);

  constructor(
    @InjectRepository(EvaluatorEntity)
    private readonly evaluatorRepository: Repository<EvaluatorEntity>,
  ) {}

  /**
   * Create a new evaluator
   */
  async create(createEvaluatorDto: CreateEvaluatorDto): Promise<EvaluatorEntity> {
    this.logger.log(`Creating new evaluator: ${createEvaluatorDto.name}`);
    const evaluator = this.evaluatorRepository.create(createEvaluatorDto);
    return this.evaluatorRepository.save(evaluator);
  }

  /**
   * Find all evaluators (optionally filter by active status)
   */
  async findAll(onlyActive = false): Promise<EvaluatorEntity[]> {
    this.logger.log(`Finding all evaluators (onlyActive: ${onlyActive})`);

    const query = this.evaluatorRepository.createQueryBuilder('evaluator');

    if (onlyActive) {
      query.where('evaluator.isActive = :isActive', { isActive: true });
    }

    return query
      .orderBy('evaluator.rating', 'DESC')
      .addOrderBy('evaluator.propertiesEvaluated', 'DESC')
      .getMany();
  }

  /**
   * Find one evaluator by ID
   */
  async findOne(id: number): Promise<EvaluatorEntity> {
    this.logger.log(`Finding evaluator with ID: ${id}`);
    const evaluator = await this.evaluatorRepository.findOne({
      where: { id },
      relations: ['properties'],
    });

    if (!evaluator) {
      throw new NotFoundException(`Evaluator with ID ${id} not found`);
    }

    return evaluator;
  }

  /**
   * Update an evaluator
   */
  async update(id: number, updateEvaluatorDto: UpdateEvaluatorDto): Promise<EvaluatorEntity> {
    this.logger.log(`Updating evaluator with ID: ${id}`);
    const evaluator = await this.findOne(id);

    Object.assign(evaluator, updateEvaluatorDto);

    return this.evaluatorRepository.save(evaluator);
  }

  /**
   * Remove an evaluator (soft delete by setting isActive = false)
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Removing evaluator with ID: ${id}`);
    const evaluator = await this.findOne(id);

    evaluator.isActive = false;
    await this.evaluatorRepository.save(evaluator);
  }

  /**
   * Increment properties evaluated count
   */
  async incrementPropertiesEvaluated(id: number): Promise<void> {
    this.logger.log(`Incrementing properties evaluated for evaluator ID: ${id}`);
    await this.evaluatorRepository.increment({ id }, 'propertiesEvaluated', 1);
  }
}
