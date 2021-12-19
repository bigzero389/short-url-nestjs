import { Module } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShorterController } from './shorter.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shorter } from './shorter.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Shorter]),
    SharedModule],
  controllers: [ShorterController],
  providers: [ShorterService],
})
export class ShorterModule {}
