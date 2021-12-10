import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Account } from './entities/account.entity';
import { AccountDto } from './dto/account.dto';
import { ResultDto } from '../shared/dto/result.dto';

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
  create(@Body() accountData: AccountDto): ResultDto {
    console.log(accountData);
    const result = new ResultDto();
    try {
      this.accountService.create(accountData);
      result.isSuccess = true;
    } catch (error) {
      console.error(error);
      result.isSuccess = false;
      result.resultMsg = error;
    } finally {
      return result;
    }
  }
}
