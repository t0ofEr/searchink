
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config/envs';
import { SUCCESS_MESSAGE } from 'src/common/constants/responses-messages.constants';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signJwt(payload: JwtPayload) {
        return this.jwtService.signAsync(payload);
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        try {
            const user = await this.usersService.getUserByEmail(email);

            const isPasswordMatch = await bcrypt.compareSync(password, user?.password);

            if (!isPasswordMatch) {
                throw new UnauthorizedException({
                    message: 'Acceso denegado',
                    description: 'Credenciales no válidas',
                });
            }

            const { password: __, ...rest } = user;

            return {
                user: user,
                token: await this.signJwt(rest),
                statusCode: HttpStatus.OK,
                message: SUCCESS_MESSAGE,
            };
        } catch (error) {
            throw error;
        }
    }

    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...user } = this.jwtService.verify(token,
                {
                    secret: envs.jwtSecret,
                }
            );
            return {
                user,
                token: await this.signJwt(user),
                statusCode: HttpStatus.OK,
                message: SUCCESS_MESSAGE,
            }
        } catch {
            throw new UnauthorizedException({
                message: 'Acceso denegado',
                description: 'Token inválido',
            });
        }
    }
}
