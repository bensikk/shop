import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/'),
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unique + extname(file.originalname))
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  upload(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Файл не загружен')
    return { url: `/uploads/${file.filename}` }
  }
}


