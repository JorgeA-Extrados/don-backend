// refresh-token.service.ts
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/user/entities/user.entity';



@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async createRefreshToken(refreshToken: string, userId: number): Promise<any> {
        try {
            // Buscar si ya existe un refresh token para este usuario
            const existingRefreshToken = await this.refreshTokenRepository.findOne({
                where: { user: { usr_id: userId } }
            });
    
            if (existingRefreshToken) {
                // Si existe, lo eliminamos
                await this.refreshTokenRepository.delete(existingRefreshToken.id);
            }
    
            // Creamos un nuevo refresh token
            const newRefreshToken = this.refreshTokenRepository.create({
                rft_token: refreshToken,
                user: this.userRepository.create({ usr_id: userId })
            });
            return await this.refreshTokenRepository.save(newRefreshToken, { reload: true });
        } catch (error) {
            console.log(error);
            throw error; // Asegúrate de lanzar el error para que pueda ser manejado en el nivel superior
        }
    }


    async getTokens(payloady: {}) {
        // Configuración base para el token de acceso
        const accessToken = await this.jwtService.signAsync(payloady, {
            secret: this.configService.get('jwt.jwt_secret'),
            expiresIn: '3m',
        });

        // Determinación del tiempo de expiración para el refresh token
        let refreshExpiresIn = '7d'; // Valor predeterminado


        // Generación del token de refresco
        const refreshToken = await this.jwtService.signAsync(payloady, {
            secret: this.configService.get('jwt.jwt_refresh_secret'),
            expiresIn: refreshExpiresIn,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async findRefreshToken(refreshToken: string): Promise<any> {
        return await this.refreshTokenRepository.findOne({
            where: { rft_token: refreshToken },
            relations: {
                user: true,
            },
        });
    }

    async findRefreshTokenbyUser(usrId: number): Promise<any> {
        const token = await this.refreshTokenRepository.createQueryBuilder("refresh_token")
            .where("refresh_token.usr_id = :usrId", { usrId })
            .getOne()

        return token
    }

    async deleteRefreshToken(refreshToken: string): Promise<void> {
        try {
            const refresh = await this.refreshTokenRepository.findOne({
                where: {
                rft_token: refreshToken
                }
            })
            
            await this.refreshTokenRepository.delete({ id: refresh?.id });
        } catch (error) {
            throw new BadRequestException('No se pudo eliminar el refresh token');
        }
    }
}
