import { Body, Controller, Get, Post, Headers, Req, Logger, Inject, CACHE_MANAGER, Query, UseGuards } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { PostShorterDto } from './shorter.dto';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import { DateUtil } from '../shared/util/dateUtil';
import { ResultDto } from '../shared/result.dto';
import { ResultMsg } from '../shared/result-msg';
import { ResultCode } from '../shared/result-code';
import { map } from 'rxjs/operators';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Shorter } from './shorter.entity';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostApikeyDto } from '../apikey/apikey.dto';

@ApiTags('Short Url 관리')
@Controller('shorter')
@UseGuards(AuthGuard)
export class ShorterController {
  private static readonly LOGGER = new Logger(ShorterController.name);
  constructor(
    private readonly shorterService: ShorterService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'short 정보 생성', description: 'short 정보 생성' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiBody({ type: PostShorterDto })
  create(@Headers() headers, @Body() postDto: PostShorterDto) {
    // 여기서 부터
    const result: ResultDto = new ResultDto();

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
    const SHORTER_SCHEMA = this.configService.get<string>('SHORTER_SCHEMA');
    const SHORTER_URL = this.configService.get<string>('SHORTER_URL');
    const SHORTER_PORT = this.configService.get<string>('SHORTER_PORT');
    const SHORTER_DOCBASE = this.configService.get<string>('SHORTER_DOCBASE');
    const config_url = `${SHORTER_SCHEMA}://${SHORTER_URL}:${SHORTER_PORT}/${SHORTER_DOCBASE}`;
    /* postDto.shorterKey = this.shorterService.makeTestShorterKey(postDto.originUrl); */
    // 중복되지 않은 redisKey 를 가져온다.
    const value = from( this.shorterService.makeShorterKey(postDto.originUrl), );
    return value.pipe(
      // redisKey를 이용하여 postDto 의 값을 채운다. shorterKey, shortUrl
      map((redisKey) => {
        postDto.shortKey = redisKey;
        postDto.shortUrl = config_url + '/' + postDto.shortKey;
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

  @Get('/cache')
  @ApiOperation({ summary: '서버 시간 조회', description: 'redis 에서 제공하는 시간정보를 조회한다.' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiQuery( { name: 'id', description: 'redis 시간정보를 요청할 key id', example: 'time', required: true}, )
  async getCacheTime(@Query('id') id: string): Promise<string> {
    const savedTime = await this.shorterService.getCacheTime(id);
    if (savedTime) {
      return savedTime;
    }
  }

  @Get()
  @ApiOperation({ summary: 'short list 정보조회', description: 'query 정보에 따른 short 정보 리스트 조회', })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiQuery( { name: 'apikey', description: 'apikey , = 검색', example: '', required: false }, )
  @ApiQuery( { name: 'originUrl', description: 'origin url, = 검색', example: '', required: false }, )
  @ApiQuery( { name: 'apikey', description: 'apikey , = 검색', example: '', required: false }, )
  @ApiQuery( { name: 'shortUrl', description: 'short url, = 검색', example: '', required: false }, )
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

  @Get('short')
  @ApiOperation({ summary: 'short url 1건 정보조회', description: 'apikey 와 origin url 정보에 의한 short url 조회', })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiQuery( { name: 'apikey', description: 'apikey , = 검색', example: '', required: true }, )
  @ApiQuery( { name: 'originUrl', description: 'origin url, = 검색', example: 'http://test.test.net', required: true }, )
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
}
