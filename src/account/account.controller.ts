import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Account } from './account.entity';
import { CreateAccountDto, PostAccountDto, PutAccountDto, } from './account.dto';
import { ResultDto } from '../shared/result.dto';
import { LikeType, ObjUtil } from '../shared/util/objUtil';
import { ResultCode } from '../shared/result-code';
import { ResultMsg } from '../shared/result-msg';
import { FindConditions, Like } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiImplicitHeader } from '@nestjs/swagger/dist/decorators/api-implicit-header.decorator';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@Controller('account')
@ApiTags('Account 관리')
@UseGuards(AuthGuard)
export class AccountController {
  private static readonly LOGGER = new Logger(AccountController.name);
  constructor(readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'account 생성', description: 'account 정보 생성' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiBody({ type: PostAccountDto })
  create(@Body() postDto: PostAccountDto) {
    AccountController.LOGGER.debug('create postAccountDto: ' + JSON.stringify(postDto));
    const createAccountDto: CreateAccountDto = new CreateAccountDto();
    Object.assign(createAccountDto, ObjUtil.camelCaseKeysToUnderscore(postDto));

    const serviceResult = from(this.accountService.create(postDto));
    const resultDto = new ResultDto();
    return serviceResult.pipe(
      map((account) => {
        console.log(account);
        if (account && account.account_id) {
          return { account, ...resultDto, isSuccess: true };
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return { account, ...resultDto };
        }
      }),
    );
  }

  @Get(':accountId')
  @ApiOperation({ summary: 'account 정보조회', description: 'accountId 에 따른 account 1건 정보조회' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiParam({ name: 'accountId', description: 'account id', example: 'shortUser01' })
  getOne(@Param() params): Observable<Account> {
    const accountList = from(this.accountService.getOne(params.accountId));
    return accountList.pipe(
      map((account) => {
        console.log(account);
        return account;
      }),
    );
  }

  @Get()
  @ApiOperation({ summary: 'account list 정보조회', description: 'query 정보에 따른 account 정보 리스트 조회', })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiQuery( { name: 'accountId', description: 'account id, = 검색', example: 'shortUser01', required: false }, )
  @ApiQuery( { name: 'email', description: 'email, 앞에서 부터 like 검색', example: 'tes', required: false }, )
  @ApiQuery( { name: 'accountName', description: 'account 이름, like 검색', example: '길동', required: false }, )
  @ApiQuery( { name: 'tel', description: '전화번호, like 검색', example: '2166', required: false }, )
  get(@Req() req): Observable<Account[]> {
    const getQueryParams = req.query;
    AccountController.LOGGER.debug('account get: ' + JSON.stringify(getQueryParams));

    const accountList = from(this.accountService.get(getQueryParams));
    return accountList.pipe(
      map((result) => {
        AccountController.LOGGER.debug('get: ' + JSON.stringify(result));
        return result;
      }),
    );
  }

  @Delete(':accountId')
  @ApiOperation({ summary: 'account 정보 삭제', description: 'account key 정보에 의한 1건 삭제', })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiParam( { name: 'accountId', description: 'account id, = 검색', example: 'shortUser01', required: true }, )
  deleteOne(@Param() params): Observable<ResultDto> {
    const resultDto = new ResultDto();
    const result = from(this.accountService.deleteOne(params.accountId));
    return result.pipe(
      map((result) => {
        AccountController.LOGGER.debug('deleteOne result: ' + JSON.stringify(result));
        if (result.affected != undefined) {
          resultDto.isSuccess = true;
          resultDto.resultCnt = result.affected;
          resultDto.resultMsg = 'deleted record count is ' + result.affected;
          return resultDto;
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return resultDto;
        }
      }),
    );
  }

  @Put()
  @ApiOperation({ summary: 'account 수정', description: 'account 정보 수정' })
  @ApiHeader( { name: 'short_auth_key', required: true, description: 'system auth key', schema: { default : 'bigzero-auth-key-01' } }, )
  @ApiBody({ type: PutAccountDto })
  update(@Body() putAccountDto: PutAccountDto): Observable<ResultDto> {
    AccountController.LOGGER.debug( 'update putAccountDto: ' + JSON.stringify(putAccountDto), );

    const result = from( this.accountService.update(putAccountDto), );
    const resultDto = new ResultDto();
    return result.pipe(
      map((result) => {
        AccountController.LOGGER.debug(
          'update result: ' + JSON.stringify(result),
        );
        if (result.affected != undefined) {
          resultDto.resultCnt = result.affected;
          resultDto.isSuccess = true;
          resultDto.resultMsg = 'updated record count is ' + result.affected;
          return resultDto;
        } else {
          resultDto.isSuccess = false;
          resultDto.resultCode = ResultCode.E500;
          resultDto.resultMsg = ResultMsg.getResultMsg(ResultCode.E500);
          return resultDto;
        }
      }),
    );
  }
}
