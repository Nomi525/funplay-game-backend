import { Injectable } from '@nestjs/common';
import ReferralUserRepository from '../repository/referralUser.repository';

@Injectable()
export class ReferralUserService {
  constructor(
    private readonly referralUserRepository: ReferralUserRepository,
  ) {}
}
