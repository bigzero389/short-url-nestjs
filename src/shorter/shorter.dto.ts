/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Shorter } from './shorter.entity';

export class PostShorterDto {

  @ApiProperty({ description: 'short url pk, 자동생성된다. ' })
  shortUrlId: string;

  @ApiProperty({ description: 'short url 정보' })
  @IsString()
  @IsOptional()
  shortUrl: string;

  @ApiProperty({ description: 'short url의 apikey' })
  @IsNotEmpty()
  apikey: string;

  @ApiProperty({ description: 'short url로 변경할 target url(origin url), short url 호출시 origin url로 redirect 된다.' })
  @IsString()
  @IsNotEmpty()
  originUrl: string;

  @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)' })
  @Length(14,14)
  endDatetime: string;

  @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)' })
  @Length(14,14)
  beginDatetime: string;

  @IsNumber({allowNaN: false})
  shortUrlCnt: number = 0;
}

class UpdateWhereOptions {
  @IsString()
  @IsNotEmpty()
  shortUrlId: string;
}

export class PutShorterDto {

  @ApiProperty({ description: 'short url pk, 자동생성된다. ' })
  shortUrlId: string;

  @ApiProperty({ description: 'short url 정보' })
  @IsString()
  shortUrl: string;

  @ApiProperty({ description: 'short url의 apikey' })
  @IsNotEmpty()
  apikey: string;

  @ApiProperty({ description: 'short url로 변경할 target url(origin url), short url 호출시 origin url로 redirect 된다.' })
  @IsString()
  @IsNotEmpty()
  originUrl: string;

  @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)' })
  @Length(14,14)
  endDatetime: string;

  @IsNumber({allowNaN: false})
  shortUrlCnt: number = 0;

  @IsNotEmpty()
  updateWhereOptions: UpdateWhereOptions;
}

export class CreateShorterDto extends Shorter{}