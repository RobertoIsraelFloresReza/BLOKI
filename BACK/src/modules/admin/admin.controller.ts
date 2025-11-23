import { Controller, Post, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post('pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause critical system operations' })
  @ApiResponse({
    status: 200,
    description: 'System paused successfully',
    schema: {
      example: {
        success: true,
        paused: true,
        message: 'System operations paused',
      },
    },
  })
  async pauseSystem() {
    this.logger.warn('SYSTEM PAUSE requested');
    await this.adminService.pauseSystem();
    return {
      success: true,
      paused: true,
      message: 'System operations paused',
    };
  }

  @Post('unpause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume critical system operations' })
  @ApiResponse({
    status: 200,
    description: 'System unpaused successfully',
    schema: {
      example: {
        success: true,
        paused: false,
        message: 'System operations resumed',
      },
    },
  })
  async unpauseSystem() {
    this.logger.warn('SYSTEM UNPAUSE requested');
    await this.adminService.unpauseSystem();
    return {
      success: true,
      paused: false,
      message: 'System operations resumed',
    };
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get system pause status' })
  @ApiResponse({
    status: 200,
    description: 'System status retrieved',
    schema: {
      example: {
        paused: false,
        timestamp: '2024-03-20T14:00:00.000Z',
      },
    },
  })
  async getSystemStatus() {
    const isPaused = await this.adminService.isSystemPaused();
    return {
      paused: isPaused,
      timestamp: new Date().toISOString(),
    };
  }
}
