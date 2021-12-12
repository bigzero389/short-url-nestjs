import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { catchError, from, Observable } from 'rxjs';
import { Account } from './account.entity';
import { CreateAccountDto, ReqAccountDto } from './account.dto';
import { ResultDto } from '../shared/dto/result.dto';
import { ObjUtil } from '../shared/util/objUtil';

@Controller('account')
export class AccountController {
  constructor(readonly accountService: AccountService) {}

  @Get()
  getAll(): Observable<Account[]> {
    const accountList = from(this.accountService.getAll());
    return accountList.pipe(
      map((accounts) => {
        console.log(accounts);
        return accounts;
      }),
    );
  }

  @Get(':id')
  getOne(@Param() params): Observable<Account> {
    const accountList = from(this.accountService.getOne(params.id));
    return accountList.pipe(
      map((accounts) => {
        console.log(accounts);
        return accounts;
      }),
    );
  }
  @Post()
  create(@Body() reqDto: ReqAccountDto) {
    console.log(reqDto);
    const createAccountDto: CreateAccountDto = new CreateAccountDto();
    Object.assign(createAccountDto, ObjUtil.camelCaseKeysToUnderscore(reqDto));

    const serviceResult = from(this.accountService.create(createAccountDto));

    const result = new ResultDto();
    return serviceResult.pipe(
      map((account) => {
        console.log(account);
        return { account, ...result, isSuccess: true };
      }),
      catchError((err, result) => {
        console.error(err);
        return result;
      }),
    );
  }
}
