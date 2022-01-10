import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    constructor(
        private configService: ConfigService, // Cache 는 cache-manager 로 부터 import 해야 한다.
    ) {}

    getClient(db: number) {
        const redisClient = createClient({ url: 'redis://' + this.configService.get<String>('REDIS_HOST') + ':' + this.configService.get<String>('REDIS_PORT') + '/' + db});
        return redisClient;
    }
}
