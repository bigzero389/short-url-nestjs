/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class ReqUrlDto {

  @ApiProperty({ description: 'target_url' })
  @IsString()
  readonly target_url: string;

  @IsOptional()
  // @IsDateString()
  readonly end_date_ISO8601: string;

  @IsNumber()
  @IsOptional()
  readonly period_second: number;
}
