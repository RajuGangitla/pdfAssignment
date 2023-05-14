import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './app.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) { }


  async uploadDatabaseFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.fileRepository.create({
      filename: filename,
      data: dataBuffer
    })
    await this.fileRepository.save(newFile);
    return newFile;
  }

  async getFileById(id: number): Promise<Uint8Array> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new Error(`File with ID ${id} not found`);
    }
    return file.data;
  }

  async updateDatabaseFile(id: number, fileBuffer: Buffer, originalName: string): Promise<Uint8Array> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      console.log('file:', file); // Add this line for debugging
      if (!file) {
        throw new Error(`File with ID ${id} not found`);
      }
      console.log('fileBuffer:', fileBuffer); // Add this line for debugging
      file.data = fileBuffer;
      file.filename = originalName;
      await this.fileRepository.save(file);
      return file.data;
    } catch (error) {
      throw new Error(`Error updating file: ${error.message}`);
    }
  }





}
