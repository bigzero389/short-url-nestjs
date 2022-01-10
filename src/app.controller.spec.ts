import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/common';
import { RedisService } from './shared/util/redis.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService, 
        ConfigService,
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: { set: jest.fn(), get: jest.fn() },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  it('should be defined(서비스가 정의되어 있는지 체크)', () => {
    expect(appController).toBeDefined();
  });

  describe('health check', () => {
    it('should be "ok"', () => {
      expect(appController.getHealth()).toBe('ok');
    });
    it('should be "Hello Bigzero Short URL!"', () => {
      expect(appController.get()).toBe('Hello Bigzero Short URL!');
    });
  });
});
