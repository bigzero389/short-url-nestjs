import { Test, TestingModule } from '@nestjs/testing';
import { ShorterService } from './shorter.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateShorterDto, PostShorterDto } from './shorter.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shorter } from './shorter.entity';
import { CACHE_MANAGER, Inject, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { createCacheManager } from '@nestjs/common/cache/cache.providers';
import { getConfigToken } from '@nestjs/config';

// Service 의 Repository Injection을 Mocking 하기 위해 필요함.
const mockShorterRepository = () => ({
  save: jest.fn( () => new Promise((resolve) => { resolve(new CreateShorterDto()); }), ),
  find: jest.fn( () => new Promise((resolve) => { resolve(new Array<CreateShorterDto>()); }), ),
  findOne: jest.fn( () => new Promise((resolve) => { resolve(new CreateShorterDto()); }), ),
  update: jest.fn(),
  softDelete: jest.fn(),
  delete: jest.fn( () => new Promise((resolve) => { resolve(new DeleteResult()); }), ),
  // createQueryBuilder: jest.fn(() => new Promise((resolve) => { resolve( new Array<CreateApikeyDto>()); })),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoin: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  }),
});

// test data 정의
const shorterList = [
  {
    short_url_cnt: 0,
    short_url_id: 1,
    short_url: 'http://localhost:3000/cd46be37d7c17a8d37847d954a0b70d60115efed',
    origin_url: 'http://bcheck.hist-tech.net',
    end_datetime: '20221231235959',
    begin_datetime: '20220101010000',
    apikey: '57b83ecd38ae4643a284dd63db5054f15cbd0fbd',
  },
  {
    short_url_cnt: 0,
    short_url_id: 2,
    short_url: 'http://localhost:3000/6288e4d7870b3c1a455c3dcb77cd2db4be992989',
    origin_url: 'http://bcheck.hist-tech.net',
    end_datetime: '20221231235959',
    begin_datetime: '20000101010000',
    apikey: '57b83ecd38ae4643a284dd63db5054f15cbd0fbd',
  },
];

// Repository 자체를 test 하기 위해 필요함.
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ShorterService', () => {
  let service: ShorterService;
  let mockRepository: MockRepository<Shorter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ShorterService,
        {
          provide: getRepositoryToken(Shorter),
          useValue: mockShorterRepository(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: { set: jest.fn(), get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ShorterService>(ShorterService);
    mockRepository = await module.resolve(getRepositoryToken(Shorter));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create', async () => {
      const result = await service.create(new PostShorterDto());
      expect(result).toBeInstanceOf(CreateShorterDto);
    });
  });

  describe('get', () => {
    it('getOne', async () => {
      mockRepository.findOne.mockResolvedValue(shorterList[0]); // test 할때 마다 expect 되는 test 결과값을 넣어준다.
      const result = await service.getOne(1);
      expect(result.short_url).toEqual(shorterList[0].short_url);
    });

    it('get', async () => {
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(shorterList);
      const result = await service.get({ account_id: 'bigzero' });
      expect(result.length).toBe(2);
    });

    it('getOne undefined', async () => {
      mockRepository.findOne.mockResolvedValue(NotFoundException);
      const result = await service.getOne(-1);
      expect(result).toBe(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deleteOne', async () => {
      const deleteResult = new DeleteResult();
      deleteResult.affected = 1;
      mockRepository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteOne(123345);
      expect(result.affected).toEqual(1);
    });

    it('deleteOne fail', async () => {
      const deleteResult = new DeleteResult();
      mockRepository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteOne(90000);
      expect(result.affected).toEqual(undefined);
    });
  });

  describe('redisKey', () => {
    it('makeNewKey', async () => {
      const originUrl = 'http://bcheck.hist-tech.net';
      const result = await service.makeShorterKey(originUrl);
      expect(result.length).toBe(7);
    });
  });
  // describe('update', () => {
  //   it('update', async () => {
  //     const updateResult = new UpdateResult();
  //     updateResult.affected = 1;
  //     mockRepository.createQueryBuilder().execute.mockResolvedValue(updateResult);
  //     const putDto = JSON.stringify({
  //       accountId: 'updatedAccountId',
  //       apikey: 'updatedApikey',
  //       updateWhereOptions: {
  //         accountId: 'bigzero1',
  //       },
  //     });
  //     const result = await service.update(JSON.parse(putDto));
  //     expect(result.affected).toEqual(1);
  //   });
  //
  //   it('update fail', async () => {
  //     const updateResult = new UpdateResult();
  //     mockRepository
  //       .createQueryBuilder()
  //       .execute.mockResolvedValue(updateResult);
  //     const putDto = JSON.stringify({
  //       accountId: 'accountId',
  //       updateWhereOptions: {
  //         apikey: 'isNotExist',
  //       },
  //     });
  //     const result = await service.update(JSON.parse(putDto));
  //     expect(result.affected).toEqual(undefined);
  //   });
  // });
});

// createBuilder testing
// https://velog.io/@hkja0111/NestJS-11-Unit-Test-QueryBuilder
