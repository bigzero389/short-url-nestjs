import { Injectable } from '@nestjs/common';
import { ReqUrlDto } from './dto/req-url.dto';
import { ShortUrl } from './entities/short-url.entity';
import { format } from 'date-fns';

@Injectable()
export class ShorterService {
  getHello(): string {
    return 'Hello World!';
  }

  async createShortUrl(
    reqUrlDto: ReqUrlDto,
    apiKey: string,
  ): Promise<ShortUrl> {
    return new Promise<ShortUrl>((resolve, reject) => {
      const shortUrl: ShortUrl = new ShortUrl();
      shortUrl.apiKey = apiKey;
      shortUrl.targetUrl = reqUrlDto.target_url;
      if (reqUrlDto.end_date_ISO8601) {
        // end_date 가 있으면 무조건 end_date 를 종료일자로 처리
        shortUrl.end_date = reqUrlDto.end_date_ISO8601;
      } else if (reqUrlDto.period_second) {
        // ** end_date 가 없고 period 가 있으면 period 를 end_date 로 연산해서 처리
        const timezoneOffset = new Date().getTimezoneOffset() * 60000; // UTC 를 seoul 로 변환
        const now = new Date(Date.now() - timezoneOffset);
        console.log(now.toISOString());
        const after_second = new Date(
          now.getTime() + reqUrlDto.period_second * 1000,
        );
        console.log(after_second.toISOString().substring(0, 19));
        shortUrl.end_date = after_second.toISOString().substring(0, 19);
      }
      shortUrl.shortUrl = 'https://s.hist-tech.net/bigzero';
      console.log('================:' + shortUrl.shortUrl);
      resolve(shortUrl);
    });
  }
}
