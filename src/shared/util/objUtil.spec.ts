import { AccountService } from '../../account/account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../../account/account.entity';
import { Like, Repository } from 'typeorm';
import { LikeType, ObjUtil } from './objUtil';
import { CreateAccountDto } from '../../account/account.dto';

describe('ObjUtil', () => {

  it('should be defined(서비스가 정의되어 있는지 체크)', () => {
    expect(ObjUtil).toBeDefined();
  });

  describe('objUtil', () => {
    it('camelKeys', () => {
      const sourceObj = {
        accountId: 'test',
      };
      expect(
        ObjUtil.camelCaseKeysToUnderscore(sourceObj)['account_id'],
      ).toEqual('test');
    });

    it('conditions', () => {
      const conditionMap = new Map<string, LikeType>([
        ['accountId', LikeType.ALL],
        ['accountName', LikeType.LEFT],
      ]);
      const targetObj = {};
      targetObj['accountId'] = 'bigzero';
      targetObj['accountName'] = 'dyheo';
      const conditionResult = { account_id: Like(`%bigzero%`), account_name: Like(`%dyheo`) };

      expect(ObjUtil.condition(conditionMap, targetObj)).toEqual( conditionResult, );
    });
  });
});
