import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsArray, IsEmail, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { Apikey } from '../apikey/apikey.entity';
import { PartialType } from '@nestjs/swagger';
import { ValidationEntity } from '../shared/util/validation.entity';

@Entity('account')
export class Account {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  @Index({ unique: true })
  @Length(0, 50)
  account_id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Length(0, 100)
  account_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
  })
  @Length(7, 20)
  tel: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  @Length(0, 1000)
  remark: string;

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

  @OneToMany(() => Apikey, (apikey) => apikey.apikey)
  apikeys: Apikey[];
}
