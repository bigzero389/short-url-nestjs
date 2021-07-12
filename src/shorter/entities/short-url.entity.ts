import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('shortUrl')
export class ShortUrl {
  // @PrimaryColumn()
  // @Index({ unique: true })
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
