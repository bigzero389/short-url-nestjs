/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, minLength, maxLength, Length } from 'class-validator';

export class ReqUrlDto {

  @ApiProperty({ description: 'short url로 변경할 target url(origin url), short url 호출시 origin url로 redirect 된다.' })
  @IsString()
  originUrl: string;

  @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)' })
  @IsString() @Length(14,14)
  endDateTime: string;
}
