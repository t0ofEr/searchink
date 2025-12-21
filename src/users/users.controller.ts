import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthService } from 'src/auth/auth.service';
import { SUCCESS_MESSAGE } from 'src/common/constants/responses-messages.constants';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserTypesGuard } from 'src/auth/guards/user-types.guard';
import { UserTypes } from 'src/auth/decorators/user-types.decorator';
import { USER_TYPE_ADMIN_INDEX, USER_TYPE_SUPER_ADMIN_INDEX } from 'src/common/constants/user.constants';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) { }

  @Post('register')
  async registerLocal(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return {
      data: user,
      token: await this.authService.signJwt(user),
      message: 'Usuario registrado exitosamente',
      statusCode: HttpStatus.CREATED,
      status: SUCCESS_MESSAGE,
    }
  }

  @UserTypes([USER_TYPE_ADMIN_INDEX, USER_TYPE_SUPER_ADMIN_INDEX])
  @UseGuards(AuthGuard, UserTypesGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'Usuario econtrado exitosamente',
      data: user,
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    };
  }

  @UseGuards(AuthGuard, SelfOrAdminGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return { 
      data: this.usersService.update(id, updateUserDto),
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    };
  }

  @UserTypes([USER_TYPE_ADMIN_INDEX, USER_TYPE_SUPER_ADMIN_INDEX])
  @UseGuards(AuthGuard, UserTypesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.remove(id);
    return {
      data: user,
      message: 'Usuario eliminado exitosamente',
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    }
  }
}
