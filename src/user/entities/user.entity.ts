import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ForgotPassword } from "src/auth/entities/forgot-password.entity";
import { ForgotPasswordAttempts } from "src/auth/entities/forgot_password_attempts.entity";
import { RefreshToken } from "src/auth/entities/refresh-token.entity";
import { UserVerificationAttempts } from "src/auth/entities/user_verification_attempts.entity";
import { CreditsDon } from "src/credits-don/entities/credits-don.entity";
import { Experience } from "src/experiences/entities/experience.entity";
import { Professional } from "src/professional/entities/professional.entity";
import { Publication } from "src/publication/entities/publication.entity";
import { ReportPublication } from "src/report-publication/entities/report-publication.entity";
import { ServicesSearch } from "src/services-search/entities/services-search.entity";
import { Supplier } from "src/supplier/entities/supplier.entity";
import { UserHeading } from "src/user-heading/entities/user-heading.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";



@Entity('users')
@Unique('USR_UK', ['usr_email'])
export class User {

    @PrimaryGeneratedColumn({
        name: 'usr_id',
    })
    @IsNumber()
    usr_id: number;

    @Column({
        name: 'usr_email',
    })
    @IsNotEmpty()
    @IsEmail()
    usr_email: string;

    @Column({
        name: 'usr_password',
        nullable: true,
    })
    @IsNotEmpty()
    @IsString()
    usr_password: string;

    @Column({
        name: 'usr_invitationCode',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_invitationCode?: string;

    @Column({
        name: 'usr_name',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_name?: string;

    @Column({
        name: 'usr_role',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_role?: string;

    @Column({
        name: 'usr_phone',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_phone?: string;


    @Column({
        name: 'usr_verified',
        default: false,
    })
    @IsBoolean()
    usr_verified: boolean;

    @Column({
        name: 'usr_verification_code',
        nullable: true
    })
    @IsNumber()
    @IsOptional()
    usr_verification_code?: number;

    @Column({
        name: 'usr_terms',
        default: false,
    })
    @IsBoolean()
    usr_terms: boolean;

    @Column({
        name: 'usr_over',
        default: false,
    })
    @IsBoolean()
    usr_over: boolean;

    @Column({
        name: 'usr_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    usr_create?: Date;

    @Column({
        name: 'usr_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    usr_update?: Date;

    @Column({
        name: 'usr_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    usr_delete?: Date;

    @Column({ name: 'usr_email_original', nullable: true })
    @IsOptional()
    @IsEmail()
    usr_email_original?: string;

    @OneToOne(() => RefreshToken, refresh => refresh.user)
    refreshToken: RefreshToken;

    @OneToOne(() => ServicesSearch, servicesSearch => servicesSearch.user)
    servicesSearch: ServicesSearch;

    @OneToOne(() => Supplier, supplier => supplier.user)
    supplier: Supplier;

    @OneToOne(() => Professional, professional => professional.user)
    professional: Professional;

    @OneToMany(() => Experience, experience => experience.usr_id)
    userExperience: Experience;

    @OneToMany(() => ForgotPassword, forgotPassword => forgotPassword.usrID)
    fop_id: ForgotPassword;

    @OneToMany(() => UserHeading, userHeading => userHeading.user)
    userHeading: UserHeading;

    @OneToMany(() => Publication, publication => publication.user)
    publication: Publication;

    @OneToMany(() => ReportPublication, reportPublication => reportPublication.whoReported)
    reportPublication: ReportPublication;

    @OneToMany(() => CreditsDon, creditsDon => creditsDon.assigningUser)
    creditsDon: CreditsDon;

    @OneToMany(() => UserVerificationAttempts, userVerificationAttempts => userVerificationAttempts.user)
    verificationAttempts: UserVerificationAttempts;

    @OneToMany(() => ForgotPasswordAttempts, forgotPasswordAttempts => forgotPasswordAttempts.user)
    forgotPasswordAttempts: ForgotPasswordAttempts;

}

