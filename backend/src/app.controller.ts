import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Response as ExpressResponse } from 'express';
import { Express } from 'express';

@Controller('file')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.appService.uploadDatabaseFile(file.buffer, file.originalname);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFileById(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: ExpressResponse,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return await this.appService.updateDatabaseFile(id, file.buffer, file.originalname);
  }



  @Get(':id')
  async getFileById(@Param('id') id: number, @Res() res: ExpressResponse) {
    try {
      const fileData = await this.appService.getFileById(id);
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileData.length,
      });
      res.send(fileData);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }


}