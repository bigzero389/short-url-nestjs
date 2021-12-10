import { ResultCode } from './result-code';

export class ResultMsg {
  private static _codeMap = new Map<string, string>([
    [ResultCode.E100, 'request header content type error'],
    [ResultCode.E110, 'apikey error'],
    [ResultCode.E120, 'origin url error'],
    [ResultCode.E130, 'end datetime error'],
    [ResultCode.E130, 'end datetime should in 1 year'],
    [ResultCode.E500, 'internal data error'],
  ]);

  static getResultMsg(code: string) {
    return this._codeMap.get(code);
  }
}
