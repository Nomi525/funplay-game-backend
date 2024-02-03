import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../entities/role.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  // public async getSingleAdminData(data: any, extra?: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of getSingleAdminData()');
  //     if (extra === 'role') {
  //       return await this.adminModel.findOne(data).populate('role');
  //     }
  //     return await this.adminModel.findOne(data);
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> getSingleAdminData() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // // public async getUserDataById(id: any): Promise<any> {
  // //   try {
  // //     Logger.access.info('user.repository --> info of getUserDataById()');
  // //     return await this.userModel.findById(id);
  // //   } catch (error) {
  // //     Logger.error.error(
  // //       'user.repository --> getUserDataById() indicates error',
  // //       error.message,
  // //     );
  // //     throw new BadRequestException(error.message);
  // //   }
  // // }

  // // public async userDataCreate(data: any): Promise<any> {
  // //   try {
  // //     Logger.access.info('user.repository --> info of userDataCreate()');
  // //     return await new this.userModel(data).save();
  // //   } catch (error) {
  // //     Logger.error.error(
  // //       'user.repository --> userDataCreate() indicates error',
  // //       error.message,
  // //     );
  // //     throw new BadRequestException(error.message);
  // //   }
  // // }

  // public async adminDataUpdated(where: any, data: any): Promise<any> {
  //   try {
  //     Logger.access.info('user.repository --> info of adminDataUpdated()');
  //     return await this.adminModel.findOneAndUpdate(
  //       where,
  //       { $set: data },
  //       { new: true },
  //     );
  //   } catch (error) {
  //     Logger.error.error(
  //       'user.repository --> adminDataUpdated() indicates error',
  //       error.message,
  //     );
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // // public async userDataUpdatedById(
  // //   id: any,
  // //   data: any,
  // //   extra: any,
  // // ): Promise<any> {
  // //   try {
  // //     Logger.access.info('user.repository --> info of userDataUpdatedById()');
  // //     return await this.userModel.findByIdAndUpdate(
  // //       id,
  // //       { $set: data },
  // //       { new: true, ...extra },
  // //     );
  // //   } catch (error) {
  // //     Logger.error.error(
  // //       'user.repository --> userDataUpdatedById() indicates error',
  // //       error.message,
  // //     );
  // //     throw new BadRequestException(error.message);
  // //   }
  // // }

  public async getSingleRoleData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info('role.repository --> info of getSingleRoleData()');

      return await this.roleModel.findOne(data);
    } catch (error: any) {
      Logger.error.error(
        'role.repository --> getSingleRoleData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getListOfRoleData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info('role.repository --> info of getListOfRoleData()');
      return await this.roleModel.find(data);
    } catch (error: any) {
      Logger.error.error(
        'role.repository --> getListOfRoleData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async roleDataUpdated(where: any, data: any): Promise<any> {
    try {
      Logger.access.info('role.repository --> info of roleDataUpdated()');
      return await this.roleModel.findOneAndUpdate(
        where,
        { $set: data },
        { new: true },
      );
    } catch (error) {
      Logger.error.error(
        'role.repository --> roleDataUpdated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async RoleDataCreated(data: any): Promise<any> {
    try {
      Logger.access.info('role.repository --> info of RoleDataCreated()');
      return await new this.roleModel(data).save();
    } catch (error) {
      Logger.error.error(
        'role.repository --> RoleDataCreated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
