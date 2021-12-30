import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Apikey } from '../apikey/apikey.entity';

@Entity('shorter')
@Index('IDX_SHORTER_01', ['end_datetime', 'short_url', 'begin_datetime'], { unique: true })
@Index('IDX_SHORTER_02', ['short_url'], { unique: false })
@Index('IDX_SHORTER_03', ['apikey'], { unique: false })
export class Shorter {
  @PrimaryGeneratedColumn()
  short_url_id: number;

  // 종료일시가 지난 short url 은 재사용 가능하다
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  short_url: string;

  @ManyToOne(() => Apikey, (parent) => parent.shorters, { nullable: false })
  @JoinColumn({ name: 'apikey', referencedColumnName: 'apikey' })
  apikey: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @IsNotEmpty()
  origin_url: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
    default: '20210101000000',
  })
  @IsNotEmpty()
  @Length(14, 14)
  end_datetime: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
  })
  @IsNotEmpty()
  @Length(14, 14)
  begin_datetime: string;

  @Column({
    type: 'int4',
    nullable: false,
    default: 0,
  })
  @IsNotEmpty()
  short_url_cnt: number = 0;
}
