import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from '../dto/notification.dto';

@Injectable()
export default class NotificationRepository {
  constructor(
    @InjectRepository(CreateNotificationDto)
    private readonly notificationRepository: Repository<CreateNotificationDto>,
  ) {}

  // public async send(replacementParameters: ReplacementParameters) {}
}
