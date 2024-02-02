import { Injectable } from '@nestjs/common';
import AdminSettingRepository from '../repository/adminSetting.repository';

@Injectable()
export class AdminSettingService {
  constructor(
    private readonly adminSettingRepository: AdminSettingRepository,
  ) {}
}
