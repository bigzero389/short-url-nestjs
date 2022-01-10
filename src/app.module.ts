import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShorterModule } from './shorter/shorter.module';
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './account/account.module';
import { ApikeyModule } from './apikey/apikey.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    SharedModule,
    AccountModule,
    ApikeyModule,
    ShorterModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),  // .env 라는 단어가 들어가야 한다.
    AuthModule,     
    CacheModule.registerAsync({
      // imports: [ConfigModule], // ConfigModule 을 global 로 설정했으므로 여기서 필요없다. 만일 global 로 안했으면 넣어줘야 함.
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        db: config.get<number>('REDIS_SHORT_DB'),
      }),
    }),
  ],
})
export class AppModule {}
