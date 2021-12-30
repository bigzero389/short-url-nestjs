import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Cache 는 cache-manager 로 부터 import 해야 한다.
  ) {}

  get(): string {
    return 'Hello Bigzero Short URL!';
  }

  async getRedis(redisKey: string): Promise<any> {
    return this.cacheManager.get(redisKey);
  }
}
