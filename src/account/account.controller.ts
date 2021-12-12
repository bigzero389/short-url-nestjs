import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { catchError, from, Observable } from 'rxjs';
import { Account } from './entities/account.entity';
import { AccountDto } from './dto/account.dto';
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

  @Post()
  create(@Body() accountData: AccountDto) {
    console.log(accountData);
    const accountEntity = ObjUtil.camelCaseKeysToUnderscore(accountData);
    const result = new ResultDto();
    const serviceResult = from(this.accountService.create(accountEntity));
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
