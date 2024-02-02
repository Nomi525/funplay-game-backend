import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logger from 'src/core/Logger';
import { Admin } from '../entities/admin.entity';

@Injectable()
export default class AdminRepository {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
  ) {}

  public async getSingleAdminData(data: any, extra?: any): Promise<any> {
    try {
      Logger.access.info('user.repository --> info of getSingleAdminData()');
      if (extra === 'role') {
        return await this.adminModel.findOne(data).populate('role');
      }
      return await this.adminModel.findOne(data);
    } catch (error) {
      Logger.error.error(
        'user.repository --> getSingleAdminData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // public async getUserDataById(id: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of getUserDataById()');
  //     return await this.userModel.findById(id);
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> getUserDataById() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // public async userDataCreate(data: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of userDataCreate()');
  //     return await new this.userModel(data).save();
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> userDataCreate() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  public async adminDataUpdated(where: any, data: any): Promise<any> {
    try {
      Logger.access.info('user.repository --> info of adminDataUpdated()');
      return await this.adminModel.findOneAndUpdate(
        where,
        { $set: data },
        { new: true },
      );
    } catch (error) {
      Logger.error.error(
        'user.repository --> adminDataUpdated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  // public async userDataUpdatedById(
  //   id: any,
  //   data: any,
  //   extra: any,
  // ): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of userDataUpdatedById()');
  //     return await this.userModel.findByIdAndUpdate(
  //       id,
  //       { $set: data },
  //       { new: true, ...extra },
  //     );
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> userDataUpdatedById() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
