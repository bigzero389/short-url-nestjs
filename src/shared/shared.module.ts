import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './config/typeorm.config.service';

@Module({
  providers: [TypeOrmConfigService],
})
export class SharedModule {}
