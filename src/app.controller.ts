import { CACHE_MANAGER, Controller, Get, Inject, Logger, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { from, Observable } from 'rxjs';
import { Account } from './account/account.entity';
import { map } from 'rxjs/operators';
import { ShorterService } from './shorter/shorter.service';
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Shorter } from './shorter/shorter.entity';

@ApiTags('App root')
@Controller('/')
export class AppController {
  private static readonly LOGGER = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/s/:short')
  @ApiOperation({ summary: 'short url 호출', description: 'short url 을 호출하면 origin url 로 redirect 한다.' })
  @ApiParam({ name: 'short', example: '9f3dded' })
  @ApiCreatedResponse({ description: 'redirect to origin url', status: 201 })
  getUrl(@Req() req, @Res() res, @Param() params): Observable<Shorter> {
    const shorter = req.url.replace('/', '');
    AppController.LOGGER.debug(JSON.stringify(shorter));
    AppController.LOGGER.debug(JSON.stringify(params.short));
    const shorterInfo = from(this.appService.getRedis(params.short));
    // const shorterInfo = from(this.appService.getRedis(params.s));
    return shorterInfo.pipe(
      map((result) => {
        AppController.LOGGER.debug(JSON.stringify(result));
        return res.redirect(result.origin_url);
      }),
    );
  }

  @Get('/hello')
  @ApiOperation({ summary: 'application hello', description: 'application layer 가 정상인지 체크한다.', })
  get(): string {
    return this.appService.get();
  }

  @Get('/health')
  @ApiOperation({ summary: 'application health check', description: 'application 이 정상 상태인지 체크한다.', })
  getHealth(): string {
    return 'ok';
  }

  @Get('/redis')
  @ApiOperation({ summary: 'redis health check', description: 'redis 서버가 정상 상태인지 체크한다.', })
  getRedis(): string {
    const redisOk = this.configService.get<string>('REDIS_HOST');
    if (redisOk) {
      return 'ok';
    } else {
      return 'not ok';
    }
  }
}
