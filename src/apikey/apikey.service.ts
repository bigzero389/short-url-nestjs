import { Injectable, Logger } from '@nestjs/common';
import { Apikey } from './apikey.entity';
import { FindConditions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApikeyDto } from './apikey.dto';
import { Account } from '../account/account.entity';

@Injectable()
export class ApikeyService {
  private static readonly LOGGER = new Logger(ApikeyService.name);

  constructor(
    @InjectRepository(Apikey) private apikeyRepository: Repository<Apikey>,
  ) {}

  async create(dto: CreateApikeyDto): Promise<Apikey> {
    const createdData = await this.apikeyRepository
      .save({
        ...dto,
      })
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
