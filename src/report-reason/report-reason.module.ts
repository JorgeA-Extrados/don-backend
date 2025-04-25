import { Module } from '@nestjs/common';
import { ReportReasonService } from './report-reason.service';
import { ReportReasonController } from './report-reason.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportReason } from './entities/report-reason.entity';
import { ReportReasonDao } from 'src/infrastructure/database/dao/reportReason.dao';

@Module({
  imports: [TypeOrmModule.forFeature([ReportReason])],
  controllers: [ReportReasonController],
  providers: [ReportReasonService, ReportReasonDao],
})
export class ReportReasonModule {}
