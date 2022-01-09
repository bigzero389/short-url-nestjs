import { DateUtil } from './dateUtil';

describe('DateUtil', () => {
  it('should be defined(서비스가 정의되어 있는지 체크)', () => {
    expect(DateUtil).toBeDefined();
  });

  describe('validTimestamp', () => {
    it('right timestamp', () => {
      const isValid = DateUtil.isValidTimestamp('20211231235959');
      expect(isValid).toBe(true);
    });
    it('13th month', () => {
      const isValid = DateUtil.isValidTimestamp('20211331235959');
      expect(isValid).toBe(false);
    });
    it('02/29', () => {
      const isValid = DateUtil.isValidTimestamp('20220229235959');
      expect(isValid).toBe(false);
    });
    it('25 hours', () => {
      const isValid = DateUtil.isValidTimestamp('20220228255959');
      expect(isValid).toBe(false);
    });
  });

  describe('dateUtil', () => {
    it('checkKORTime', () => {
      const baseDate = new Date();
      // baseDate.setHours(baseDate.getHours()); // KOR
      const year = baseDate.getFullYear();
      const monthNumber = baseDate.getMonth() + 1;
      const month = String(monthNumber).length == 1 ? '0' + (monthNumber) : monthNumber;
      const dayNumber = baseDate.getDate();
      const day = String(dayNumber).length == 1 ? '0' + (dayNumber) : dayNumber;
      const hour = baseDate.getHours();
      const base = `${year}${month}${day} ${hour}`;

      const now = DateUtil.getNowformatKOR('YYYYMMDD HH');
      expect(now).toEqual(base);
    });

    it('diffSecond', () => {
      const diff = DateUtil.getIntervalSecond(
        '20211230123000',
        '20211230122900',
      );
      expect(diff).toBe(60);
    });
  });
});
