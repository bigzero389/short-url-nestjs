import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Account } from './entities/account.entity';

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

}
