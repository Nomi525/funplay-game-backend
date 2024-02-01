import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import AllocationRepository from 'src/modules/allocation/repository/allocation.repository';
import { AllocationService } from 'src/modules/allocation/services/allocation.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@Injectable()
export class CronJobService {
  constructor(
    private readonly allocationRepository: AllocationRepository,
    private readonly notificationService: NotificationService,
  ) {}

  // cronJob run at every 2 mint
  @Cron(`${process.env.CRONJOB_RUN}`) async every2MintCronJob() {
    console.log(`<-----running cronJobs----->`, new Date());

    const retAllocationStatus =
      await this.allocationRepository.findAllocationStatus();

    // Notification is not sent when resigning employee allocation does not exist
    if (retAllocationStatus.length > 0) {
      await this.notificationService.notificationForAllocationStatusForResignedEmployees();
    }
  }
}
