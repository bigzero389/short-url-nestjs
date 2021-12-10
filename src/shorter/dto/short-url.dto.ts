/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ShortUrlDto {

  @ApiProperty({ description: 'short url로 변경할 target url(origin url), short url 호출시 origin url로 redirect 된다.' })
  @IsString()
  @IsNotEmpty()
  originUrl: string;

  @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)' })
  @IsString() @Length(14,14)
  endDatetime: string;
}
