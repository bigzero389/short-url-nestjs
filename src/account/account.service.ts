import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, getCustomRepository, Repository, UpdateResult, } from 'typeorm';
import { CreateAccountDto, PostAccountDto, PutAccountDto, } from './account.dto';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';
import { LikeType, ObjUtil } from '../shared/util/objUtil';

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

  async create(postDto: PostAccountDto): Promise<Account> {
    // dto 를 entity로 변환하여 repository로 데이터를 전달한다.
    const createAccountDto: CreateAccountDto = new CreateAccountDto();
    Object.assign(createAccountDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const createdData = await this.accountRepository
      .save({
        ...createAccountDto,
      })
      .then((result) => result)
      .catch((err) => {
        AccountService.LOGGER.error('create: ' + err);
        return new Account();
      });
    return createdData;
  }

  async get(getQueryParams: any): Promise<Account[]> {
    // select where 절 구조 정의.
    const conditionMap = new Map<string, LikeType>([
      ['accountId', LikeType.NOT],
      ['accountName', LikeType.ALL],
      ['email', LikeType.RIGHT],
      ['tel', LikeType.ALL],
    ]);
    const conditions = ObjUtil.condition(conditionMap, getQueryParams);
    AccountService.LOGGER.debug('conditions: ' + JSON.stringify(conditions));

    const accountList = await this.accountRepository
      .find({ where: conditions, order: { account_id: 'DESC' } })
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

  async deleteOne(account_id: string): Promise<DeleteResult> {
    const conditions: FindConditions<Account> = { account_id: account_id };
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

  async update(putDto: PutAccountDto): Promise<UpdateResult> {
    // where 절 동적 생성 부분.
    const whereOptions = putDto.updateWhereOptions;
    // update service where 절 기준 정의
    const conditionMap = new Map<string, LikeType>([
      ['accountId', LikeType.NOT],
      ['accountName', LikeType.NOT],
      ['email', LikeType.NOT],
      ['tel', LikeType.NOT],
    ]);
    const conditions = ObjUtil.condition(conditionMap, whereOptions);
    AccountService.LOGGER.debug('conditions: ' + JSON.stringify(conditions));
    delete putDto['updateWhereOptions']; // putDto 에서 whereOption 제거.
    // 여기까지 where 절 동적 생성 부분

    const updateAccountDto = {};
    // dto 를 entity 로 전환
    Object.assign(updateAccountDto, ObjUtil.camelCaseKeysToUnderscore(putDto));

    AccountService.LOGGER.debug( 'updateAccountDto: ' + JSON.stringify(updateAccountDto), );
    return await this.accountRepository
      .update(conditions, { ...updateAccountDto })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        AccountService.LOGGER.error('update: ' + err);
        return new UpdateResult();
      });
  }
}
