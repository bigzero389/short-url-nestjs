import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Account } from '../account/account.entity';
import { Apikey } from '../apikey/apikey.entity';

@Entity('shorter')
export class Shorter {
  @PrimaryColumn({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  @Index({ unique: true })
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
    default: '20210101000000',
  })
  @IsNotEmpty()
  @Length(14, 14)
  begin_datetime: string;
}
