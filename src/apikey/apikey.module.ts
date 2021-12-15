import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { Apikey } from './apikey.entity';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Apikey]),
    SharedModule,
  ],
  controllers: [ApikeyController],
  providers: [ApikeyService],
})
export class ApikeyModule {}
