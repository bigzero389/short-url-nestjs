import { Body, Controller, Get, Post } from '@nestjs/common';
import { ShorterService } from './shorter.service';
import { UrlData } from './entities/urldata.entity';

@Controller('shorter')
export class ShorterController {
  constructor(private readonly shorterService: ShorterService) {}

  @Get()
  getHello(): string {
    return this.shorterService.getHello();
  }

  @Post()
  createUrl(@Body() urldata: UrlData) {
    console.log(urldata.user_agent);
    console.log(urldata.accept);
    console.log(urldata.content_type);
    console.log(urldata.content_length);
    console.log(urldata.api_key);
    console.log(urldata.target_url);
    console.log(urldata.period_second);
    console.log(urldata.end_date_yyyyMMddHHmmss);
  }
}
