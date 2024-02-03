import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import Logger from 'src/core/Logger';
import { PermissionService } from '../services/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * get all employee list
   * @return {Promise<Employee[] | []>} all employee list
   */

  @Get('/get-all-permission')
  public async getAllPermission(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('permission.controller --> info of getAllPermission()');
    try {
      const getAllPermissionData =
        await this.permissionService.getAllPermission(req, res);
      return getAllPermissionData;
    } catch (error) {
      Logger.error.error(
        'permission.controller --> getAllPermission() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-single-permission/:permissionId')
  public async permissionGetById(
    @Req() req: Request,
    @Res() res: Response,
    @Param() permissionId: string,
  ): Promise<any> {
    Logger.access.info('permission.controller --> info of permissionGetById()');
    try {
      const permissionGetByIdData =
        await this.permissionService.permissionGetById(req, res, permissionId);
      return permissionGetByIdData;
    } catch (error) {
      Logger.error.error(
        'permission.controller --> permissionGetById() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/delete-permission')
  public async deletePermission(
    @Req() req: Request,
    @Res() res: Response,
    @Body() permissionId: string,
  ): Promise<any> {
    Logger.access.info('permission.controller --> info of deletePermission()');
    try {
      const deleteRoleData = await this.permissionService.deletePermission(
        req,
        res,
        permissionId,
      );
      return deleteRoleData;
    } catch (error) {
      Logger.error.error(
        'permission.controller --> deletePermission() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/permission-add-edit')
  @UsePipes(ValidationPipe)
  public async addEditPermission(
    @Req() req: Request,
    @Res() res: Response,
    @Body() permissionId: string,
    @Body() body: any,
  ): Promise<any> {
    Logger.access.info('permission.controller --> info of addEditPermission()');
    try {
      const addEditPermissionData =
        await this.permissionService.addEditPermission(
          req,
          res,
          permissionId,
          body,
        );
      return addEditPermissionData;
    } catch (error) {
      Logger.error.error(
        'permission.controller --> addEditPermission() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/permission-active-deactive')
  @UsePipes(ValidationPipe)
  public async permissionActiveDeActive(
    @Req() req: Request,
    @Res() res: Response,
    @Body() permissionId: string,
  ): Promise<any> {
    Logger.access.info(
      'permission.controller --> info of permissionActiveDeActive()',
    );
    try {
      const permissionActiveDeActiveData =
        await this.permissionService.permissionActiveDeActive(
          req,
          res,
          permissionId,
        );
      return permissionActiveDeActiveData;
    } catch (error) {
      Logger.error.error(
        'permission.controller --> permissionActiveDeActive() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
