import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { CategoriesModule } from './categories/categories.module';
import { ProfessionalModule } from './professional/professional.module';
import { SupplierModule } from './supplier/supplier.module';
import { ServicesSearchModule } from './services-search/services-search.module';
import { HeadingModule } from './heading/heading.module';
import { SubHeadingModule } from './sub-heading/sub-heading.module';
import { UserHeadingModule } from './user-heading/user-heading.module';
import jwtConfig from './infrastructure/database/jwt/jwt.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PublicationModule } from './publication/publication.module';
import { ReportPublicationModule } from './report-publication/report-publication.module';
import { ReportReasonModule } from './report-reason/report-reason.module';
import { CreditsDonModule } from './credits-don/credits-don.module';
import { CreditsReasonModule } from './credits-reason/credits-reason.module';
import { KeepAliveService } from './keep-alive.service';
import { ProfessionalRecommendationModule } from './professional_recommendation/professional_recommendation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [jwtConfig],
    }),
    // MailerModule.forRootAsync({
    //   useFactory: () => {        
    //     return {
    //       transport: {
    //         host: process.env.MAILER_HOST,
    //         port: Number(process.env.MAILER_PORT),
    //         secure: process.env.MAILER_SECURE,
    //         auth: {
    //           user: process.env.MAILER_EMAIL,
    //           pass: process.env.MAILER_PASSWORD,
    //         },
    //       },
    //     };
    //   },
    // }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAILER_HOST'),
          port: config.get<number>('MAILER_PORT'),
          secure: config.get<boolean>('MAILER_SECURE'),
          auth: {
            user: config.get<string>('MAILER_EMAIL'),
            pass: config.get<string>('MAILER_PASSWORD'),
          },
        },
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: Number(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   autoLoadEntities: true, 
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, // ⚠️ Desactiva en producción
        extra: {
          keepAlive: true,
          connectTimeout: 10000, // 10 segundos
          connectionLimit: 10,
        },
      }),
    }),
    AuthModule,
    UserModule,
    ExperiencesModule,
    CategoriesModule,
    ProfessionalModule,
    SupplierModule,
    ServicesSearchModule,
    HeadingModule,
    SubHeadingModule,
    UserHeadingModule,
    PublicationModule,
    ReportPublicationModule,
    ReportReasonModule,
    CreditsDonModule,
    CreditsReasonModule,
    ProfessionalRecommendationModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeepAliveService],
})
export class AppModule { }

