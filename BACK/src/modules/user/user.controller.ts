import { Controller, Get, Post, Put, Body, Param, Query, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './model/create.user.dto';
import { UpdateUserDto } from './model/update.user.dto';
import { ResetPasswordDTO } from './model/reset.password.dto';
import { ResetPasswordCodeDTO } from './model/reset.password.code.dto';
import { BaseController } from '../base/base.controller';
import { UserEntity } from './entity/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController extends BaseController<UserEntity, CreateUserDto, UpdateUserDto> {
  protected service: UserService;
  protected entityName = 'user';

  constructor(private readonly userService: UserService) {
    super();
    this.service = this.userService;
  }


  @Get('/siteId/:id')
  @ApiOperation({ summary: 'Get all users by siteId' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/active')
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({ status: 200, description: 'Return all active users' })
  async findAllActive() {
    return await this.userService.findAllActive();
  }


  @Get('/role/:role')
  @ApiOperation({ summary: 'Get all users by role' })
  @ApiResponse({ status: 200, description: 'List of users by role retrieved successfully' })
  @ApiParam({ name: 'role', type: 'string', description: 'User role' })
  async findByRole(@Param('role') role: string) {
    return await this.userService.findByRole(role);
  }


  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Post('/reset-password-with-code')
  @ApiOperation({ summary: 'Reset password using verification code' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPasswordWithCode(@Body() resetPasswordCodeDto: ResetPasswordCodeDTO) {
    return await this.userService.resetPasswordWithCode(resetPasswordCodeDto);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Query('stellarPublicKey') stellarPublicKey: string) {
    // TODO: Usar JWT guard en lugar de query param
    return await this.userService.findByStellarPublicKey(stellarPublicKey);
  }

  @Patch('/me')
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  async updateProfile(
    @Query('stellarPublicKey') stellarPublicKey: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // TODO: Usar JWT guard en lugar de query param
    return await this.userService.updateByStellarPublicKey(stellarPublicKey, updateUserDto);
  }

  @Post('/kyc/initiate')
  @ApiOperation({ summary: 'Iniciar proceso de verificación KYC' })
  @ApiResponse({ status: 200, description: 'KYC process initiated successfully' })
  async initiateKyc(@Body('stellarPublicKey') stellarPublicKey: string) {
    return await this.userService.initiateKyc(stellarPublicKey);
  }

  @Get('/kyc/status')
  @ApiOperation({ summary: 'Obtener estado de verificación KYC' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  async getKycStatus(@Query('stellarPublicKey') stellarPublicKey: string) {
    return await this.userService.getKycStatus(stellarPublicKey);
  }

  @Get('/portfolio')
  @ApiOperation({ summary: 'Obtener portfolio del usuario (propiedades poseídas)' })
  @ApiResponse({ status: 200, description: 'User portfolio retrieved successfully' })
  async getPortfolio(@Query('stellarPublicKey') stellarPublicKey: string) {
    return await this.userService.getPortfolio(stellarPublicKey);
  }

  @Get('/properties')
  @ApiOperation({ summary: 'Obtener propiedades donde el usuario tiene tokens' })
  @ApiResponse({ status: 200, description: 'User properties retrieved successfully' })
  async getUserProperties(@Query('stellarPublicKey') stellarPublicKey: string) {
    return await this.userService.getUserProperties(stellarPublicKey);
  }

  @Get('/transactions')
  @ApiOperation({ summary: 'Obtener historial de transacciones del usuario' })
  @ApiResponse({ status: 200, description: 'User transactions retrieved successfully' })
  async getUserTransactions(@Query('stellarPublicKey') stellarPublicKey: string) {
    return await this.userService.getUserTransactions(stellarPublicKey);
  }
}
