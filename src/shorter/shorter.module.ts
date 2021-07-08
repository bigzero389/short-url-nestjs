import { Module } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShorterController } from './shorter.controller';

@Module({
  controllers: [ShorterController],
  providers: [ShorterService],
})
export class ShorterModule {}
