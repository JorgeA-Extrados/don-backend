import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para asignar roles a las rutas.
 * @param roles Lista de roles permitidos.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

