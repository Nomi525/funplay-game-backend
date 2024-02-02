import { Module } from '@nestjs/common';
import { AllocationModule } from '../allocation/allocation.module';
import { CronJobService } from './services/cronjob.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [AllocationModule, NotificationModule],
  controllers: [],
  providers: [CronJobService],
  exports: [],
})
export class CronJobModule {}
