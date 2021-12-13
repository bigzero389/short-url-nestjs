import { Account } from './account.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
