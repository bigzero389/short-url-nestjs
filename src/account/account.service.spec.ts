import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, FindConditions, Repository, UpdateResult } from 'typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './account.dto';
import { AccountRepository } from './account.repository';
import { before } from '@nestjs/swagger/dist/plugin';

// Service 의 Repository Injection을 Mocking 하기 위해 필요함.
const mockAccountRepository = () => ({
  save: jest.fn( () => new Promise((resolve) => { resolve(new CreateAccountDto()); }), ),
  find: jest.fn( () => new Promise((resolve) => { resolve(new Array<CreateAccountDto>()); }), ),
  findOne: jest.fn( () => new Promise((resolve) => { resolve(new CreateAccountDto()); }), ),
  update: jest.fn(),
  softDelete: jest.fn(),
  delete: jest.fn( () => new Promise((resolve) => { resolve(new DeleteResult()); }), ),
});

// test data 정의
const accountList = [
  {
    account_id: 'bigzero1',
    name: 'dyheo',
    email: 'dyheo@hist.co.kr',
    tel: '01062889304',
    remark: '',
    end_datetime: '20221231235959',
    begin_datetime: '20000101010000',
  },
  {
    account_id: 'bigzero2',
    name: 'dyheo',
    email: 'dyheo@hist.co.kr',
    tel: '01062889304',
    remark: '',
    end_datetime: '20221231235959',
    begin_datetime: '20000101010000',
  },
];
// Repository 자체를 test 하기 위해 필요함.
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AccountService', () => {
  let service: AccountService;
  let mockRepository: MockRepository<Account>;
  // let repository: MockRepository<Account>;
  // let repository: Repository<Account>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        // AccountService, { provide: getRepositoryToken(Account), useClass: Repository }, // DI가 정상적으로 작동하는 경우 이렇게 해야 된다.
        // AccountService, { provide: getRepositoryToken(Account), useValue: repository, }, // Repository를 Custom으로 만들어 적용하는 경우 처리. 이것도 현재는 안됨.
        // AccountService, { provide: getRepositoryToken(Account), useClass: MockRepository<AccountRepository>, }, // Repository를 Custom으로 만들어 적용하는 경우 처리. 이것도 현재는 안됨.
        // AccountService, { provide: getRepositoryToken(Account), useFactory: mockAccountRepository, }, // 결국 mock으로 처리.
        AccountService, { provide: getRepositoryToken(Account), useValue: mockAccountRepository(), }, // 결국 mock으로 처리.
        // AccountService, { provide: getRepositoryToken(Account), useValue: mockRepository }, // 결국 mock으로 처리.
      ],
    }).compile();

    service = await module.resolve(AccountService);
    mockRepository = await module.resolve(getRepositoryToken(Account));
  });

  it('should be defined(서비스가 정의되어 있는지 체크)', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create', async () => {
      const result = await service.create(new CreateAccountDto());
      expect(result).toBeInstanceOf(CreateAccountDto);
    });
  });

  describe('get', () => {
    it('getOne', async () => {
      mockRepository.findOne.mockResolvedValue(accountList[1]); // test 할때 마다 expect 되는 test 결과값을 넣어준다.
      const result = await service.getOne('bigzero2');
      expect(result.account_id).toEqual('bigzero2');
    });

    it('getAll', async () => {
      mockRepository.find.mockResolvedValue(accountList);
      const result = await service.getAll();
      expect(result.length).toBe(2);
    });

    it('getOne undefined', async () => {
      mockRepository.findOne.mockResolvedValue(NotFoundException);
      const result = await service.getOne('isNotId');
      expect(result).toBe(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deleteOne', async () => {
      const deleteResult = new DeleteResult();
      deleteResult.affected = 1;
      mockRepository.delete.mockResolvedValue(deleteResult);
      const conditions: FindConditions<Account> = { account_id: 'bigzero1' };
      const result = await service.deleteOne(conditions);
      expect(result.affected).toEqual(1);
    });

    it('deleteOne fail', async () => {
      const deleteResult = new DeleteResult();
      mockRepository.delete.mockResolvedValue(deleteResult);
      const conditions: FindConditions<Account> = { account_id: 'isNotExist' };
      const result = await service.deleteOne(conditions);
      expect(result.affected).toEqual(undefined);
    });
  });

  describe('update', () => {
    it('update', async () => {
      const updateResult = new UpdateResult();
      updateResult.affected = 1;
      mockRepository.update.mockResolvedValue(updateResult);
      const conditions: FindConditions<Account> = { account_id: 'bigzero1' };
      const result = await service.update(conditions, {});
      expect(result.affected).toEqual(1);
    });

    it('update fail', async () => {
      const updateResult = new UpdateResult();
      mockRepository.update.mockResolvedValue(updateResult);
      const conditions: FindConditions<Account> = { account_id: 'isNotExist' };
      const result = await service.update(conditions, {});
      expect(result.affected).toEqual(undefined);
    });
  });
});
