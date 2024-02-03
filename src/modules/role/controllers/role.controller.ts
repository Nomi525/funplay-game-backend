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
import { RoleService } from '../services/role.service';
import Logger from 'src/core/Logger';
import { AddEditRoleRequestDto } from '../dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * get all employee list
   * @return {Promise<Employee[] | []>} all employee list
   */

  @Get('/get-roles')
  public async getListRole(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.access.info('role.controller --> info of getListRole()');
    try {
      const getListRoleData = await this.roleService.getListRole(req, res);
      return getListRoleData;
    } catch (error) {
      Logger.error.error(
        'role.controller --> getListRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Get('/get-single-role/:roleId')
  public async getRole(
    @Req() req: Request,
    @Res() res: Response,
    @Param() roleId: string,
  ): Promise<any> {
    Logger.access.info('role.controller --> info of getRole()');
    try {
      const getRoleData = await this.roleService.getRole(req, res, roleId);
      return getRoleData;
    } catch (error) {
      Logger.error.error(
        'role.controller --> getRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/delete-role')
  public async deleteRole(
    @Req() req: Request,
    @Res() res: Response,
    @Body() roleId: string,
  ): Promise<any> {
    Logger.access.info('role.controller --> info of deleteRole()');
    try {
      const deleteRoleData = await this.roleService.deleteRole(
        req,
        res,
        roleId,
      );
      return deleteRoleData;
    } catch (error) {
      Logger.error.error(
        'role.controller --> deleteRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }

  @Post('/role-add-edit')
  @UsePipes(ValidationPipe)
  public async addEditRole(
    @Req() req: Request,
    @Res() res: Response,
    @Body() addEditRole: AddEditRoleRequestDto,
  ): Promise<any> {
    Logger.access.info('role.controller --> info of addEditRole()');
    try {
      const addEditRoleData = await this.roleService.addEditRole(
        req,
        res,
        addEditRole,
      );
      return addEditRoleData;
    } catch (error) {
      Logger.error.error(
        'role.controller --> addEditRole() indicates error',
        error.message,
      );
      throw new BadRequestException(error.message);
    }
  }
}
