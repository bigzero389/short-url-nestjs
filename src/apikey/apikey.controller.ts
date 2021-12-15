import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ObjUtil } from '../shared/util/objUtil';
import { from } from 'rxjs';
import { ResultDto } from '../shared/result.dto';
import { map } from 'rxjs/operators';
import { ResultCode } from '../shared/result-code';
import { ResultMsg } from '../shared/result-msg';
import { CreateApikeyDto, PostApikeyDto } from './apikey.dto';
import { ApikeyService } from './apikey.service';
import * as Hash from 'object-hash';

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
}
