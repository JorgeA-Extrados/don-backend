import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.jwt_secret'),
    });
  }

  async validate(payload: any) {
    const { userId, email } = payload
    const user = await this.userRepository.findOne({ where: { usr_id: userId } })
    if (!user) {
      throw new UnauthorizedException('Token not valid')
    }
    const { usr_id, usr_email, usr_role } = user

    return { userId: usr_id, email: usr_email, rol: usr_role };
  }
}
