import { Injectable, Logger } from '@nestjs/common';
import { of } from 'rxjs';

@Injectable()
export class AuthService {
  private static readonly LOGGER = new Logger(AuthService.name);

  // TODO: Authkey를 동적으로 처리해야 함.
  private readonly authkeys = [
    'bigzero-auth-key-01',
    'bigzero-auth-key-02',
    'bigzero-auth-key-03',
  ];

  async findOne(authkey: string): Promise<string> {
    const found = this.authkeys.find((element) => element == authkey);
    return found;
  }

  isAuthKeyValid(authkey: string): boolean {
    const found = this.authkeys.find((element) => element == authkey);
    AuthService.LOGGER.debug('AuthKeyValid: ' + found);
    if (found && found !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
