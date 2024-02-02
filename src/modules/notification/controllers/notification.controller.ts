import { Controller } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}
