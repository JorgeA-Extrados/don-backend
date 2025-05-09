import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard'; // Ajusta la ruta si es necesario

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // Para acceder a los metadatos
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()); // Obtener los roles de los metadatos

    if (!roles) {
      return true; // Si no hay roles, no se aplica restricción de rol
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // El usuario debe haber sido inyectado por el JwtAuthGuard

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasRole = roles.some((role) => user.rol === role); // Verificar si el usuario tiene uno de los roles requeridos

    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true; // El usuario tiene el rol adecuado
  }
}

