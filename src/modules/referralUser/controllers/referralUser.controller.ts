import { Controller } from '@nestjs/common';
import { ReferralUserService } from '../services/referralUser.service';

@Controller('referralUser')
export class ReferralUserController {
  constructor(private readonly referralUserService: ReferralUserService) {}
}
