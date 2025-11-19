import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StellarAuthService } from '../stellar-auth.service';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class StellarAuthGuard implements CanActivate {
  private readonly logger = new Logger(StellarAuthGuard.name);

  constructor(
    private readonly stellarAuthService: StellarAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Extract session token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    // Support both "Bearer <token>" and direct token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      throw new UnauthorizedException('No session token provided');
    }

    // Validate session
    const session = await this.stellarAuthService.validateSession(token);

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Attach session data to request
    request.user = session;
    request.sessionToken = token;

    return true;
  }
}
