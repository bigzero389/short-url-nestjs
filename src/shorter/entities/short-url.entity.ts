import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

// @Entity('shortUrl')
export class ShortUrlEntity {
  @Index({ unique: true })
  @PrimaryColumn()
  @Column()
  apikey: string;

  @Column()
  origin_url: string;

  @Column()
  short_url: string;

  @Column()
  end_datetime: string;

  @Column()
  begin_datetime: string;
}
