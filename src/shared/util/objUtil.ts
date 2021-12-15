import { FindConditions, Like } from 'typeorm';
import { Logger } from '@nestjs/common';

export class ObjUtil {
  private static readonly LOGGER = new Logger(ObjUtil.name);

  public static camelCaseKeysToUnderscore(obj) {

    if (typeof obj != 'object') return obj;

    for (const oldName in obj) {
      // Camel to underscore
      const newName = oldName.replace(/([A-Z])/g, function ($1) {
        return '_' + $1.toLowerCase();
      });

      // Only process if names are different
      if (newName != oldName) {
        // Check for the old property name to avoid a ReferenceError in strict mode.
        if (obj.hasOwnProperty(oldName)) {
          obj[newName] = obj[oldName];
          delete obj[oldName];
        }
      }

      // Recursion
      if (typeof obj[newName] == 'object') {
        obj[newName] = this.camelCaseKeysToUnderscore(obj[newName]);
      }
    }
    return obj;
  }

  public static camelToUnderscore(key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  // TypeORM where 절 생성기
  public static condition(keys: Map<string, LikeType>, target: any): any {
    // let conditions = {};
    // if (req.query['accountId']) {
    //   conditions = { ...conditions, account_id: req.query.accountId };
    // }
    // if (req.query.accountName) {
    //   conditions = { ...conditions, account_name: Like(`%${req.query.accountName}%`) };
    // }
    // if (req.query.tel) {
    //   conditions = { ...conditions, tel: Like(`%{req.query.tel}%`) };
    // }
    // if (req.query.email) {
    //   conditions = { ...conditions, email: Like(req.query.email) };
    // }

    let conditions = {};

    keys.forEach((value, key) => {
      const targetValue = target[key]; // ex) key: accountId, targetValue: bigzero
      if (targetValue) {
        const propertyName = this.camelToUnderscore(key);
        if (value == LikeType.LEFT) {
          conditions = { ...conditions, [propertyName]: Like(`%${targetValue}`) };
        } else if (value == LikeType.RIGHT) {
          conditions = { ...conditions, [propertyName]: Like(`${targetValue}%`) };
        } else if (value == LikeType.ALL) {
          conditions = { ...conditions, [propertyName]: Like(`%${targetValue}%`) };
        } else {
          conditions = { ...conditions, [propertyName]: targetValue };
        }
      }
    });
    ObjUtil.LOGGER.debug('conditions is :' + JSON.stringify(conditions));

    return conditions;
  }
}

export enum LikeType {
  NOT = 'NOT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ALL = 'ALL',
}
