import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Apikey } from './apikey.entity';
import { CreateApikeyDto } from './apikey.dto';
import { DeleteResult } from 'typeorm';
import { AuthModule } from '../auth/auth.module';

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

describe('ApikeyController', () => {
  let controller: ApikeyController;
  let service: ApikeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [ApikeyController],
      providers: [
        ApikeyService,
        {
          provide: getRepositoryToken(Apikey),
          useValue: mockApikeyRepository(),
        },
      ],
    }).compile();

    controller = module.get<ApikeyController>(ApikeyController);
    service = module.get<ApikeyService>(ApikeyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
