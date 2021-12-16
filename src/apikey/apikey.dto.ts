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

export class CreateApikeyDto extends Apikey {}
