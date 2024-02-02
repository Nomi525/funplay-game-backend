import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './controllers/notification.controller';
import NotificationRepository from './repository/notification.repository';
import { NotificationService } from './services/notification.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { AllocationModule } from '../allocation/allocation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreateNotificationDto]),
    AllocationModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
