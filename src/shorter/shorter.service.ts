import { Injectable, Logger } from '@nestjs/common';
import { CreateShorterDto, PostShorterDto } from './shorter.dto';
import { Shorter } from './shorter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApikeyDto } from '../apikey/apikey.dto';
import { ObjUtil } from '../shared/util/objUtil';
import { Apikey } from '../apikey/apikey.entity';
import { DateUtil } from '../shared/util/dateUtil';

@Injectable()
export class ShorterService {
  private static readonly LOGGER = new Logger(ShorterService.name);

  constructor(
    @InjectRepository(Shorter) private shorterRepository: Repository<Shorter>,
  ) {}

  async create(postDto: PostShorterDto): Promise<Shorter> {
    const createShorterDto: CreateShorterDto = new CreateShorterDto();
    Object.assign(createShorterDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const createdData = await this.shorterRepository
      .save({ ...createShorterDto, })
      .then((result) => result)
      .catch((err) => {
        ShorterService.LOGGER.error('create: ' + err);
        return new Shorter();
      });
    return createdData;
  }

  async get(getQueryParams, isUseYN?: boolean): Promise<Shorter[]> {
    const query = this.shorterRepository
      .createQueryBuilder('shorter')
      .leftJoin('shorter.apikey', 'apikey')
      .addSelect([
        'shorter.short_url',
        'shorter.origin_url',
        'shorter.end_datetime',
        'shorter.begin_datetime',
        'apikey.apikey',
        'apikey.account_id',
      ]);
    query.where('1 = 1');
    if (getQueryParams.shortUrl) {
      query.andWhere('shorter.short_url = :short_url', { short_url: `${getQueryParams.shortUrl}` })
    }
    if (getQueryParams.originUrl) {
      query.andWhere('shorter.origin_url = :origin_url', { origin_url: `${getQueryParams.originUrl}` })
    }
    if (getQueryParams.apikey) {
      query.andWhere('apikey.apikey = :apikey', { apikey: `${getQueryParams.apikey}` })
    }
    if (getQueryParams.accountId) {
      query.andWhere('apikey.account_id = :account_id', { account_id: `${getQueryParams.accountId}` })
    }
    if (isUseYN) {
      query.andWhere('shorter.begin_datetime <= :current_datetime', { current_datetime: DateUtil.yyyyMMddHHmissKOR() })
      query.andWhere('shorter.end_datetime >= :current_datetime', { current_datetime: DateUtil.yyyyMMddHHmissKOR() })
    }

    const shorterList = await query
      .getMany()
      .then((result) => {
        // ShorterService.LOGGER.debug('result::::: ' + result);
        return result;
      })
      .catch((err) => {
        ShorterService.LOGGER.error('get: ' + err);
        return new Array<Shorter>();
      });

    return shorterList;
  }
}
