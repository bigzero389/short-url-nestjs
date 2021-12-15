import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, getCustomRepository, Repository, UpdateResult } from 'typeorm';
import { CreateAccountDto, UpdateAccountDto } from './account.dto';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';

// @TODO : OR 절 구현 확인
// @TODO : IN 절 구현 확인
// @TODO : GROUP BY 절 구현 확인
@Injectable()
export class AccountService {
  private static readonly LOGGER = new Logger(AccountService.name);

  constructor(
    // Custom Repository를 썼지만 실행은 되는데 jest 가 안됨.
    // @InjectRepository(Account) private accountRepository: AccountRepository,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
    const createdData = await this.accountRepository
      .save({
        ...dto,
      })
      .then((result) => result)
      .catch((err) => {
        AccountService.LOGGER.error('create: ' + err);
        return new Account();
      });
    return createdData;
  }

  async get(conditions: FindConditions<Account>): Promise<Account[]> {
    const accountList = await this.accountRepository
      .find({ ...conditions, order: { account_id: 'DESC' } })
      .then((result) => result)
      .catch((err) => {
        AccountService.LOGGER.error('get: ' + err);
        return new Array<Account>();
      });
    return accountList;
  }

  async getOne(account_id: string): Promise<Account> {
    const result = await this.accountRepository
      .findOne({ where: { account_id: account_id }, cache: false })
      .then((result) => result)
      .catch((err) => {
        AccountService.LOGGER.error('getOne: ' + err);
        return new Account();
      });
    return result;
  }

  async deleteOne(conditions: FindConditions<Account>): Promise<DeleteResult> {
    return await this.accountRepository
      .delete(conditions)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        AccountService.LOGGER.error('deleteOne: ' + err);
        return new DeleteResult();
      });
  }

  async update(
    conditions: FindConditions<Account>,
    updateDataDto: UpdateAccountDto,
  ): Promise<UpdateResult> {
    return await this.accountRepository
      .update(conditions, { ...updateDataDto })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        AccountService.LOGGER.error('update: ' + err);
        return new UpdateResult();
      });
  }
}
