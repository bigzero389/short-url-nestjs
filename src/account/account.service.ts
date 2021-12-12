import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateAccountDto, UpdateAccountDto } from './account.dto';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  getAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async create(dto: CreateAccountDto): Promise<Account> {
    const createdData = await this.accountRepository.save({
      ...dto,
    });
    return createdData;
  }

  async getCondition(
    queryCondition: Map<string, string>,
  ): Promise<Account[]> {
    const query = '';
    const condition = [];
    return this.accountRepository.query(query, condition);
  }

  async getOne(id: string): Promise<Account> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async deleteOne(id: string): Promise<DeleteResult | Error> {
    return await this.accountRepository
      .delete(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return new Error('delete error' + err);
      });
  }

  async update(accountId: string, dto: UpdateAccountDto): Promise<UpdateResult | Error> {
    return await this.accountRepository
      .update(accountId, dto)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return new Error('update error' + err);
      });
  }
}
