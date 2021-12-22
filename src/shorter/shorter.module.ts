import { CacheModule, Module } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShorterController } from './shorter.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shorter } from './shorter.entity';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Shorter]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      db: 1,
    }),
  ],
  controllers: [ShorterController],
  providers: [ShorterService],
})
export class ShorterModule {}
