
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config/envs';
import { SUCCESS_MESSAGE } from 'src/common/constants/responses-messages.constants';
import { GoogleUserDto } from './dto/google-user.dto';
import { AuthProvider } from 'generated/prisma/enums';
import { normalizeEmail } from 'src/users/utils/email.util';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signJwt(payload: JwtPayload) {
        const { email, username, id } = payload;
        return this.jwtService.signAsync({
            sub: id,
            email,
            username,
        });
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        try {
            const user = await this.validateUser(normalizeEmail(email), password);

            return {
                user: user,
                token: await this.signJwt(user),
                statusCode: HttpStatus.OK,
                message: SUCCESS_MESSAGE,
            };
        } catch (error) {
            throw error;
        }
    }

    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...user } = this.jwtService.verify(token);
            return {
                user,
                token: await this.signJwt(user),
                statusCode: HttpStatus.OK,
                message: SUCCESS_MESSAGE,
            }
        } catch {
            throw new UnauthorizedException({
                message: 'Acceso denegado',
                description: 'Token inválido o expirado',
            });
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);
        const userAuthIdentity = await this.usersService.getUserAuthIdentity(AuthProvider.LOCAL, normalizeEmail(email));

        if (!userAuthIdentity || !userAuthIdentity.password) {
            throw new UnauthorizedException({
                message: 'Acceso denegado',
                description: 'Credenciales no válidas',
            });
        }
        const isPasswordMatch = await bcrypt.compareSync(password, userAuthIdentity.password);

        if (!isPasswordMatch) {
            throw new UnauthorizedException({
                message: 'Acceso denegado',
                description: 'Contraseña no coincide',
            });
        }
        return user;
    }

    async findOneUserForSession(id: number) {
        return await this.usersService.findOneForSession(id);
    }

    async validateGoogleUser(googleUserDto: GoogleUserDto) {
        const { sub, email } = googleUserDto;
        const googleIdentity = await this.usersService.getUserAuthIdentity(
            AuthProvider.GOOGLE,
            sub,
        );

        if (googleIdentity) {
            return googleIdentity.user;
        }

        const existingUser = await this.usersService.getUserByEmail(email, false);

        if (existingUser) {
            await this.usersService.linkAuthIdentity(existingUser.id, AuthProvider.GOOGLE, sub);
            return existingUser;
        }

        return this.usersService.googleRegister(googleUserDto);
    }
}
