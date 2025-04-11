import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private dataSource: DataSource
    ,private readonly appService: AppService
  ) {}

  @Get('app-health')
  async checkDatabaseHealth(): Promise<string> {
    try {
      await this.dataSource.query('SELECT 1');
      const version = process.env.BACKEND_VERSION
      if (version) {
        return `Database connection is healthy!. Version: ${version}`;        
      } else {
        return 'Database connection failed!. Version not found ';
      }
    } catch (error) {
      return 'Database connection failed!';
    }
  }
}
