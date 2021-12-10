import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) {}

  async getAll(): Promise<AccountEntity[]> {
    return this.accountRepository.find();
  }

  async create(accountEntity: AccountEntity): Promise<AccountEntity> {
    const createdData = await this.accountRepository.save({
      ...accountEntity,
    });
    return createdData;
  }
}
