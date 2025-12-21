
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { Token } from './decorators/token.decorator';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.loginUser(loginUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('verify')
    verifyToken(@User() user: CurrentUser, @Token() token: string) {
        return { user, token };
    }
}
