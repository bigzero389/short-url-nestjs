import * as Moment from 'moment';
import 'moment-timezone';
import { Logger } from '@nestjs/common';
import { KOR_TIMEZONE } from './constant';

export class DateUtil {
  private static readonly LOGGER = new Logger(DateUtil.name);

  public static getDateKOR(): Date {
    Moment.tz.setDefault(KOR_TIMEZONE);
    return Moment().toDate();
  }

  public static getNowformatKOR(format: string): string {
    Moment.tz.setDefault(KOR_TIMEZONE);
    return Moment().format(format);
  }

  public static isValidTimestamp(timestamp: string): boolean {
    const moment = Moment(timestamp, 'YYYYMMDDHHmmss');
    return moment.isValid();
  }

  public static getIntervalSecond( expireTimestamp: string, beginTimestamp?: string, ): number {
    let nowMoment = Moment(DateUtil.getDateKOR());
    if (beginTimestamp) {
      nowMoment = Moment(beginTimestamp, 'YYYYMMDDHHmmss');
    }
    const endMoment = Moment(expireTimestamp, 'YYYYMMDDHHmmss');

    const diff = Math.floor(
      Moment.duration(endMoment.diff(nowMoment)).asSeconds(),
    );
    DateUtil.LOGGER.debug(diff);
    return diff;
  }
}
