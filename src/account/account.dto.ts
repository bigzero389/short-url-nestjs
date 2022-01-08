import { isEmail, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Account } from './account.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PostAccountDto {
  @ApiProperty({ description: '사용자 계정 ID', example: 'shortUser01' })
  @IsString()
  @Length(0, 50)
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ description: '사용자 이메일', example: 'test@gmail.com', type: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '사용자 전화번호, 숫자만 가능.', example: '0101239999', type: 'telno' })
  @IsString()
  @Length(7, 20)
  @IsNotEmpty()
  tel: string;

  @ApiProperty({ description: '비고', example: '', required: false })
  @IsString()
  @Length(0, 1000)
  remark: string;

  @ApiProperty({ description: 'account 정보 만료일자', example: '20251231235959' })
  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  endDatetime: string;

  @ApiProperty({ description: 'account 정보 시작일자', example: '20200101000000' })
  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  beginDatetime: string;
}

class AccountUpdateConditions {
  @ApiProperty({ description: '사용자 계정 ID, = 조건', example: 'shortUser01' })
  @IsString()
  @IsOptional()
  accountId: string;

  @ApiProperty({ description: '사용자 이름 = 조건', example: '' })
  @IsString()
  @IsOptional()
  accountName: string;

  @ApiProperty({ description: '사용자 이메일 = 조건', example: '', type: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: '사용자 전화번호, 숫자만 가능.', example: '', type: 'telno' })
  @IsString()
  @IsOptional()
  tel: string;
}

export class PutAccountDto {
  @ApiProperty({ description: '사용자 계정 ID', example: 'shortUser01' })
  @IsString()
  @IsOptional()
  accountId: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  @IsOptional()
  accountName: string;

  @ApiProperty({ description: '사용자 이메일', example: 'test@gmail.com', type: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: '사용자 전화번호, 숫자만 가능.', example: '0101239999', type: 'telno' })
  @IsString()
  @IsOptional()
  tel: string;

  @ApiProperty({ description: '비고', example: '', required: false })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({ description: 'account 정보 만료일자', example: '20251231235959' })
  @IsString()
  @Length(14, 14)
  @IsOptional()
  endDatetime: string;

  @ApiProperty({ description: 'account 정보 시작일자', example: '20200101000000' })
  @IsString()
  @Length(14, 14)
  @IsOptional()
  beginDatetime: string;

  @ApiProperty({ description: 'apikey update conditions', type: AccountUpdateConditions })
  @IsNotEmpty()
  updateConditions: AccountUpdateConditions;
}

export class CreateAccountDto extends Account {}

// update entity dto 는 형태를 고정할 수 없으므로 필요없다.
// export class UpdateAccountDto extends PartialType(Account) {}
