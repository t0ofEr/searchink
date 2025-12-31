import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SUCCESS_MESSAGE } from 'src/common/constants/responses-messages.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/guards/user-types.guard';
import { UserTypes } from 'src/auth/decorators/user-types.decorator';
import { USER_TYPE_ADMIN_INDEX, USER_TYPE_SUPER_ADMIN_INDEX } from 'src/common/constants/user.constants';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }
  
  @UserTypes([USER_TYPE_ADMIN_INDEX, USER_TYPE_SUPER_ADMIN_INDEX])
  @UseGuards(JwtAuthGuard, UserTypesGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'Usuario encontrado exitosamente',
      data: user,
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    };
  }

  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return { 
      data: await this.usersService.update(id, updateUserDto),
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    };
  }

  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('/follow/:id')
  async followUser(@Param('id', ParseIntPipe) followedId: number, @Request() req) {
    return {
      data: await this.usersService.followUser({
        followed_id: followedId,
        follower_id: req.user.id,
      }),
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/unfollow/:id')
  async unfollowUser(@Param('id', ParseIntPipe) followedId: number, @Request() req) {
    return {
      data: await this.usersService.unfollowUser({
        followed_id: followedId,
        follower_id: req.user.id,
      }),
      statusCode: HttpStatus.OK,
      status: SUCCESS_MESSAGE,
    }
  }
}
