import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ReqUrlDto } from './dto/req-url.dto';
import { ShortUrl } from './entities/short-url.entity';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResUrlDto } from './dto/res-url.dto';
import { ShortUrlDateUtil } from '../shared/shared.dateUtil';

@Controller('shorter')
export class ShorterController {
  constructor(private readonly shorterService: ShorterService) {}

  @Get()
  getHello(): string {
    return this.shorterService.getHello();
  }

  @Post()
  createUrl(@Headers() headers, @Body() reqUrlDto: ReqUrlDto): ResUrlDto {
    console.log(headers);
    const resUrlDto: ResUrlDto = new ResUrlDto();
    const contentType = headers['content-type'] ?? '';
    const apiKey = headers['shorten_api_key'] ?? '';
    const originUrl = reqUrlDto.originUrl ?? '';
    const endDateTime = reqUrlDto.endDateTime ?? '';

    // json type 여부 체크.
    if (contentType == 'application/json') {
      resUrlDto.setApiResult(true);
    } else {
      resUrlDto.setApiResult(false, 'E100', 'content-type error');
    }

    // api key 체크.
    if (apiKey && apiKey == 'bigzeroKey') {
      // ** apiKey 정상여부 체크
      resUrlDto.setApiResult(true);
    } else {
      resUrlDto.setApiResult(false, 'E200', 'api key error');
    }

    // target_url 체크
    if (originUrl) {
      resUrlDto.setApiResult(true);
    } else {
      resUrlDto.setApiResult(false, 'E300', 'origin url error');
    }

    // end_date and period 체크
    if (endDateTime && ShortUrlDateUtil.isValidDateTime(endDateTime)) {
      //** 최대 1년 이내처리

      resUrlDto.setApiResult(true);
    } else {
      resUrlDto.setApiResult(false, 'E400', 'endDateTime error');
    }

    if (resUrlDto.apiResult) {
      const shortUrl = from(this.shorterService.createShortUrl(reqUrlDto));
      shortUrl.subscribe(
        (result) => {
          console.log(result.shortUrl);
          resUrlDto.shortUrl = result.shortUrl;
          resUrlDto.apiKey = result.apiKey;
          resUrlDto.endDateTime = result.endDateTime;
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      console.error(
        '[SHORT URL RESULT]: %s, [SHORT URL CODE]: %s [SHORT URL MESSAGE]: %s',
        resUrlDto.apiResult,
        resUrlDto.apiResultCode,
        resUrlDto.apiResultMsg,
      );
    }
    return resUrlDto;
  }
}
