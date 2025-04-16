import { Module } from '@nestjs/common';
import { CreditsDonService } from './credits-don.service';
import { CreditsDonController } from './credits-don.controller';

@Module({
  controllers: [CreditsDonController],
  providers: [CreditsDonService],
})
export class CreditsDonModule {}
