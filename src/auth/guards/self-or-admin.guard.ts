
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isAdmin, matchUserTypes } from 'src/users/domain/user-type.domain';


@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const paramId = Number(request.params.id);

        if(user.id !== paramId && !isAdmin(user.user_type_id)) {
            throw new ForbiddenException({
                message: "Accesso denegado",
                description: "Usuario no posee los permisos necesarios"
            })
        }

        return true;
    }
}
