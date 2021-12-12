import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Account } from './account.entity';

@Entity('apikey')
export class Apikey {
  @ManyToOne(() => Account, (account) => account.apikeys, { primary: true, })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @PrimaryColumn()
  apikey: string;
}
