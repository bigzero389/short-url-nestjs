import { Body, Controller, Get, Post, Headers, Req, Logger, Inject, CACHE_MANAGER, Query } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { PutShorterDto, PostShorterDto } from './shorter.dto';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import { DateUtil } from '../shared/util/dateUtil';
import { ResultDto } from '../shared/result.dto';
import { ResultMsg } from '../shared/result-msg';
import { ResultCode } from '../shared/result-code';
import { map } from 'rxjs/operators';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Shorter } from './shorter.entity';
import * as Hash from 'object-hash';

@Controller('shorter')
export class ShorterController {
  private static readonly LOGGER = new Logger(ShorterController.name);
  constructor(private readonly shorterService: ShorterService) {}

  @Get('/cache')
  async getCacheTime(@Query('id') id: string): Promise<string> {
    const savedTime = await this.shorterService.getCacheTime(id);
    if (savedTime) {
      return savedTime;
    }
  }

  @Get()
  get(@Req() req): Observable<Shorter[]> {
    const getQueryParam = req.query;
    ShorterController.LOGGER.debug('get param: ' + JSON.stringify(getQueryParam));

    const shorterList = from(this.shorterService.get(getQueryParam));
    return shorterList.pipe(
      map((result) => {
        ShorterController.LOGGER.debug('get: ' + JSON.stringify(result));
        return result;
      }),
    );
  }

  @Get('origin')
  getOriginUrl(@Req() req): Observable<Shorter> {
    const getQueryParam = req.query;
    if (!getQueryParam.apikey || !getQueryParam.shortUrl) {
      return of(new Shorter());
    }
    const shorterList = from(this.shorterService.get(getQueryParam, true));
    return shorterList.pipe(
      map((result) => {
        return result[0];
      }),
    );
  }

  @Get('short')
  getShortUrl(@Req() req): Observable<Shorter> {
    const getQueryParam = req.query;
    if (!getQueryParam.apikey || !getQueryParam.originUrl) {
      return of(new Shorter());
    }
    const shorterList = from(this.shorterService.get(getQueryParam, true));
    return shorterList.pipe(
      map((result) => {
        return result[0];
      }),
    );
  }

  deleteOne(shortUrlId: string): Observable<DeleteResult> {
    return new Observable<DeleteResult>((result) => {
      return result;
    });
  }

  update(putShorterDto: PutShorterDto): Observable<UpdateResult> {
    return new Observable<UpdateResult>((result) => {
      return result;
    });
  }

  @Post()
  create(@Headers() headers, @Body() postDto: PostShorterDto) {
    // 여기서 부터
    console.log(headers);
    const contentType = headers['content-type'] ?? '';
    const apikey = headers['shorten_api_key'] ?? '';
    const originUrl = postDto.originUrl ?? '';
    const endDatetime = postDto.endDatetime ?? '';

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

    // TODO : Custom class validator 구현 확인. 문자열 스트링을 Date 포맷으로 검증할 수 있는 지 확인.
    // end_date and period 체크
    if (!endDatetime || !DateUtil.isValidDateTime(endDatetime)) {
      //** 최대 1년 이내처리 추가 고민
      result.isSuccess = false;
      result.resultCode = ResultCode.E130;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E130);
      return of(result);
    }

    const resultDto: ResultDto = new ResultDto();
    // TODO : config 처리 필요.
    const config_url = 'http://localhost:3000';
    postDto.shorterKey = this.makeShorterKey(postDto.originUrl);
    postDto.shortUrl = config_url + postDto.shorterKey;
    const shortUrlEntity = from(this.shorterService.create(postDto));
    return shortUrlEntity.pipe(
      map((shorter) => {
        if (shorter && shorter.short_url) {
          return { shorter, ...resultDto, isSuccess: true };
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return { shorter, ...resultDto };
        }
      }),
    );
  }

  makeShorterKey(originUrl: string) {
    // TODO : short url 생성. 7자리로 변환 필요
    const result = Hash({ origin_url: originUrl, time: new Date(), });
    return result;
  }
}
