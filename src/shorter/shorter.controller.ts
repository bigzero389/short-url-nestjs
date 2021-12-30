import { Body, Controller, Get, Post, Headers, Req, Logger, Inject, CACHE_MANAGER, Query, } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';

@Controller('shorter')
export class ShorterController {
  private static readonly LOGGER = new Logger(ShorterController.name);
  constructor(
    private readonly shorterService: ShorterService,
    private readonly configService: ConfigService,
  ) {}

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
    ShorterController.LOGGER.debug(
      'get param: ' + JSON.stringify(getQueryParam),
    );

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
    if (!postDto.originUrl) {
      result.isSuccess = false;
      result.resultCode = ResultCode.E120;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E120);
      return of(result);
    }

    // end_date and period 체크
    if (!postDto.endDatetime || !DateUtil.isValidTimestamp(postDto.endDatetime)) {
      //** 최대 1년 이내처리 추가 고민
      result.isSuccess = false;
      result.resultCode = ResultCode.E130;
      result.resultMsg = ResultMsg.getResultMsg(ResultCode.E130);
      return of(result);
    }

    if (!postDto.beginDatetime) {
      postDto.beginDatetime = DateUtil.getNowformatKOR('YYYYMMDDHHmmss');
    }

    const resultDto: ResultDto = new ResultDto();
    const config_url = `${this.configService.get<string>('HTTP_SCHEMA')}://${this.configService.get<string>('SHORTER_URL')}:${this.configService.get<string>('SHORTER_PORT')}`;
    /* postDto.shorterKey = this.shorterService.makeTestShorterKey(postDto.originUrl); */
    // 중복되지 않은 redisKey 를 가져온다.
    const value = from( this.shorterService.makeShorterKey(postDto.originUrl), );
    return value.pipe(
      // redisKey를 이용하여 postDto 의 값을 채운다. shorterKey, shortUrl
      map((redisKey) => {
        postDto.shorterKey = redisKey;
        postDto.shortUrl = config_url + '/' + postDto.shorterKey;
        return postDto;
      }),
      // 완성된 postDto를 이용하여 DB와 redis 에 값을 넣는다.
      map((postDto) => {
        ShorterController.LOGGER.debug(`postDto : ${JSON.stringify(postDto)}`);
        return this.shorterService.create(postDto).then((shorter) => {
          if (shorter && shorter.short_url) {
            return { shorter, ...resultDto, isSuccess: true };
          } else {
            resultDto.isSuccess = false;
            resultDto.resultCode = ResultCode.E500;
            resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
            return { shorter, ...resultDto };
          }
        });
      }),
    );
  }
}
