import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import AuthMiddlewareEnum from 'src/constants/auth.middlewareEnum';
import { configService } from 'src/database/configurations/database.config';
import { User } from '../modules/user/entities/user.entity';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  JwtSecretKey = String(configService.getJwtSecretKey());

  async use(req: Request | any, res: Response, next: NextFunction) {
    console.log('Auth Middleware Called');

    const token = req.header('auth');
    if (!token) {
      return this.sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        AuthMiddlewareEnum.TOKEN_NOT_AUTHORIZED,
        [],
      );
    }
    try {
      const decode: any = jwt.verify(token, this.JwtSecretKey);
      if (decode.user) {
        const findUser = await this.userModel.findOne({
          _id: decode.user.id,
          isActive: false,
        });

        if (findUser) {
          return res.status(401).json({
            status: StatusCodes.UNAUTHORIZED,
            message: AuthMiddlewareEnum.USER_DISABLE_BY_ADMIN,
            data: [],
          });
        } else {
          const validUser = await this.userModel.findOne({
            _id: decode.user.id,
            is_deleted: 0,
            isActive: true,
          });

          if (validUser) {
            req.user = decode.user.id;
          } else {
            return res.status(401).json({
              status: StatusCodes.UNAUTHORIZED,
              message: AuthMiddlewareEnum.TOKEN_NOT_AUTHORIZED,
              data: [],
            });
          }
        }
      } else if (decode.admin) {
        req.admin = decode.admin.id;
      } else {
        throw new Error(AuthMiddlewareEnum.TOKEN_NOT_VALID_AUTHORIZED);
      }

      next();
    } catch (error) {
      return this.sendResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        AuthMiddlewareEnum.TOKEN_NOT_VALID_AUTHORIZED,
        [],
      );
    }
  }

  private sendResponse(
    res: Response,
    status: number,
    message: string,
    data: any[],
  ) {
    return res.status(status).json({
      status,
      message,
      data,
    });
  }
}
