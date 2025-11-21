import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './models/dto/login.dto';
import { RegisterDTO } from './models/dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDTO })
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDTO })
  register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @ApiBody({ required: false })
  getProfile(@Request() req) {
    return this.authService.validate(req.user.id);
  }

  @Get('validate')
  validate(@Request() req) {
    return this.authService.validate(req.user.id);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
  }
}
