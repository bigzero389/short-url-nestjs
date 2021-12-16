import { Injectable, Logger } from '@nestjs/common';
import { Apikey } from './apikey.entity';
import { DeleteResult, FindConditions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApikeyDto, PostApikeyDto, PutApikeyDto } from './apikey.dto';
import { Account } from '../account/account.entity';
import { CreateAccountDto, PutAccountDto } from '../account/account.dto';
import { LikeType, ObjUtil } from '../shared/util/objUtil';
import { IsOptional } from 'class-validator';

@Injectable()
export class ApikeyService {
  private static readonly LOGGER = new Logger(ApikeyService.name);

  constructor(
    @InjectRepository(Apikey) private apikeyRepository: Repository<Apikey>,
  ) {}

  async create(postDto: PostApikeyDto): Promise<Apikey> {
    // dto 를 entity 로 변환.
    const createApikeyDto: CreateApikeyDto = new CreateApikeyDto();
    Object.assign(createApikeyDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const createdData = await this.apikeyRepository
      .save({ ...createApikeyDto, })
      .then((result) => result)
      .catch((err) => {
        ApikeyService.LOGGER.error('create: ' + err);
        return new Apikey();
      });
    return createdData;
  }

  // query builder 를 사용한 예제.
  async get(getQueryParams): Promise<Apikey[]> {
    const query = this.apikeyRepository
      .createQueryBuilder('apikey')
      .leftJoin('apikey.account_id', 'account')
      .addSelect([
        'apikey.apikey',
        'apikey.end_datetime',
        'apikey.begin_datetime',
        'account.account_name',
        'account.account_id',
        'account.tel',
        'account.email',
      ]);
    query.where('1 = 1');
    if (getQueryParams.accountId) {
      query.andWhere('account.account_id = :account_id', { account_id: `%${getQueryParams.accountId}%` })
    }
    if (getQueryParams.accountName) {
      query.andWhere('account.account_name like :account_name', { account_name: `%${getQueryParams.accountName}%` })
    }
    if (getQueryParams.tel) {
      query.andWhere('account.tel like :tel', { tel: `%${getQueryParams.tel}%` })
    }
    if (getQueryParams.email) {
      query.andWhere('account.email like :email', { email: `%${getQueryParams.email}%` })
    }

    const apikeyList = await query
      .getMany()
      .then((result) => result)
      .catch((err) => {
        ApikeyService.LOGGER.error('get: ' + err);
        return new Array<Apikey>();
      });

    return apikeyList;
  }

  async getOne(apikey: string): Promise<Apikey> {
    const result = await this.apikeyRepository
      .findOne({ where: { apikey: apikey }, cache: false })
      .then((result) => result)
      .catch((err) => {
        ApikeyService.LOGGER.error('getOne: ' + err);
        return new Apikey();
      });
    return result;
  }


  async deleteOne(apikey: string): Promise<DeleteResult> {
    const conditions: FindConditions<Apikey> = { apikey: apikey };
    return await this.apikeyRepository
      .delete(conditions)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        ApikeyService.LOGGER.error('deleteOne: ' + err);
        return new DeleteResult();
      });
  }

  async update(putDto: PutApikeyDto): Promise<UpdateResult> {
    // 쿼리 생성
    const whereOptions = putDto.updateWhereOptions;
    // update where 절이 없는 경우 쿼리 자체를 수행시키지 않는다.
    if (!whereOptions) {
      return new UpdateResult();
    }

    let set = {};
    if (putDto.apikey) {
      set = { ...set, apikey: putDto.apikey };
    }
    if (putDto.accountId) {
      set = { ...set, account_id: putDto.accountId};
    }
    if (putDto.beginDatetime) {
      set = { ...set, begin_datetime: putDto.beginDatetime};
    }
    if (putDto.endDatetime) {
      set = { ...set, end_datetime: putDto.endDatetime};
    }
    const query = this.apikeyRepository
      .createQueryBuilder()
      .update(Apikey)
      .set(set);
    let isAndWhere = false; // where 와 and 를 구분한다.
    if (whereOptions.apikey) {
      if (isAndWhere) {
        query.andWhere("apikey = :apikey", {apikey: whereOptions.apikey});
      } else {
        query.where("apikey = :apikey", {apikey: whereOptions.apikey});
        isAndWhere = true;
      }
    }
    if (whereOptions.accountId) {
      if (isAndWhere) {
        query.andWhere("account_id = :account_id", {account_id: whereOptions.accountId});
      } else {
        query.where("account_id = :account_id", {account_id: whereOptions.accountId});
        isAndWhere = true;
      }
    }

    return await query
      .execute()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        ApikeyService.LOGGER.error('update: ' + err);
        return new UpdateResult();
      });
  }
}
