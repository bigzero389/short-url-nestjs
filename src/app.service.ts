import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Shorter } from './shorter/shorter.entity';
import { DateUtil } from './shared/util/dateUtil';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Cache 는 cache-manager 로 부터 import 해야 한다.
  ) {}

  get(): string {
    return 'Hello Bigzero Short URL!';
  }

  async getRedis(redisKey: string): Promise<Shorter> {
    // TODO : redis short_url_cnt 업데이트 처리 추가, cnt 는 redis 에서 하고 주기적으로 DB 에 업데이트 해야 함.
    // redis 저장.
    // const cacheResult = await this.cacheManager.set(
    //   createShorterDto.shorter_key,
    //   createShorterDto,
    //   { ttl: DateUtil.getIntervalSecond(createShorterDto.end_datetime, createShorterDto.begin_datetime) },
    // );
    return this.cacheManager.get(redisKey).then(async (shorter: Shorter) => {
      this.cacheManager.set(shorter.apikey, '');
      return shorter;
    });
  }
}
