import { Module } from '@nestjs/common';
import { CreditsReasonService } from './credits-reason.service';
import { CreditsReasonController } from './credits-reason.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsReason } from './entities/credits-reason.entity';
import { CreditsReasonDao } from 'src/infrastructure/database/dao/credits_reason.dao';

@Module({
  imports: [TypeOrmModule.forFeature([CreditsReason])],
  controllers: [CreditsReasonController],
  providers: [CreditsReasonService, CreditsReasonDao],
})
export class CreditsReasonModule { }
