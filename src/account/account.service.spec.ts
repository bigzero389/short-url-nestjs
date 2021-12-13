import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './account.dto';

const mockAccountRepository = () => ({
  save: jest.fn(() => new Promise( (resolve) => { resolve( new CreateAccountDto()); })),
  find: jest.fn(() => new Promise((resolve) => { resolve(new Array<CreateAccountDto>()); })),
  findOne: jest.fn(() => new Promise((resolve) => { resolve(new CreateAccountDto()); })),
  update: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AccountService', () => {
  let service: AccountService;
  // let repository: MockRepository<Account>;
  // let repository: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        // AccountService, { provide: getRepositoryToken(Account), useClass: Repository }, // DI가 정상적으로 작동하는 경우 이렇게 해야 된다.
        // AccountService, { provide: getRepositoryToken(Account), useValue: repository, }, // Repository를 Custom으로 만들어 적용하는 경우 처리. 이것도 현재는 안됨.
        AccountService, { provide: getRepositoryToken(Account), useFactory: mockAccountRepository, }, // 결국 mock으로 처리.
      ],
    }).compile();

    service = await module.resolve(AccountService);
    // repository = module.get<MockRepository<Account>>( getRepositoryToken(Account), );
  });

  it('should be defined(서비스가 정의되어 있는지 체크)', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const createAccountDto = {
      accountId: 'bigzero4',
      name: 'dyheo',
      email: 'dyheo@hist.co.kr',
      tel: '01062889304',
      remark: '',
      endDatetime: '20221231235959',
      beginDatetime: '20000101010000',
    };
    const result = await service.create(createAccountDto);
    expect(result).toBeInstanceOf(CreateAccountDto);
  });

  it('getAll', async () => {
    // expect(service.getAll()).toBeDefined();
    const result = await service.getAll();
    expect(result).toBeInstanceOf(Array);
  });

  // it('getAll method should be defined', async () => {
  //   expect(service.getAll()).toBeDefined();
  //   // await service .getAll() .then((result) => expect(result).toBeInstanceOf(Array));
  // });

  // describe('getAll', () => {
  //   it('getAll method should be defined', async () => {
  //     // expect(service.getAll()).toBeDefined();
  //     const result = await service.getAll();
  //     expect(result).toBeInstanceOf(Array);
  //   });
  // });
});
