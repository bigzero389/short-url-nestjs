/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiResult } from './api-result';

export class ResUrlDto extends ApiResult {

  @IsString()
  apiKey: string;

  @ApiProperty({ description: '변환이전 origin url' })
  @IsString()
  originUrl: string;

  @ApiProperty({ description: '변환이후 short url' })
  @IsString()
  shortUrl: string;

  @IsString()
  endDateTime: string;

}
