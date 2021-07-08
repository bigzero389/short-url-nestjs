/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class ResUrlDto {

  @IsBoolean()
  api_res_result: boolean;

  @IsString()
  api_res_msg: string;

  @IsString()
  api_key: string;

  @ApiProperty({ description: '변환이전 origin url' })
  @IsString()
  readonly origin_url: string;

  @ApiProperty({ description: '변환이후 shorten url' })
  @IsString()
  shorten_url: string;

  @IsString()
  end_date: string;
}
