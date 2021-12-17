import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Account } from './account.entity';
import { CreateAccountDto, PostAccountDto, PutAccountDto, } from './account.dto';
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
    const getQueryParams = req.query;
    AccountController.LOGGER.debug('account get: ' + JSON.stringify(getQueryParams));

    const accountList = from(this.accountService.get(getQueryParams));
    return accountList.pipe(
      map((result) => {
        AccountController.LOGGER.debug('get: ' + JSON.stringify(result));
        return result;
      }),
    );
  }

  @Post()
  create(@Body() postDto: PostAccountDto) {
    AccountController.LOGGER.debug('create postAccountDto: ' + JSON.stringify(postDto));
    const createAccountDto: CreateAccountDto = new CreateAccountDto();
    Object.assign(createAccountDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const serviceResult = from(this.accountService.create(postDto));
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

  @Delete(':accountId')
  deleteOne(@Param() params): Observable<ResultDto> {
    const resultDto = new ResultDto();
    const result = from(this.accountService.deleteOne(params.accountId));
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
  update(@Body() putAccountDto: PutAccountDto): Observable<ResultDto> {
    AccountController.LOGGER.debug( 'update putAccountDto: ' + JSON.stringify(putAccountDto), );

    const result = from( this.accountService.update(putAccountDto), );
    const resultDto = new ResultDto();
    return result.pipe(
      map((result) => {
        AccountController.LOGGER.debug(
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
