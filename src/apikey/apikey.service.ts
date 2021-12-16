import { Injectable, Logger } from '@nestjs/common';
import { Apikey } from './apikey.entity';
import { FindConditions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApikeyDto, PostApikeyDto } from './apikey.dto';
import { Account } from '../account/account.entity';
import { CreateAccountDto } from '../account/account.dto';
import { ObjUtil } from '../shared/util/objUtil';

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

  async get(conditions: FindConditions<Apikey>): Promise<Apikey[]> {
    // const apikeyList = await this.apikeyRepository
    //   .find({ ...conditions, order: { account_id: 'DESC' } })
    //   .then((result) => result)
    //   .catch((err) => {
    //     ApikeyService.LOGGER.error('get: ' + err);
    //     return new Array<Apikey>();
    //   });
    // return apikeyList;
    const accountName = 'dyheo';
    const apikeyList = await this.apikeyRepository
      .createQueryBuilder('apikey')
      .leftJoin('apikey.account_id', 'account')
      .addSelect([
        'apikey.apikey',
        'apikey.end_datetime',
        'apikey.begin_datetime',
        'account.account_name',
      ])
      .where('account.account_name like :account_name', {
        account_name: `%${accountName}%`,
      })
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
}
