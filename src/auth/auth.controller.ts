
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './decorators/user.decorator';
import { Token } from './decorators/token.decorator';
import { CurrentUser } from './interfaces/current-user.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SUCCESS_MESSAGE } from 'src/common/constants/responses-messages.constants';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.loginUser(loginUserDto);
    }

    @Post('register')
    async localRegister(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.localRegister(createUserDto);
        return {
            data: user,
            token: await this.authService.signJwt(user),
            message: 'Usuario registrado exitosamente',
            statusCode: HttpStatus.CREATED,
            status: SUCCESS_MESSAGE,
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('verify')
    verifyToken(@User() user: CurrentUser, @Token() token: string) {
        return { user, token };
    }

    @UseGuards(GoogleAuthGuard)
    @Get("google/login")
    googleLogin() {
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Req() req, @Res() res) {
        const token = await this.authService.signJwt(req.user);

        res.cookie('token', token, {
            httpOnly: true,   
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.redirect(`http://localhost:3000/api/random-something`);
    }
}
