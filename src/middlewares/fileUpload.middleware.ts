import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import * as multer from 'multer';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private storage: multer.StorageEngine;

  constructor() {
    if (typeof multer.diskStorage !== 'undefined') {
      this.storage = multer.diskStorage({
        destination: function (req: any, file: any, callback: any) {
          const path = 'public/uploads/';
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }
          callback(null, path);
        },
        filename: function (req, file, callback) {
          const ext = file.originalname.split('.');
          callback(
            null,
            Date.now() +
              (Math.random() + 1).toString(36).substring(7) +
              '.' +
              ext[ext.length - 1],
          );
        },
      });
    } else {
      throw new Error(
        'multer.diskStorage is not defined. Make sure multer is correctly imported and installed.',
      );
    }
  }

  use(req: any, res: Response, next: NextFunction) {
    if (typeof this.storage !== 'undefined') {
      const upload = multer({ storage: this.storage }).fields([
        { name: 'profile', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'gameImage', maxCount: 1 },
        { name: 'queryDocument', maxCount: 1 },
        { name: 'bannerImage', maxCount: Infinity },
        { name: 'communityBettingImage', maxCount: 1 },
      ]);

      upload(req, res, (err: any) => {
        if (err) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: err.message,
            data: [],
          });
        } else {
          if (req.files) {
            req.profileUrl = req.files.profile
              ? req.files.profile[0].filename
              : '';
            req.imageUrl = req.files.image ? req.files.image[0].filename : '';
            req.gameImageUrl = req.files.gameImage
              ? req.files.gameImage[0].filename
              : '';
            req.queryDocumentUrl = req.files.queryDocument
              ? req.files.queryDocument[0].filename
              : '';
            req.bannerImageUrl = req.files.bannerImage
              ? req.files.bannerImage.map((file: any) => file.filename)
              : [];
            req.communityBettingImageUrl = req.files.communityBettingImage
              ? req.files.communityBettingImage[0].filename
              : '';
          }
          next();
        }
      });
    } else {
      throw new Error('Storage engine is not defined.');
    }
  }
}
