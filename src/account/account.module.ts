import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Account]),
    SharedModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
