import { Injectable, Logger } from '@nestjs/common';
import { Apikey } from './apikey.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApikeyDto } from './apikey.dto';
import { Account } from '../account/account.entity';

@Injectable()
export class ApikeyService {
  private static readonly LOGGER = new Logger(ApikeyService.name);

  constructor(
    @InjectRepository(Apikey) private apikeyRepository: Repository<Apikey>,
  ) {}

  async create(dto: CreateApikeyDto): Promise<Apikey> {
    const createdData = await this.apikeyRepository
      .save({
        ...dto,
      })
      .then((result) => result)
      .catch((err) => {
        ApikeyService.LOGGER.error('create: ' + err);
        return new Apikey();
      });
    return createdData;
  }

}
