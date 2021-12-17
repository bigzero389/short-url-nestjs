import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsArray, IsEmail, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { Apikey } from '../apikey/apikey.entity';
import { PartialType } from '@nestjs/swagger';
import { ValidationEntity } from '../shared/util/validation.entity';

// Entity는 대부분의 DBMS가 소문자와 언더스코어가 표준 컬럼방식이므로 이 방식을 따르도록 구성한다.
// 어플리케이션에서는 카멜표기법을 사용함에 따라 서비스와 리포지토리 연계시 카멜표기법을 언더스코어로 전환하는 것이 필요한데 이것이 불필요한 추가작업인지
// 어플리케이션과 DBMS간의 독립성을 위한 작업인지가 어플리케이션 특징과 개발인력의 규모에 따라 달라진다.
// 소규모 시스템에서는 dto 와 entity 모두 언더스코어 방식을 사용하는 것이 권장되지만 대규모 시스템에서는 dto는 카멜표기(데이터구조를 외부에 노출시키지 않기 위해), entity는 언더스코어를 사용하는 것이 바람직하다 생각된다.
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
