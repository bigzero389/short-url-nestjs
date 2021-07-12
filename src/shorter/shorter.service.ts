import { Injectable } from '@nestjs/common';
import { ReqUrlDto } from './dto/req-url.dto';
import { ShortUrl } from './entities/short-url.entity';

@Injectable()
export class ShorterService {
  getHello(): string {
    return 'Hello World!';
  }

  async createShortUrl(reqUrlDto: ReqUrlDto): Promise<ShortUrl> {
    return new Promise<ShortUrl>((resolve, reject) => {
      const shortUrl: ShortUrl = new ShortUrl();
      shortUrl.originUrl = reqUrlDto.originUrl;
      shortUrl.shortUrl = 'https://s.hist-tech.net/asldfkjalskd';
      shortUrl.endDateTime = reqUrlDto.endDateTime;
      resolve(shortUrl);
    });
  }

  async getOriginUrl(shortUrl: string): Promise<string> {
    // redis 에서 shortUrl 을 찾아서 OriginUrl 을 리턴한다.
    const originUrl = '';
    return new Promise<string>(() => {
      return originUrl;
    });
  }
}
