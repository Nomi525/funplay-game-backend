import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import Logger from 'src/core/Logger';
import CommonRepository from 'src/helpers/commonRepository';
import { sendResponse } from 'src/helpers/commonService';
import PermissionRepository from '../repository/permission.repository';
import { PermissionEnum } from '../constants/enums/permission.enum';

@Injectable()
export class PermissionService extends CommonRepository {
  constructor(private readonly permissionRepository: PermissionRepository) {
    super();
  }

  public async getAllPermission(
    req: Request | any,
    res: Response | any,
  ): Promise<any> {
    try {
      const getAllPermission =
        await this.permissionRepository.getListOfPermissionData({
          isDeleted: false,
        });
      if (getAllPermission.length) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: PermissionEnum.PERMISSION_FETCHED,
          data: getAllPermission,
        });
      } else {
        return res.status(200).json({
          status: StatusCodes.BAD_REQUEST,
          message: PermissionEnum.PERMISSION_LIST_NOT_FOUND,
          data: [],
        });
      }
    } catch (error) {
      Logger.error.error(
        'permission.service --> getListRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async permissionGetById(
    req: Request,
    res: Response,
    permissionId: string,
  ): Promise<any> {
    try {
      const getSinglePermission =
        await this.permissionRepository.getSinglePermissionData({
          _id: permissionId,
          is_deleted: 0,
        });
      if (getSinglePermission) {
        return sendResponse(
          res,
          StatusCodes.OK,
          PermissionEnum.PERMISSION_GET,
          getSinglePermission,
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          PermissionEnum.PERMISSION_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'permission.service --> getRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async deletePermission(
    req: Request,
    res: Response | any,
    permissionId: string,
  ): Promise<any> {
    try {
      const permissionDelete =
        await this.permissionRepository.permissionDataUpdated(
          { _id: permissionId },
          { isDeleted: true },
        );
      if (permissionDelete) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: PermissionEnum.PARTNER_DELETED,
          data: [],
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: PermissionEnum.PARTNER_NOT_DELETED,
          data: [],
        });
      }
    } catch (error) {
      Logger.error.error(
        'permission.service --> deletePermission() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async addEditPermission(
    req: Request,
    res: Response | any,
    permissionId: string,
    body: any,
  ): Promise<any> {
    try {
      if (permissionId) {
        const updatePermission =
          await this.permissionRepository.permissionDataUpdatedByBodyId(
            body.id,
            body,
          );
        if (updatePermission) {
          return res.status(200).json({
            status: StatusCodes.OK,
            message: PermissionEnum.PERMISSION_UPDATED,
            data: updatePermission,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: PermissionEnum.PERMISSION_UPDATED,
          });
        }
      } else {
        const savePermission =
          await this.permissionRepository.permissionDataCreated(body);
        if (savePermission) {
          return res.status(201).json({
            status: StatusCodes.CREATED,
            message: PermissionEnum.PERMISSION_CREATED,
            data: savePermission,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.OK,
            message: PermissionEnum.PERMISSION_NOT_CREATED,
            data: [],
          });
        }
      }
    } catch (error) {
      Logger.error.error(
        'permission.service --> addEditPermission() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async permissionActiveDeActive(
    req: Request,
    res: Response | any,
    permissionId: string,
  ): Promise<any> {
    try {
      const findPermission =
        await this.permissionRepository.getSinglePermissionData({
          _id: permissionId,
        });
      if (findPermission) {
        let message: any;
        if (findPermission.isActive) {
          findPermission.isActive = false;
          message = PermissionEnum.PERMISSION_DEACTIVE;
        } else {
          findPermission.isActive = true;
          message = PermissionEnum.PERMISSION_ACTIVE;
        }
        await findPermission.save();
        return sendResponse(res, StatusCodes.OK, message, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          PermissionEnum.PERMISSION_NOT_FOUND,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'permission.service --> permissionActiveDeActive() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
