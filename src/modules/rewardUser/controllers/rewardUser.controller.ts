import { Controller } from '@nestjs/common';
import { RewardUserService } from '../services/rewardUser.service';

@Controller('rewardUser')
export class RewardUserController {
  constructor(private readonly rewardUserService: RewardUserService) {}
}
