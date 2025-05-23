import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class KeepAliveService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    setInterval(async () => {
      try {
        await this.dataSource.query('SELECT 1');
      } catch (e) {
        console.error('DB keep-alive failed:', e);
      }
    }, 5 * 60 * 1000); // cada 5 minutos
  }
}