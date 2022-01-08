import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LikeType, ObjUtil } from '../shared/util/objUtil';
import { from, Observable } from 'rxjs';
import { ResultDto } from '../shared/result.dto';
import { map } from 'rxjs/operators';
import { ResultCode } from '../shared/result-code';
import { ResultMsg } from '../shared/result-msg';
import { CreateApikeyDto, PostApikeyDto, PutApikeyDto } from './apikey.dto';
import { ApikeyService } from './apikey.service';
import * as Hash from 'object-hash';
import { Apikey } from './apikey.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostAccountDto, PutAccountDto } from '../account/account.dto';

@ApiTags('ApiKey 관리')
@Controller('apikey')
@UseGuards(AuthGuard)
export class ApikeyController {
  private static readonly LOGGER = new Logger(ApikeyController.name);
  constructor(readonly apikeyService: ApikeyService) {}

  @Post()
  @ApiOperation({ summary: 'apikey 생성', description: 'apikey 정보 생성' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiBody({ type: PostApikeyDto })
  create(@Body() postDto: PostApikeyDto) {
    ApikeyController.LOGGER.debug('create postApikeyDto: ' + JSON.stringify(postDto));
    // apikey를 accountId 와 date seed로 random 생성.
    postDto.apikey = Hash({ account_id: postDto.accountId, time: new Date(), });
    const serviceResult = from(this.apikeyService.create(postDto));

    const resultDto = new ResultDto();
    return serviceResult.pipe(
      map((apikey) => {
        console.log(apikey);
        if (apikey && apikey.apikey) {
          return { apikey, ...resultDto, isSuccess: true };
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return { apikey, ...resultDto };
        }
      }),
    );
  }

  @Get(':apikey')
  @ApiOperation({ summary: 'apikey 정보조회', description: 'apikey 에 따른 api 1건 정보조회' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiParam({ name: 'apikey', description: 'apikey', example: '' })
  getOne(@Param() params): Observable<Apikey> {
    const apikeyList = from(this.apikeyService.getOne(params.apikey));
    return apikeyList.pipe(
      map((apikeys) => {
        console.log(apikeys);
        return apikeys;
      }),
    );
  }

  @Get()
  @ApiOperation({ summary: 'apikey list 정보조회', description: 'query 정보에 따른 api 정보 리스트 조회', })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiQuery( { name: 'apikey', description: 'apikey , like 검색', example: '', required: false }, )
  @ApiQuery( { name: 'accountId', description: 'account id, = 검색', example: 'shortUser01', required: false }, )
  @ApiQuery( { name: 'email', description: 'email, 앞에서 부터 like 검색', example: 'tes', required: false }, )
  @ApiQuery( { name: 'accountName', description: 'account 이름, like 검색', example: '길동', required: false }, )
  @ApiQuery( { name: 'tel', description: '전화번호, like 검색', example: '010', required: false }, )
  get(@Req() req): Observable<Apikey[]> {
    const getQueryParam = req.query;
    ApikeyController.LOGGER.debug('get param: ' + JSON.stringify(getQueryParam));

    const apikeyList = from(this.apikeyService.get(getQueryParam));
    return apikeyList.pipe(
      map((result) => {
        ApikeyController.LOGGER.debug('get: ' + JSON.stringify(result));
        return result;
      }),
    );
  }

  @Delete(':apikey')
  @ApiOperation({ summary: 'api 정보 삭제', description: 'apikey 정보에 의한 1건 삭제', })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiParam( { name: 'apikey', description: 'apikey, = 검색', example: '', required: true }, )
  deleteOne(@Param() params): Observable<ResultDto> {
    const resultDto = new ResultDto();
    const result = from(this.apikeyService.deleteOne(params.apikey));
    return result.pipe(
      map((result) => {
        ApikeyController.LOGGER.debug('deleteOne result: ' + JSON.stringify(result));
        if (result.affected != undefined) {
          resultDto.isSuccess = true;
          resultDto.resultCnt = result.affected;
          resultDto.resultMsg = 'deleted record count is ' + result.affected;
          return resultDto;
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return resultDto;
        }
      }),
    );
  }

  @Put()
  @ApiOperation({ summary: 'api 수정', description: 'api 정보 수정' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiBody({ type: PutApikeyDto })
  update(@Body() putApikeyDto: PutApikeyDto): Observable<ResultDto> {
    ApikeyController.LOGGER.debug( 'update putApikeyDto: ' + JSON.stringify(putApikeyDto), );

    const result = from( this.apikeyService.update(putApikeyDto), );
    const resultDto = new ResultDto();
    return result.pipe(
      map((result) => {
        ApikeyController.LOGGER.debug(
          'update result: ' + JSON.stringify(result),
        );
        if (result.affected != undefined) {
          resultDto.resultCnt = result.affected;
          resultDto.isSuccess = true;
          resultDto.resultMsg = 'updated record count is ' + result.affected;
          return resultDto;
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return resultDto;
        }
      }),
    );
  }
}
