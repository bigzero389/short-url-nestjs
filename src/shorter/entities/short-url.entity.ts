import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

// @Entity('shortUrl')
export class ShortUrl {
  @Index({ unique: true })
  @PrimaryColumn()
  @Column()
  apiKey: string;

  @Column()
  originUrl: string;

  @Column()
  shortUrl: string;

  @Column()
  endDateTime: string;

  @Column()
  beginDateTime: string;
}
