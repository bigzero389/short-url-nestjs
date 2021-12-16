import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyService } from './apikey.service';
import { DeleteResult } from 'typeorm';
import { CreateApikeyDto } from './apikey.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Apikey } from './apikey.entity';
import { CreateAccountDto } from '../account/account.dto';

// Service 의 Repository Injection을 Mocking 하기 위해 필요함.
const mockApikeyRepository = () => ({
  save: jest.fn( () => new Promise((resolve) => { resolve(new CreateApikeyDto()); }), ),
  find: jest.fn( () => new Promise((resolve) => { resolve(new Array<CreateApikeyDto>()); }), ),
  findOne: jest.fn( () => new Promise((resolve) => { resolve(new CreateApikeyDto()); }), ),
  update: jest.fn(),
  softDelete: jest.fn(),
  delete: jest.fn( () => new Promise((resolve) => { resolve(new DeleteResult()); }), ),
});

// test data 정의
const apikeyList = [
  {
    apikey: '318cffe4f7056283d2d4b96bf1133fe24f702eed',
    accountId: 'bigzero',
    beginDatetime: '20000101010000',
    endDatetime: '20221231235959',
  },
  {
    apikey: '8ec7510687acdd115911b4ea807db79913ea8589',
    accountId: 'bigzero',
    beginDatetime: '20000101010000',
    endDatetime: '20221231235959',
  },
];

describe('ApikeyService', () => {
  let service: ApikeyService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create', async () => {
      const result = await service.create(new CreateApikeyDto());
      expect(result).toBeInstanceOf(CreateApikeyDto);
    });
  });
});
