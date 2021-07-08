import { Injectable } from '@nestjs/common';

@Injectable()
export class ShorterService {
  getHello(): string {
    return 'Hello World!';
  }
}
