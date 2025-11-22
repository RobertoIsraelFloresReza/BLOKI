import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluatorsService } from './evaluators.service';
import { CreateEvaluatorDto } from './dto/create-evaluator.dto';
import { UpdateEvaluatorDto } from './dto/update-evaluator.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('evaluators')
@Controller('evaluators')
export class EvaluatorsController {
  constructor(private readonly evaluatorsService: EvaluatorsService) {}

  /**
   * Create new evaluator (Admin only - for MVP, no guard, but should add later)
   */
  @Post()
  @ApiOperation({ summary: 'Create a new evaluator (Admin only)' })
  @ApiResponse({ status: 201, description: 'Evaluator created successfully' })
  create(@Body() createEvaluatorDto: CreateEvaluatorDto) {
    return this.evaluatorsService.create(createEvaluatorDto);
  }

  /**
   * Get all evaluators (Public - anyone can view)
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all evaluators' })
  @ApiResponse({ status: 200, description: 'List of evaluators' })
  findAll(@Query('onlyActive') onlyActive?: string) {
    const activeOnly = onlyActive === 'true';
    return this.evaluatorsService.findAll(activeOnly);
  }

  /**
   * Get single evaluator by ID (Public)
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get evaluator by ID' })
  @ApiResponse({ status: 200, description: 'Evaluator details' })
  @ApiResponse({ status: 404, description: 'Evaluator not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluatorsService.findOne(id);
  }

  /**
   * Update evaluator (Admin only)
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update evaluator (Admin only)' })
  @ApiResponse({ status: 200, description: 'Evaluator updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEvaluatorDto: UpdateEvaluatorDto,
  ) {
    return this.evaluatorsService.update(id, updateEvaluatorDto);
  }

  /**
   * Delete evaluator (Admin only - soft delete)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete evaluator (Admin only)' })
  @ApiResponse({ status: 200, description: 'Evaluator deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluatorsService.remove(id);
  }
}
