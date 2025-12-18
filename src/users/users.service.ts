import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider, User } from 'generated/prisma/client';
import { isMinor } from 'src/utils/minor-age-validator.util';
import { mapPublicUserTypeToId } from './domain/user-type.domain';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async register(dto: CreateUserDto) {
    const {
      confirm_password,
      password,
      user_type,
      birthday_date,
      ...userData
    } = dto;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...userData,
          user_type_id: mapPublicUserTypeToId(user_type),
          is_minor: birthday_date ? isMinor(new Date(birthday_date)) : false,
        },
      });

      await tx.authIdentity.create({
        data: {
          user_id: user.id,
          password: await bcrypt.hash(password, 10),
          provider: AuthProvider.LOCAL,
          provider_id: userData.email,
        },
      });

      return tx.user.update({
        where: { id: user.id },
        data: {
          created_by: user.id,
          modified_by: user.id,
        },
        select: {
          username: true,
          email: true,
          name: true,
          lastname: true,
          avatar_url: true,
          gender: true,
          is_minor: true,
        },
      });
    });
  }



  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id, active: true},
      select: {
        username: true,
        email: true,
        name: true,
        lastname: true,
        avatar_url: true,
        gender: true,
        is_minor: true,
        birthday_date: true,
        instagram_url: true,
        twitter_url: true,
        facebook_url: true,
        has_membership: true,
        user_type_id: true,
        active: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return await this.prisma.user.update({
      select: {
        username: true,
        email: true,
        name: true,
        lastname: true,
        avatar_url: true,
        gender: true,
        is_minor: true,
        birthday_date: true,
        instagram_url: true,
        twitter_url: true,
        facebook_url: true,
        has_membership: true,
        user_type_id: true,
        active: true,
      },
      where: { id },
      data: {
        active: false
      }
    });
  }
}
