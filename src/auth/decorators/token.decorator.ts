import { createParamDecorator, ExecutionContext, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header no encontrado');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Formato de token inválido');
        }

        return token;
    }
);