import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Account } from './account.entity';

@Entity('apikey')
export class Apikey {
  @PrimaryColumn()
  apiKey: string;

  @ManyToOne(() => Account, (account) => account.apikeys, { primary: true })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
