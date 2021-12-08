import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, Length } from 'class-validator';
import { Apikey } from './apikey.entity';

@Entity('account')
export class Account {
  @Index({ unique: true })
  @PrimaryColumn({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  accountId: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  name: string;

  @IsEmail()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Length(7, 20)
  @Column({
    type: 'varchar',
    nullable: false,
  })
  tel: string;

  @Length(0, 200)
  @Column({
    type: 'varchar',
    nullable: true,
  })
  remark: string;

  @Length(14, 14)
  @Column({
    type: 'varchar',
    nullable: false,
    default: '20210101000000',
  })
  endDateTime: string;

  @Length(14, 14)
  @Column({
    type: 'varchar',
    nullable: false,
    default: '99991231235959',
  })
  beginDateTime: string;

  @OneToMany(() => Apikey, (apikey) => apikey.account)
  apikeys: Apikey[];
}
