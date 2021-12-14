import { Injectable } from '@nestjs/common';
import { ShorterDto } from './shorter.dto';
import { Shorter } from './shorter.entity';

@Injectable()
export class ShorterService {
  getHello(): string {
    return 'Hello World!';
  }

  async createShortUrl(dto: ShorterDto): Promise<Shorter> {
    return new Promise<Shorter>((resolve, reject) => {
      const shortUrlEntity: Shorter = new Shorter();
      // origin url 을 short url 로 변환한다.
      shortUrlEntity.short_url = 'https://s.hist-tech.net/asldfkjalskd';
      shortUrlEntity.origin_url = dto.originUrl;
      shortUrlEntity.end_datetime = dto.endDatetime;
      resolve(shortUrlEntity);
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
