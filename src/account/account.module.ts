import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [AccountService],

})
export class AccountModule {}
