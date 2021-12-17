import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyService } from './apikey.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateApikeyDto, PostApikeyDto } from './apikey.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Apikey } from './apikey.entity';
import { CreateAccountDto } from '../account/account.dto';
import { NotFoundException } from '@nestjs/common';
import { Account } from '../account/account.entity';

// Service 의 Repository Injection을 Mocking 하기 위해 필요함.
const mockApikeyRepository = () => ({
  save: jest.fn( () => new Promise((resolve) => { resolve(new CreateApikeyDto()); }), ),
  find: jest.fn( () => new Promise((resolve) => { resolve(new Array<CreateApikeyDto>()); }), ),
  findOne: jest.fn( () => new Promise((resolve) => { resolve(new CreateApikeyDto()); }), ),
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
const apikeyList = [
  {
    apikey: '318cffe4f7056283d2d4b96bf1133fe24f702eed',
    begin_datetime: '20000101010000',
    end_datetime: '20221231235959',
    account_id: 'bigzero',
},
  {
    apikey: '8ec7510687acdd115911b4ea807db79913ea8589',
    begin_datetime: '20000101010000',
    end_datetime: '20221231235959',
    account_id: 'bigzero1',
  },
  {
    apikey: 'selectedApikey',
    begin_datetime: '20000101010000',
    end_datetime: '20221231235959',
    account_id: 'bigzero',
  },
];

// Repository 자체를 test 하기 위해 필요함.
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ApikeyService', () => {
  let service: ApikeyService;
  let mockRepository: MockRepository<Apikey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ApikeyService,
        {
          provide: getRepositoryToken(Apikey),
          useValue: mockApikeyRepository(),
        },
      ],
    }).compile();

    service = module.get<ApikeyService>(ApikeyService);
    mockRepository = await module.resolve(getRepositoryToken(Apikey));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create', async () => {
      const result = await service.create(new PostApikeyDto());
      expect(result).toBeInstanceOf(CreateApikeyDto);
    });
  });

  describe('get', () => {
    it('getOne', async () => {
      mockRepository.findOne.mockResolvedValue(apikeyList[1]); // test 할때 마다 expect 되는 test 결과값을 넣어준다.
      const result = await service.getOne('selectedApikey');
      expect(result.account_id).toEqual('bigzero1');
    });

    it('get', async () => {
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(apikeyList);
      const result = await service.get({ accountId: 'bigzero'});
      expect(result.length).toBe(3);
    });

    it('getOne undefined', async () => {
      mockRepository.findOne.mockResolvedValue(NotFoundException);
      const result = await service.getOne('isNotApikey');
      expect(result).toBe(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deleteOne', async () => {
      const deleteResult = new DeleteResult();
      deleteResult.affected = 1;
      mockRepository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteOne('selectedApikey');
      expect(result.affected).toEqual(1);
    });

    it('deleteOne fail', async () => {
      const deleteResult = new DeleteResult();
      mockRepository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteOne('isNotExist');
      expect(result.affected).toEqual(undefined);
    });
  });

  describe('update', () => {
    it('update', async () => {
      const updateResult = new UpdateResult();
      updateResult.affected = 1;
      mockRepository
        .createQueryBuilder()
        .execute.mockResolvedValue(updateResult);
      const putDto = JSON.stringify({
        accountId: 'updatedAccountId',
        apikey: 'updatedApikey',
        updateWhereOptions: {
          accountId: 'bigzero1',
        },
      });
      const result = await service.update(JSON.parse(putDto));
      expect(result.affected).toEqual(1);
    });

    it('update fail', async () => {
      const updateResult = new UpdateResult();
      mockRepository
        .createQueryBuilder()
        .execute.mockResolvedValue(updateResult);
      const putDto = JSON.stringify({
        accountId: 'accountId',
        updateWhereOptions: {
          apikey: 'isNotExist',
        },
      });
      const result = await service.update(JSON.parse(putDto));
      expect(result.affected).toEqual(undefined);
    });
  });
});

// createBuilder testing
// https://velog.io/@hkja0111/NestJS-11-Unit-Test-QueryBuilder
