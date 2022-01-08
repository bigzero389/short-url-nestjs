import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Apikey } from './apikey.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PostApikeyDto {
  @ApiProperty({ description: '사용자 계정 ID, = 조건', example: 'shortUser01' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'apikey 정보 만료일자', example: '20251231235959' })
  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  endDatetime: string;

  @ApiProperty({ description: 'apikey 정보 시작일자', example: '20200101000000' })
  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  beginDatetime: string;

  @ApiProperty({ description: 'apikey, 자동으로 부여된다.', example: '' })
  @IsString()
  @IsOptional()
  apikey: string;
}

class ApikeyUpdateConditions {
  @ApiProperty({ description: 'apikey', example: '' })
  @IsString()
  @IsOptional()
  apikey: string;

  @ApiProperty({ description: '사용자 계정 ID, = 조건', example: 'shortUser01' })
  @IsString()
  @IsOptional()
  accountId: string;
}

export class PutApikeyDto {
  @ApiProperty({ description: '사용자 계정 ID', example: 'shortUser01' })
  @IsString()
  @IsOptional()
  accountId: string;

  @ApiProperty({ description: 'apikey 정보 만료일자', example: '20251231235959' })
  @IsString()
  @Length(14, 14)
  @IsOptional()
  endDatetime: string;

  @ApiProperty({ description: 'apikey 정보 시작일자', example: '20200101000000' })
  @IsString()
  @Length(14, 14)
  @IsOptional()
  beginDatetime: string;

  @ApiProperty({ description: 'apikey', example: '' })
  @IsString()
  @IsOptional()
  apikey: string;

  @ApiProperty({ description: 'apikey update conditions', type: ApikeyUpdateConditions })
  @IsNotEmpty()
  updateConditions: ApikeyUpdateConditions;
}

export class CreateApikeyDto extends Apikey {}
