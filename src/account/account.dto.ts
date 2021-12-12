import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Account } from './account.entity';

export class ReqAccountDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  tel: string;

  @IsString()
  remark: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  endDatetime: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  beginDatetime: string;
}

export class CreateAccountDto extends PartialType(Account) {}
export class UpdateAccountDto extends PartialType(Account) {}
