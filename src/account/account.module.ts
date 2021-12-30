import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AccountController } from './account.controller';
import { SharedModule } from '../shared/shared.module';
import { CustomNamingStrategy } from '../shared/config/custom-naming-strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../shared/config/typeorm.config.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // TODO : PK constraint 와 FK constraint 등의 이름 지정 필요.
    // TypeOrmModule.forRoot({ namingStrategy: new CustomNamingStrategy() }),
    // TypeOrmModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([Account]),
    SharedModule,
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
