import { Module } from '@nestjs/common';
import { CreditsDonService } from './credits-don.service';
import { CreditsDonController } from './credits-don.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsDon } from './entities/credits-don.entity';
import { CreditsReason } from 'src/credits-reason/entities/credits-reason.entity';
import { User } from 'src/user/entities/user.entity';
import { CreditsDonDao } from 'src/infrastructure/database/dao/credits_don.dao';

@Module({
  imports: [TypeOrmModule.forFeature([CreditsDon, CreditsReason, User])],
  controllers: [CreditsDonController],
  providers: [CreditsDonService, CreditsDonDao],
})
export class CreditsDonModule { }
