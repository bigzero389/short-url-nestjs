import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { catchError, from, Observable } from 'rxjs';
import { Account } from './account.entity';
import { CreateAccountDto, PostReqDto, PutReqDto, UpdateAccountDto } from './account.dto';
import { ResultDto } from '../shared/dto/result.dto';
import { ObjUtil } from '../shared/util/objUtil';
import { ResultCode } from '../shared/result-code';
import { ResultMsg } from '../shared/result-msg';
import { FindConditions } from 'typeorm';

@Controller('account')
export class AccountController {
  private static readonly LOGGER = new Logger(AccountController.name);
  constructor(readonly accountService: AccountService) {}

  @Get()
  getAll(): Observable<Account[]> {
    const accountList = from(this.accountService.getAll());
    return accountList.pipe(
      map((accounts) => {
        AccountController.LOGGER.debug('getAll: ' + JSON.stringify(accounts));
        return accounts;
      }),
    );
  }

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
    // where 절 동적 생성 부분, 자동화 하려고 했는데 다양한 경우를 자동화가 가능한지 확신이 없어서 일단 수동으로 함.
    AccountController.LOGGER.debug('update putReqDto: ' + JSON.stringify(putReqDto));
    let conditions = {};
    if (putReqDto.updateWhereOptions.accountId) {
      conditions = { ...conditions, account_id: putReqDto.updateWhereOptions.accountId };
    }
    if (putReqDto.updateWhereOptions.accountName) {
      conditions = { ...conditions, account_name: putReqDto.updateWhereOptions.accountName};
    }
    delete putReqDto['updateWhereOptions']; // putReqDto 에서 whereOption 제거.
    // 여기까지 where 절 동적 생성 부분

    AccountController.LOGGER.debug('conditions : ' + JSON.stringify(conditions));

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
