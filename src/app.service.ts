import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';
import { Shorter } from './shorter/shorter.entity';
import { DateUtil } from './shared/util/dateUtil';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './shared/util/redis.service';

@Injectable()
export class AppService {
  public static readonly LOGGER = new Logger(AppService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Cache 는 cache-manager 로 부터 import 해야 한다.
    private configService: ConfigService, 
    private redisService: RedisService,
  ) {}

  get(): string {
    return 'Hello Bigzero Short URL!';
  }

  // url 로 들어온 short key 를 받아서 origin url 로 redirect 한다. 
  // redirect 된 횟수를 count 하여 차후 필요시 정산한다. 
  async getRedis(redisKey: string): Promise<Shorter> {
    // TODO: DB 에 count update 처리 (배치로 별도 구현 필요)

    // cacheManager 로는 안되는 Redis 고유기능들은 아래처럼 별도의 nodejs redis 를 사용해서 구현함.
    const redisCounterDb = this.configService.get<number>('REDIS_COUNTER_DB');
    const redis = this.redisService.getClient(redisCounterDb);
    await redis.connect();
    const shortUrlCnt = await redis.incr(redisKey);
    AppService.LOGGER.debug('Short Url Counter :::' + shortUrlCnt);

    // 단순한 Redis get/set 작업은 cacheManager 를 활용했음.
    return this.cacheManager.get(redisKey);
  }
}
