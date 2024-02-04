import { Injectable } from '@nestjs/common';
import CommonRepository from 'src/helpers/commonRepository';
import PeriodRepository from '../repository/period.repository';

@Injectable()
export class PeriodService extends CommonRepository {
  constructor(private readonly periodRepository: PeriodRepository) {
    super();
  }
}
