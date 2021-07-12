import { IsBoolean, IsString } from 'class-validator';

export class ApiResult {
  @IsBoolean()
  apiResult: boolean;

  @IsString()
  apiResultCode: string;

  @IsString()
  apiResultMsg: string;

  setApiResult(
    apiResult: boolean,
    apiResultCode?: string,
    apiResultMsg?: string,
  ) {
    this.apiResult = apiResult;
    this.apiResultCode = apiResultCode ?? '';
    this.apiResultMsg = apiResultMsg ?? '';
  }
}
