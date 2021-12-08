import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAccountDto {
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
  readonly endDateTime: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  readonly beginDateTime: string;
}
