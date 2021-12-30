import { CACHE_MANAGER, Controller, Get, Inject, Logger, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { from, Observable } from 'rxjs';
import { Account } from './account/account.entity';
import { map } from 'rxjs/operators';
import { ShorterService } from './shorter/shorter.service';

@Controller()
export class AppController {
  private static readonly LOGGER = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('*')
  get(@Req() req, @Res() res): Observable<any> {
    const shorter = req.url.replace('/', '');
    AppController.LOGGER.debug(JSON.stringify(shorter));
    const shorterInfo = from(this.appService.getRedis(shorter));
    return shorterInfo.pipe(
      map((result) => {
        AppController.LOGGER.debug(JSON.stringify(result));
        return res.redirect(result.origin_url);
      }),
    );
  }

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
