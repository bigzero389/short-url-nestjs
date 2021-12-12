import { AccountService } from '../../account/account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../../account/account.entity';
import { Repository } from 'typeorm';
import { ObjUtil } from './objUtil';
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
  });
});
