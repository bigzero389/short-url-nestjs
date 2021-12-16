import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, } from 'class-validator';
import { Account } from './account.entity';

export class PostAccountDto {
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

export class PutAccountDto {
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

  @IsString()
  @IsOptional()
  remark: string;

  @IsString()
  @Length(14, 14)
  @IsOptional()
  endDatetime: string;

  @IsString()
  @Length(14, 14)
  @IsOptional()
  beginDatetime: string;

  @IsNotEmpty()
  updateWhereOptions: UpdateWhereOptions;
}



export class CreateAccountDto extends Account {}

// update entity dto 는 형태를 고정할 수 없으므로 필요없다.
// export class UpdateAccountDto extends PartialType(Account) {}
