import { CACHE_MANAGER, Inject, Injectable, Logger, Query, } from '@nestjs/common';
import { CreateShorterDto, PostShorterDto } from './shorter.dto';
import { Shorter } from './shorter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, Repository } from 'typeorm';
import { ObjUtil } from '../shared/util/objUtil';
import { DateUtil } from '../shared/util/dateUtil';
import { Cache } from 'cache-manager';
import * as Hash from 'object-hash';

@Injectable()
export class ShorterService {
  private static readonly LOGGER = new Logger(ShorterService.name);

  constructor(
    @InjectRepository(Shorter) private shorterRepository: Repository<Shorter>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Cache 는 cache-manager 로 부터 import 해야 한다.
  ) {}

  async getCacheTime(id: string): Promise<string> {
    const savedTime = await this.cacheManager.get(id);
    if (savedTime) {
      return 'saved time : ' + savedTime;
    }
    const now = new Date().getTime();
    await this.cacheManager.set(id, now, { ttl: 600 }); // 10 min
    return 'save new time : ' + now;
  }

  async create(postDto: PostShorterDto): Promise<Shorter> {
    const createShorterDto: CreateShorterDto = new CreateShorterDto();
    Object.assign(createShorterDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const createdData = await this.shorterRepository
      .save({ ...createShorterDto })
      .then((result) => result)
      .catch((err) => {
        ShorterService.LOGGER.error('create: ' + err);
        return new Shorter();
      });

    // redis 저장.
    const cacheResult = await this.cacheManager.set(
      createShorterDto.short_key,
      createShorterDto,
      { ttl: DateUtil.getIntervalSecond(createShorterDto.end_datetime, createShorterDto.begin_datetime) },
    );

    return createdData;
  }

  async getOne(shortUrlId: number): Promise<Shorter> {
    const result = await this.shorterRepository
      .findOne({
        where: { short_url_id: shortUrlId },
        cache: false,
      })
      .then((result) => result)
      .catch((err) => {
        ShorterService.LOGGER.error('getOne: ' + err);
        return new Shorter();
      });
    return result;
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
      query.andWhere('shorter.short_url = :short_url', {
        short_url: `${getQueryParams.shortUrl}`,
      });
    }
    if (getQueryParams.originUrl) {
      query.andWhere('shorter.origin_url = :origin_url', {
        origin_url: `${getQueryParams.originUrl}`,
      });
    }
    if (getQueryParams.apikey) {
      query.andWhere('apikey.apikey = :apikey', {
        apikey: `${getQueryParams.apikey}`,
      });
    }
    if (getQueryParams.accountId) {
      query.andWhere('apikey.account_id = :account_id', {
        account_id: `${getQueryParams.accountId}`,
      });
    }
    if (isUseYN) {
      query.andWhere('shorter.begin_datetime <= :current_datetime', {
        current_datetime: DateUtil.getNowformatKOR('YYYYMMDDHHmmss'),
      });
      query.andWhere('shorter.end_datetime >= :current_datetime', {
        current_datetime: DateUtil.getNowformatKOR('YYYYMMDDHHmmss'),
      });
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

  async deleteOne(shortUrlId: number): Promise<DeleteResult> {
    const conditions: FindConditions<Shorter> = { short_url_id: shortUrlId };
    return await this.shorterRepository
      .delete(conditions)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        ShorterService.LOGGER.error('deleteOne: ' + err);
        return new DeleteResult();
      });
  }

  // redis 에 key가 이미 존재하는지 체크해서 있으면 재시도, 없으면 redisKey 리턴, 단, 10번해서도 계속 중복존재하면 null 리턴.
  async makeShorterKey(originUrl: string): Promise<string> {
    const firstRedisKey = this.getHashKey(originUrl);

    // redis 반복체크 함수정의.
    const dupCheck = async (redisKey) => {
      let result = null;
      for (let i = 0; i < 10; i++) {
        // if(i == 0) redisKey = '9f3dded';  // 중복체크 테스트용
        result = await this.cacheManager.get(redisKey);
        ShorterService.LOGGER.debug('Make Shorter Key : ' + result);
        if (result) {
          redisKey = this.getHashKey(originUrl);
        } else {
          break;
        }
        ShorterService.LOGGER.debug( `dupCheck : result = ${result} , redisKey = ${redisKey}`, );
      }
      return result ? null : redisKey;
    };
    
    // 반복체크 함수의 결과값 리턴.
    return await dupCheck(firstRedisKey).then((result) => result);
  }

  // 해쉬키의 길이를 줄이기 위해 Hash 함수로 생성된 해쉬키를 7자리로 자른다. 자릿수를 줄일수록 중복확률이 커진다.
  getHashKey(originUrl): string {
    return Hash({ origin_url: originUrl, time: new Date().getSeconds() + Math.random() * 1000, }).substring(0, 7);
  }

  makeTestShorterKey(originUrl: string) {
    const result = Hash({ origin_url: originUrl, time: new Date(), });
    return result;
  }
}
