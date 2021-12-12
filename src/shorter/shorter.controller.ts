import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ShortUrlDto } from './short-url.dto';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import { DateUtil } from '../shared/util/dateUtil';
import { ResultDto } from '../shared/dto/result.dto';
import { ResultMsg } from '../shared/result-msg';
import { ResultCode } from '../shared/result-code';
import { map } from 'rxjs/operators';

@Controller('shorter')
export class ShorterController {
  constructor(private readonly shorterService: ShorterService) {}

  @Get()
  getHello(): string {
    return this.shorterService.getHello();
  }

  @Post()
  createUrl(@Headers() headers, @Body() dto: ShortUrlDto) {
    // 여기서 부터
    console.log(headers);
    const contentType = headers['content-type'] ?? '';
    const apikey = headers['shorten_api_key'] ?? '';
    const originUrl = dto.originUrl ?? '';
    const endDatetime = dto.endDatetime ?? '';

    // json type 여부 체크.
    const result: ResultDto = new ResultDto();
    if (contentType != 'application/json') {
      result.isSuccess = false;
      result.resultCode = ResultCode.E100;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E100);
      return of(result);
    }

    // api key 체크.
    if (apikey && apikey != 'bigzeroKey') {
      // ** apiKey 정상여부 체크
      result.isSuccess = false;
      result.resultCode = ResultCode.E110;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E110);
      return of(result);
    }
    // 여기까지는 filter 로 이동해야 함.

    // target_url 체크
    if (!originUrl) {
      result.isSuccess = false;
      result.resultCode = ResultCode.E120;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E120);
      return of(result);
    }

    // end_date and period 체크
    if (!endDatetime || !DateUtil.isValidDateTime(endDatetime)) {
      //** 최대 1년 이내처리 추가 고민
      result.isSuccess = false;
      result.resultCode = ResultCode.E130;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E130);
      return of(result);
    }

    const shortUrlEntity = from(this.shorterService.createShortUrl(dto));
    return shortUrlEntity.pipe(
      map((entity) => {
        console.log(entity);
        return { shortUrl: entity.short_url, ...result, isSuccess: true };
      }),
      catchError((err, result) => {
        console.error(err);
        return result;
      }),
    );
  }
}
