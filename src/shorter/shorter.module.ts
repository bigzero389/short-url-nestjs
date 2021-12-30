import { CacheModule, Module } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShorterController } from './shorter.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shorter } from './shorter.entity';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../shared/config/typeorm.config.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    // TypeOrmModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([Shorter]),
    // CacheModule.register({ store: redisStore, host: 'localhost', port: 6379, db: 1, }),
    CacheModule.registerAsync({
      // imports: [ConfigModule], // ConfigModule 을 global 로 설정했으므로 여기서 필요없다. 만일 global 로 안했으면 넣어줘야 함.
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        db: config.get<number>('REDIS_DB'),
      }),
    }),
  ],
  controllers: [ShorterController],
  providers: [ShorterService, ConfigService],
})
export class ShorterModule {}
