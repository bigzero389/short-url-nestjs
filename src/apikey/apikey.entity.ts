import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';
import { IsNotEmpty, Length } from 'class-validator';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { Shorter } from '../shorter/shorter.entity';

@Entity('apikey')
export class Apikey {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  apikey: string;

  @ManyToOne(() => Account, (account) => account.apikeys, { nullable: false })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'account_id' })
  account_id: any;
  // account: Account;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
    default: '20210101000000',
  })
  @Length(14, 14)
  end_datetime: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
    default: '99991231235959',
  })
  @Length(14, 14)
  begin_datetime: string;

  shorters: Shorter[];
}
