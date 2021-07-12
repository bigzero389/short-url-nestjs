/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, minLength, maxLength, Length } from 'class-validator';

export class ReqUrlDto {

  @ApiProperty({ description: 'origin_url' })
  @IsString()
  originUrl: string;

  @IsString() @Length(14,14)
  endDateTime: string;
}
