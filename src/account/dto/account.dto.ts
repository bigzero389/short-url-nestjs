import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsNull } from 'typeorm';

export class AccountDto {
  @IsString()
  @IsNotEmpty()
  readonly accountId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly tel: string;

  @IsString()
  readonly remark: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  readonly endDatetime: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  readonly beginDatetime: string;
}
