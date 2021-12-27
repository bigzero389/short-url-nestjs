import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  get(): string {
    return this.appService.get();
  }

  // @Get('hello')
  // getHello(): string {
  //   return 'Hello bigzero short url world';
  // }

  @Get('health')
  getHealth(): string {
    return 'ok';
  }

  @Get('redis')
  getRedis(): string {
    const redisOk = this.configService.get<string>('REDIS_HOST');
    if (redisOk) {
      return 'ok';
    } else {
      return 'not ok';
    }
  }
}
