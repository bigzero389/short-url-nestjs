import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Account } from '../account/account.entity';
import { Apikey } from './apikey.entity';

export class PostApikeyDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  endDatetime: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  beginDatetime: string;

  @IsString()
  @IsOptional()
  apikey: string;
}

class UpdateWhereOptions {
  @IsString()
  @IsOptional()
  apikey: string;

  @IsString()
  @IsOptional()
  accountId: string;
}

export class PutApikeyDto {
  @IsString()
  @IsOptional()
  accountId: string;

  @IsString()
  @Length(14, 14)
  @IsOptional()
  endDatetime: string;

  @IsString()
  @Length(14, 14)
  @IsOptional()
  beginDatetime: string;

  @IsString()
  @IsOptional()
  apikey: string;

  @IsOptional()
  updateWhereOptions: UpdateWhereOptions;
}

export class CreateApikeyDto extends Apikey {}
