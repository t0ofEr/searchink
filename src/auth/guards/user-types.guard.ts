
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTypes } from '../decorators/user-types.decorator';
import { matchUserTypes } from 'src/users/domain/user-type.domain';


@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const userTypes = this.reflector.get(UserTypes, context.getHandler());
    if (!userTypes) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!matchUserTypes(user.user_type_id, userTypes)) {
      throw new ForbiddenException({
        message: "Acceso denegado",
        description: "Usuario no posee los permisos necesarios"
      })
    }
    return true;
  }
}
