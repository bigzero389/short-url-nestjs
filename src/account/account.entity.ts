import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsArray, IsEmail, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { Apikey } from './apikey.entity';
import { PartialType } from '@nestjs/swagger';
import { ValidationEntity } from '../shared/util/validation.entity';

@Entity('account')
export class Account {
  @Index({ unique: true })
  @Length(0, 50)
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  account_id: string;

  @Length(0, 100)
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  account_name: string;

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
    length: 20,
  })
  tel: string;

  @Length(0, 1000)
  @Column({
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  remark: string;

  @Length(14, 14)
  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
    default: '20210101000000',
  })
  end_datetime: string;

  @Length(14, 14)
  @Column({
    type: 'varchar',
    nullable: false,
    length: 14,
    default: '99991231235959',
  })
  begin_datetime: string;

  apikeys: Apikey[];
}
