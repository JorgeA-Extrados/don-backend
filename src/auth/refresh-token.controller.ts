// refresh-token.controller.ts
import { Controller, Post, Body, BadRequestException, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';



@Controller('refresh-tokens')
export class RefreshTokenController {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  @Post()
  async createNewTokens(@Body('refreshToken') refreshToken: string): Promise<any> {

    try {
      const foundRefreshToken = await this.refreshTokenService.findRefreshToken(refreshToken);

      if (!foundRefreshToken) {
        throw new UnauthorizedException('Token not valid')
      }
      const { user } = foundRefreshToken
      const { usr_email, ...userDatails } = user

      const payload = { userId: userDatails.usr_id, email: usr_email };

      // Generar nuevos tokens
      const tokens = await this.refreshTokenService.getTokens(payload)
      const { accessToken, refreshToken: newRefreshToken } = tokens;

      await this.refreshTokenService.deleteRefreshToken(refreshToken);
      await this.refreshTokenService.createRefreshToken(newRefreshToken, foundRefreshToken.user.usr_id);

      return { accessToken, newRefreshToken };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }
}
