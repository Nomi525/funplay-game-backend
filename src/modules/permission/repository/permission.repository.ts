import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from '../entities/permission.entity';
import Logger from 'src/core/Logger';

@Injectable()
export default class PermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  public async getSinglePermissionData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info(
        'permission.repository --> info of getSinglePermissionData()',
      );

      return await this.permissionModel.findOne(data);
    } catch (error: any) {
      Logger.error.error(
        'permission.repository --> getSinglePermissionData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getListOfPermissionData(data: any, filter?: any): Promise<any> {
    try {
      Logger.access.info(
        'permission.repository --> info of getListOfPermissionData()',
      );
      return await this.permissionModel.find(data).sort({
        createdAt: -1,
      });
    } catch (error: any) {
      Logger.error.error(
        'permission.repository --> getListOfPermissionData() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async permissionDataUpdated(where: any, data: any): Promise<any> {
    try {
      Logger.access.info(
        'permission.repository --> info of permissionDataUpdated()',
      );
      return await this.permissionModel.findOneAndUpdate(
        where,
        { $set: data },
        { new: true },
      );
    } catch (error) {
      Logger.error.error(
        'permission.repository --> permissionDataUpdated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
  public async permissionDataUpdatedByBodyId(
    where: any,
    data: any,
  ): Promise<any> {
    try {
      Logger.access.info(
        'permission.repository --> info of permissionDataUpdatedByBodyId()',
      );
      if (where) {
        const updateData = await this.permissionModel.findByIdAndUpdate(
          { _id: where },
          {
            $set: data,
          },
          {
            new: true,
          },
        );
        return updateData;
      }
    } catch (error) {
      Logger.error.error(
        'permission.repository --> permissionDataUpdatedByBodyId() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async permissionDataCreated(data: any): Promise<any> {
    try {
      Logger.access.info(
        'permission.repository --> info of permissionDataCreated()',
      );
      return await new this.permissionModel(data).save();
    } catch (error) {
      Logger.error.error(
        'permission.repository --> permissionDataCreated() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
