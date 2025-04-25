import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Experience } from './entities/experience.entity';
import { ExperienceDao } from 'src/infrastructure/database/dao/experiences.dao';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, User, Category])],
  controllers: [ExperiencesController],
  providers: [ExperiencesService, ExperienceDao],
})
export class ExperiencesModule { }
