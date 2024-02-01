import { Controller } from '@nestjs/common';
import { AdminSettingService } from '../services/adminSetting.service';

@Controller('adminSetting')
export class AdminSettingController {
  constructor(private readonly adminSettingService: AdminSettingService) {}
}
