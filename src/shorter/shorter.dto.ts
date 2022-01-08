import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Shorter } from './shorter.entity';

export class PostShorterDto {
  // @ApiProperty({ description: 'short url pk, 자동생성된다. ' })
  // shortUrlId: string;

  // @ApiProperty({ description: 'short url 정보' })
  @IsOptional()
  @IsString()
  shortUrl: string;

  @ApiProperty({ description: 'short url의 apikey', required: true, example: '' })
  @IsNotEmpty()
  apikey: string;

  @ApiProperty({ description: 'short url로 변경할 target url(origin url), short url 호출시 origin url로 redirect 된다.', required: true , example: 'http://test.test.net'})
  @IsNotEmpty()
  @IsString()
  originUrl: string;

  @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)', example: '20251231235959' })
  @IsNotEmpty()
  @Length(14,14)
  endDatetime: string;

  // @ApiProperty({ description: '서비스시작일시(yyyyMMddHH24miss)', example: '20000101000000' })
  @IsOptional()
  @Length(14,14)
  beginDatetime: string;

  // @ApiProperty({ description: 'short url click count 를 저장한다.' })
  // @IsNumber({allowNaN: false})
  // shortUrlCnt: number = 0;

  // @ApiProperty({ description: '사용자에게 제공할 short url 문자열' })
  @IsOptional()
  shortKey: string;
}

// class UpdateWhereOptions {
//   @ApiProperty({ description: '변경할 short 정보의 id(pk), = 조건', example: '' })
//   @IsNotEmpty()
//   @IsString()
//   shortUrlId: string;
// }
//
// export class PutShorterDto {
//
//   @ApiProperty({ description: 'short url pk, 자동생성된다. ' })
//   shortUrlId: string;
//
//   @ApiProperty({ description: 'short url 정보' })
//   @IsString()
//   shortUrl: string;
//
//   @ApiProperty({ description: 'short url의 apikey' })
//   @IsNotEmpty()
//   apikey: string;
//
//   @ApiProperty({ description: 'short url로 변경할 target url(origin url), short url 호출시 origin url로 redirect 된다.' })
//   @IsNotEmpty()
//   @IsString()
//   originUrl: string;
//
//   @ApiProperty({ description: '서비스종료일시(yyyyMMddHH24miss)' })
//   @Length(14,14)
//   endDatetime: string;
//
//   @ApiProperty({ description: 'short url click count 를 저장한다.' })
//   @IsNumber({allowNaN: false})
//   shortUrlCnt: number = 0;
//
//   @ApiProperty( { type: UpdateWhereOptions })
//   @IsNotEmpty()
//   updateWhereOptions: UpdateWhereOptions;
// }

export class CreateShorterDto extends Shorter {}
