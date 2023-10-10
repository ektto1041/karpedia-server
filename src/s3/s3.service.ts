import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  s3Client = new S3();
  bucketName = 'karpedia';

  async uploadImage(file: Express.Multer.File, newName: string): Promise<string> {
    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: newName,
      Body: file.buffer,
    };

    const result = await this.s3Client.upload(params).promise();

    return result.Location;
  }
}
