import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async getAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async create(accountData: AccountDto): Promise<Account> {
    const createdData = await this.accountRepository.save({
      ...accountData,
    });
    return createdData;
  }
}
