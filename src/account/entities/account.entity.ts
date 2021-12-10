import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsArray, IsEmail, IsString, Length } from 'class-validator';
import { ApikeyEntity } from './apikey.entity';

@Entity('account')
export class AccountEntity {
  @Index({ unique: true })
  @PrimaryColumn({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  account_id: string;

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
  end_datetime: string;

  @Length(14, 14)
  @Column({
    type: 'varchar',
    nullable: false,
    default: '99991231235959',
  })
  begin_datetime: string;

  apikeys: ApikeyEntity[];
}
