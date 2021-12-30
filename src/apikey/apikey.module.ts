import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { Apikey } from './apikey.entity';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../shared/config/typeorm.config.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([Apikey]),
    SharedModule,
    AuthModule,
  ],
  controllers: [ApikeyController],
  providers: [ApikeyService],
})
export class ApikeyModule {}
