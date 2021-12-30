import { CanActivate, ExecutionContext, Injectable, Logger, } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly LOGGER = new Logger(AuthGuard.name);

  constructor(private authService: AuthService) {}

  canActivate( context: ExecutionContext, ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const contentType = req.headers['content-type'];
    if (req.method == 'POST' || req.method == 'PUT') {
      if (contentType !== 'application/json') {
        // throw new HttpException( 'Content Error', HttpStatus.NO_CONTENT, );
        AuthGuard.LOGGER.debug( `Method: ${req.method}, Content Error: ${contentType}`, );
        return false;
      }
    }

    const authKey = req.headers['short_auth_key'] ?? '';
    if (!authKey || !this.authService.isAuthKeyValid(authKey)) {
      AuthGuard.LOGGER.debug(`Auth Error: ${authKey}`);
      return false;
    }
    // throw new HttpException( 'You do not have permission ', HttpStatus.UNAUTHORIZED, );
    return true;
  }
}
