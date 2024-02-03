import { BadRequestException, Injectable } from '@nestjs/common';
import CommonRepository from 'src/helpers/commonRepository';
import RoleRepository from '../repository/role.repository';
import Logger from 'src/core/Logger';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from 'src/helpers/commonService';
import { RoleEnum } from '../constants/enums/role.enum';
import { AddEditRoleRequestDto } from '../dto/role.dto';

@Injectable()
export class RoleService extends CommonRepository {
  constructor(private readonly roleRepository: RoleRepository) {
    super();
  }

  public async getListRole(req: Request | any, res: Response): Promise<any> {
    try {
      const listRole = await this.roleRepository.getListOfRoleData({
        is_deleted: 0,
      });
      if (listRole.length) {
        return sendResponse(res, StatusCodes.OK, RoleEnum.ROLE_LIST, listRole);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          RoleEnum.FAILED_TO_FETCH,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'role.service --> getListRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async getRole(
    req: Request,
    res: Response,
    roleId: string,
  ): Promise<any> {
    try {
      const findRole = await this.roleRepository.getSingleRoleData({
        _id: roleId,
        is_deleted: 0,
      });
      if (findRole) {
        return sendResponse(res, StatusCodes.OK, RoleEnum.ROLE_GET, findRole);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          RoleEnum.FAILED_TO_FETCH,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'role.service --> getRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async deleteRole(
    req: Request,
    res: Response,
    roleId: string,
  ): Promise<any> {
    try {
      const deleteRole = await this.roleRepository.roleDataUpdated(
        { _id: roleId },
        { is_deleted: 1 },
      );
      if (deleteRole) {
        return sendResponse(res, StatusCodes.OK, RoleEnum.ROLE_DELETE, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          RoleEnum.FAILED_TO_DELETE,
          [],
        );
      }
    } catch (error) {
      Logger.error.error(
        'role.service --> deleteRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  public async addEditRole(
    req: Request,
    res: Response,
    addEditRole: AddEditRoleRequestDto,
  ): Promise<any> {
    try {
      const findRoleQuery: any = {
        roleName: { $regex: '^' + addEditRole.roleName + '$', $options: 'i' },
        is_deleted: 0,
      };
      if (addEditRole.roleId) {
        findRoleQuery._id = { $ne: addEditRole.roleId };
      }
      const findRole = await this.roleRepository.getSingleRoleData(
        findRoleQuery,
      );
      if (findRole) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          RoleEnum.ROLE_LIST,
          [],
        );
      }
      if (!addEditRole.roleId) {
        const addRole = await this.roleRepository.RoleDataCreated({
          roleName: addEditRole.roleName,
          permission: addEditRole.permission,
          permissionType: addEditRole.permissionType,
        });
        const createRole = await addRole.save();
        if (createRole) {
          return sendResponse(
            res,
            StatusCodes.CREATED,
            RoleEnum.ROLE_CREATED,
            createRole,
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            RoleEnum.FAILED_TO_DELETE,
            [],
          );
        }
      } else {
        const updateRole = await this.roleRepository.roleDataUpdated(
          { _id: addEditRole.roleId },
          {
            roleName: addEditRole.roleName,
            permission: addEditRole.permission,
            permissionType: addEditRole.permissionType,
          },
        );
        if (updateRole) {
          return sendResponse(
            res,
            StatusCodes.OK,
            RoleEnum.ROLE_UPDATED,
            updateRole,
          );
        } else {
          return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            RoleEnum.FAILED_TO_DELETE,
            [],
          );
        }
      }
    } catch (error) {
      Logger.error.error(
        'role.service --> deleteRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
