import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Account } from './account.entity';
import { CreateAccountDto, PostReqDto, PutReqDto, UpdateAccountDto } from './account.dto';
import { ResultDto } from '../shared/result.dto';
import { LikeType, ObjUtil } from '../shared/util/objUtil';
import { ResultCode } from '../shared/result-code';
import { ResultMsg } from '../shared/result-msg';
import { FindConditions, Like } from 'typeorm';

@Controller('account')
export class AccountController {
  private static readonly LOGGER = new Logger(AccountController.name);
  constructor(readonly accountService: AccountService) {}

  @Get(':accountId')
  getOne(@Param() params): Observable<Account> {
    const accountList = from(this.accountService.getOne(params.accountId));
    return accountList.pipe(
      map((accounts) => {
        console.log(accounts);
        return accounts;
      }),
    );
  }

  @Get()
  get(@Req() req): Observable<Account[]> {
    const targetObj = req.query;
    const conditionMap = new Map<string, LikeType>([
      ['accountId', LikeType.NOT],
      ['accountName', LikeType.ALL],
      ['email', LikeType.RIGHT],
      ['tel', LikeType.ALL],
    ]);
    const conditions = ObjUtil.condition(conditionMap, targetObj);
    AccountController.LOGGER.debug('conditions: ' + JSON.stringify(conditions));

    const accountList = from(this.accountService.get(conditions));
    return accountList.pipe(
      map((result) => {
        AccountController.LOGGER.debug('get: ' + JSON.stringify(result));
        return result;
      }),
    );
  }

  @Post()
  create(@Body() postReqDto: PostReqDto) {
    AccountController.LOGGER.debug('create postReqDto: ' + JSON.stringify(postReqDto));
    const createAccountDto: CreateAccountDto = new CreateAccountDto();
    Object.assign(createAccountDto, ObjUtil.camelCaseKeysToUnderscore(postReqDto));

    const serviceResult = from(this.accountService.create(createAccountDto));

    const resultDto = new ResultDto();
    return serviceResult.pipe(
      map((account) => {
        console.log(account);
        if (account && account.account_id) {
          return { account, ...resultDto, isSuccess: true };
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return { account, ...resultDto };
        }
      }),
    );
  }

  @Delete(':id')
  deleteOne(@Param() params): Observable<ResultDto> {
    const resultDto = new ResultDto();
    const conditions: FindConditions<Account> = { account_id: params.id }
    const result = from(this.accountService.deleteOne(conditions));
    return result.pipe(
      map((result) => {
        AccountController.LOGGER.debug('deleteOne result: ' + JSON.stringify(result));
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
  update(@Body() putReqDto: PutReqDto): Observable<ResultDto> {
    AccountController.LOGGER.debug('update putReqDto: ' + JSON.stringify(putReqDto));

    // where 절 동적 생성 부분.
    const targetObj = putReqDto.updateWhereOptions;
    const conditionMap = new Map<string, LikeType>([
      ['accountId', LikeType.NOT],
      ['accountName', LikeType.NOT],
      ['email', LikeType.NOT],
      ['tel', LikeType.NOT],
    ]);
    const conditions = ObjUtil.condition(conditionMap, targetObj);
    AccountController.LOGGER.debug('conditions: ' + JSON.stringify(conditions));
    delete putReqDto['updateWhereOptions']; // putReqDto 에서 whereOption 제거.
    // 여기까지 where 절 동적 생성 부분

    const updateAccountDto: UpdateAccountDto = new UpdateAccountDto();
    Object.assign(updateAccountDto, ObjUtil.camelCaseKeysToUnderscore(putReqDto));

    AccountController.LOGGER.debug('updateAccountDto: ' + JSON.stringify(updateAccountDto));

    const result = from(
      this.accountService.update(conditions, updateAccountDto),
    );
    const resultDto = new ResultDto();
    return result.pipe(
      map((result) => {
        AccountController.LOGGER.debug('update result: ' + JSON.stringify(result));
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
