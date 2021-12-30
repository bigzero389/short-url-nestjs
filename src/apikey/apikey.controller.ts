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

@Controller('apikey')
@UseGuards(AuthGuard)
export class ApikeyController {
  private static readonly LOGGER = new Logger(ApikeyController.name);
  constructor(readonly apikeyService: ApikeyService) {}

  @Post()
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
