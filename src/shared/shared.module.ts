import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { RedisService } from './util/redis.service';

@Module({
  providers: [
    TypeOrmConfigService,
    RedisService
  ],
  exports: [
    RedisService,
  ]
})
export class SharedModule {}
