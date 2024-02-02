import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { AllocationService } from 'src/modules/allocation/services/allocation.service';
import { generateDynamicHtml } from '../email/dynamicHtmlTemplate';
import { sendEmail } from '../email/sendEmailNodeMailer';

@Injectable()
export class NotificationService {
  constructor(private readonly allocationService: AllocationService) {}

  public async notificationForAllocationStatusForResignedEmployees(): Promise<
    any | []
  > {
    // Set the notification with a dynamic template
    const allocationDetails =
      await this.allocationService.allocationStatusForResignedEmployees();
    const createHtml = await generateDynamicHtml(
      join(
        __dirname,
        '../../../../src/modules/notification/email/view/allocationEmailTemplate.html',
      ),
      { allocationDetails },
    );

    const emailSent = await sendEmail('noman.mansuri525@gmail.com', createHtml);
    console.log({ emailSent });

    return emailSent;
  }
}
