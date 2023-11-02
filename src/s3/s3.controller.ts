import { Controller, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { S3Service } from "./s3.service";

@Controller('s3')
export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const fileName = file.originalname.split('.');
    const newName = `${Date.now().toString()}_${req.cookies.uid}. ${fileName[fileName.length-1]}`;

    try {
      return await this.s3Service.uploadImage(file, newName);
    } catch(error) {
      throw new HttpException('Image Upload Fail', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
