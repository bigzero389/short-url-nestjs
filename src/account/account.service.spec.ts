import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AccountService,
        { provide: getRepositoryToken(Account), useClass: Repository },
      ],
    }).compile();

    service = await module.resolve(AccountService);
  });

  it('should be defined(서비스가 정의되어 있는지 체크)', () => {
    expect(service).toBeDefined();
  });

  it('getAll method should be defined', async () => {
    expect(service.getAll()).toBeDefined();
    // await service .getAll() .then((result) => expect(result).toBeInstanceOf(Array));
  });

  describe('getAll', () => {
    it('getAll method should be defined', async () => {
      expect(service.getAll()).toBeDefined();
      // await service .getAll() .then((result) => expect(result).toBeInstanceOf(Array));
    });
  });
});
