import { Body, Controller, Get, Logger, Param, Post, Req } from '@nestjs/common';
import { LikeType, ObjUtil } from '../shared/util/objUtil';
import { from, Observable } from 'rxjs';
import { ResultDto } from '../shared/result.dto';
import { map } from 'rxjs/operators';
import { ResultCode } from '../shared/result-code';
import { ResultMsg } from '../shared/result-msg';
import { CreateApikeyDto, PostApikeyDto } from './apikey.dto';
import { ApikeyService } from './apikey.service';
import * as Hash from 'object-hash';
import { Account } from '../account/account.entity';
import { Apikey } from './apikey.entity';

@Controller('apikey')
export class ApikeyController {
  private static readonly LOGGER = new Logger(ApikeyController.name);
  constructor(readonly apikeyService: ApikeyService) {}

  @Post()
  create(@Body() postDto: PostApikeyDto) {
    ApikeyController.LOGGER.debug('create postApikeyDto: ' + JSON.stringify(postDto));

    const createApikeyDto: CreateApikeyDto = new CreateApikeyDto();
    Object.assign(createApikeyDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const hashSeed = {
      account_id: createApikeyDto.account_id,
      time: new Date(),
    };
    createApikeyDto.apikey = Hash(hashSeed);
    const serviceResult = from(this.apikeyService.create(createApikeyDto));

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
    const targetObj = req.query;
    const conditionMap = new Map<string, LikeType>([
      ['apikey', LikeType.NOT],
      ['accountName', LikeType.ALL],
    ]);
    // @TODO : conditions 생성을 service 에서 하고 controller 에서는 conditionMap 만 넘겨줘야 될듯...
    const conditions = ObjUtil.condition(conditionMap, targetObj);
    ApikeyController.LOGGER.debug('conditions: ' + JSON.stringify(conditions));

    const apikeyList = from(this.apikeyService.get(conditions));
    return apikeyList.pipe(
      map((result) => {
        ApikeyController.LOGGER.debug('get: ' + JSON.stringify(result));
        return result;
      }),
    );
  }
}
