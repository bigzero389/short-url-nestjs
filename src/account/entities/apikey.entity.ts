import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AccountEntity } from './account.entity';

@Entity('apikey')
export class ApikeyEntity {
  @ManyToOne(() => AccountEntity, (account) => account.apikeys, { primary: true, })
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @PrimaryColumn()
  apikey: string;
}
