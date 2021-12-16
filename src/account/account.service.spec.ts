import { NotFoundException, Put } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindConditions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto, PostAccountDto, PutAccountDto } from './account.dto';
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
        // @TODO : jest에서 nestjs DI 지원안되는 상황 방법확인 필요
        // - 실제 DB를 이용한 jest test를 하려면 Repository 가 DI가 되어야 하는데 jest에서 Nestjs의 DI되지 않아서 못함
        // - MockRepository를 사용해서 Test Case를 만들었는데 서비스에 많은 비즈니스 로직이 없는 상황에서는 Service의 Test Case 효용성이 떨어짐. Controller Test Case 위주로 작성하는 것이 효율적일 듯 함
        // AccountService, { provide: getRepositoryToken(Account), useClass: Repository }, // DI가 정상적으로 작동하는 경우 이렇게 해야 된다.
        // AccountService, { provide: getRepositoryToken(Account), useValue: repository, }, // Repository를 Custom으로 만들어 적용하는 경우 처리. 이것도 현재는 안됨.
        // AccountService, { provide: getRepositoryToken(Account), useClass: MockRepository<AccountRepository>, }, // Repository를 Custom으로 만들어 적용하는 경우 처리. 이것도 현재는 안됨.
        // AccountService, { provide: getRepositoryToken(Account), useFactory: mockAccountRepository, }, // 결국 mock으로 처리.
        // AccountService, { provide: getRepositoryToken(Account), useValue: mockRepository }, // 결국 mock으로 처리.
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository(),
        }, // 결국 mock으로 처리.
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
      const result = await service.create(new PostAccountDto());
      expect(result).toBeInstanceOf(CreateAccountDto);
    });
  });

  describe('get', () => {
    it('getOne', async () => {
      mockRepository.findOne.mockResolvedValue(accountList[1]); // test 할때 마다 expect 되는 test 결과값을 넣어준다.
      const result = await service.getOne('bigzero2');
      expect(result.account_id).toEqual('bigzero2');
    });

    it('get', async () => {
      mockRepository.find.mockResolvedValue(accountList);
      const result = await service.get({});
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
      const result = await service.deleteOne('deleteId');
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
      mockRepository.update.mockResolvedValue(updateResult);
      const testData = JSON.stringify({
        accountId: 'updatedAccountId',
        updateWhereOptions: {
          accountName: 'dyheo1',
        },
      });
      const result = await service.update(JSON.parse(testData));
      expect(result.affected).toEqual(1);
    });

    it('update fail', async () => {
      const updateResult = new UpdateResult();
      mockRepository.update.mockResolvedValue(updateResult);
      const testData = JSON.stringify({
        accountId: 'accountId',
        updateWhereOptions: {
          accountName: 'isNotExist',
        },
      });
      const result = await service.update(JSON.parse(testData));
      expect(result.affected).toEqual(undefined);
    });
  });
});
/*
- jest 동적클래스 생성 문제
	- jest 에서 동적클래스 테스트가 안됨
	- jest is incorrectly mapping external modules to non-existing directories
	- Repository 를 실제파일로 작성했었는데도 왜 같은 에러가 나는 건지 모르겠음. 다시 해봄
	- https://github.com/nestjs/nest/issues/363 => Nest Testing Dependency Issues
	- https://velog.io/@ssook_veloper/jest%EC%99%80-typeorm-typedi => Typescript 에서 DI 사용법 => 적용해봤는데 결과는 동일했음.
	- https://yangeok.github.io/orm/2020/12/14/typeorm-decorators.html => Typeorm 데코레이터 사용법
	- https://darrengwon.tistory.com/999?category=915252 => 이 글이 가장 자세한 내용임.
	- https://github.com/typeorm/typeorm/blob/master/docs/find-options.md => typeorm find options
	- https://docs.nestjs.com/pipes => class validator pipe => 적용검토 ,
	// 일단 현재는 아래 블로그 내용으로 적용함. 2021.12.15
	- https://velog.io/@1yongs_/NestJS-Testing-Jest => Jest 에서 Repository DI불가로 인해 mockRepository 사용
 */
