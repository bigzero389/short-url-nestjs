import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { ReqUrlDto } from './dto/req-url.dto';
import { ShortUrl } from './entities/short-url.entity';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResUrlDto } from './dto/res-url.dto';

@Controller('shorter')
export class ShorterController {
  constructor(private readonly shorterService: ShorterService) {}

  @Get()
  getHello(): string {
    return this.shorterService.getHello();
  }

  @Post()
  createUrl(@Headers() headers, @Body() reqUrlDto: ReqUrlDto): ResUrlDto {
    console.log(headers);
    const resUrlDto: ResUrlDto = new ResUrlDto();
    const content_type = headers['content-type'] ?? '';
    const api_key = headers['shorten_api_key'] ?? '';
    const target_url = reqUrlDto.target_url ?? '';
    const end_date = reqUrlDto.end_date_ISO8601 ?? '';
    const period_second = reqUrlDto.period_second ?? '';

    // json type 여부 체크.
    if (content_type == 'application/json') {
      resUrlDto.api_res_result = true;
      resUrlDto.api_res_msg = '';
    } else {
      resUrlDto.api_res_result = false;
      resUrlDto.api_res_msg = 'content-type error';
    }

    // api key 체크.
    if (api_key == 'bigzeroKey') {
      // ** apiKey 정상여부 체크
      resUrlDto.api_res_result = true;
      resUrlDto.api_res_msg = '';
    } else {
      resUrlDto.api_res_result = false;
      resUrlDto.api_res_msg = 'api key error';
    }

    // target_url 체크
    if (target_url) {
      resUrlDto.api_res_result = true;
      resUrlDto.api_res_msg = '';
    } else {
      resUrlDto.api_res_result = false;
      resUrlDto.api_res_msg = 'target url error';
    }

    // end_date and period 체크
    if (end_date || period_second) {
      resUrlDto.api_res_result = true;
      resUrlDto.api_res_msg = '';
    } else {
      resUrlDto.api_res_result = false;
      resUrlDto.api_res_msg = 'end_date or period_second error';
    }

    if (resUrlDto.api_res_result) {
      const shortUrl = from(
        this.shorterService.createShortUrl(reqUrlDto, api_key),
      );
      shortUrl.subscribe(
        (result) => {
          console.log(result.shortUrl);
          resUrlDto.shorten_url = result.shortUrl;
          resUrlDto.api_key = result.apiKey;
          resUrlDto.end_date = result.end_date;
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      console.error(
        '[SHORT URL RESULT]: %s, [SHORT URL MESSAGE]: %s',
        resUrlDto.api_res_result,
        resUrlDto.api_res_msg,
      );
    }
    return resUrlDto;
  }
}
