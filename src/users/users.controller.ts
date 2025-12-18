import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseFilters, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'generated/prisma/client';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  registerLocal(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.register(createUserDto);
    return {
      data: user,
      message: 'Usuario registrado exitosamente',
      status: HttpStatus.CREATED,
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario econtrado exitosamente',
      data: user,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.remove(id); 
    return {
      data: user,
      message: 'Usuario eliminado exitosamente',
      status: HttpStatus.OK,
    }
  }
}
