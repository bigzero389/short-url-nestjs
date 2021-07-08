import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('shortUrl')
export class ShortUrl {
  // @PrimaryColumn()
  // @Index({ unique: true })
  @Column()
  apiKey: string;

  @Column()
  targetUrl: string;

  @Column()
  end_date: string;

  @Column()
  shortUrl: string;
  // genres: string[];
}
