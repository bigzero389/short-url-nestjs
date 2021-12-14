import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResultDto {
  @IsBoolean()
  @IsNotEmpty()
  isSuccess: boolean = false;

  @IsString()
  resultCode: string;

  @IsString()
  resultMsg: string;

  @IsNumber()
  resultCnt: number;
}
