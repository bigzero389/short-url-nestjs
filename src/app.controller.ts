import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHello(): string {
    return 'Hello bigzero short url world';
  }

  @Get('health')
  getHealth(): string {
    return 'ok';
  }
}
