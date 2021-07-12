import { Module } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShorterController } from './shorter.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ShorterController],
  providers: [ShorterService],
})
export class ShorterModule {}
