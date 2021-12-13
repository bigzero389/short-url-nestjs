import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Account } from './account.entity';

export class PostReqDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

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

class UpdateWhereOptions {
  @IsString()
  @IsOptional()
  accountId: string;

  @IsString()
  @IsOptional()
  accountName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  tel: string;
}
export class PutReqDto extends PartialType(PostReqDto) {
  @IsNotEmpty()
  updateWhereOptions: UpdateWhereOptions;
}
export class CreateAccountDto extends Account {}
export class UpdateAccountDto extends PartialType(Account) {}
