import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ResultDto {
  @IsBoolean()
  @IsNotEmpty()
  isSuccess: boolean = true;

  @IsString()
  resultCode: string;

  @IsString()
  resultMsg: string;

  // setApiResult = (
  //   isSuccess: boolean,
  //   resultCd?: string,
  //   resultMsg?: string,
  // ) => {
  //   this.isSuccess = isSuccess;
  //   this.resultCd = resultCd ?? '';
  //   this.resultMsg = resultMsg ?? '';
  // };
}
