import { Injectable } from '@nestjs/common';
import AdminSettingRepository from 'src/modules/adminSetting/repository/adminSetting.repository';
import RewardUserRepository from '../repository/rewardUser.repository';

@Injectable()
export class RewardUserService {
  constructor(
    private readonly rewardUserRepository: RewardUserRepository,
    private readonly adminSettingRepository: AdminSettingRepository,
  ) {}

  public async addUserReward(data: any): Promise<any> {
    const adminSettingData =
      await this.adminSettingRepository.getAdminSettingReward();

    return await this.rewardUserRepository.createUserReward({
      ...data,
      adminSettingData,
    });
  }
}
