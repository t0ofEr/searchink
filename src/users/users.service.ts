import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from 'generated/prisma/client';
import { isMinor } from 'src/utils/minor-age-validator.util';
import { mapPublicUserTypeToId } from './domain/user-type.domain';
import * as bcrypt from 'bcrypt';
import { USER_TYPE_SUPER_ADMIN_INDEX } from 'src/common/constants/user.constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { USER_PUBLIC_SELECT, USER_PUBLIC_SELECT_WITH_ID } from 'prisma/selects/users/default.select';

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
        select: USER_PUBLIC_SELECT_WITH_ID
      });
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const totalUsers = await this.prisma.user.count({ where: { active: true, user_type_id: { not: USER_TYPE_SUPER_ADMIN_INDEX } } });
    const lastPage = Math.ceil(totalUsers / limit);
    return {
      data: await this.prisma.user.findMany({
        skip,
        take: limit,
        where: {
          active: true,
          user_type_id: {
            not: USER_TYPE_SUPER_ADMIN_INDEX
          }
        },
        select: USER_PUBLIC_SELECT,
      }),
      meta: {
        total: totalUsers,
        page: page,
        lastpage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        active: true,
        user_type_id: {
          not: USER_TYPE_SUPER_ADMIN_INDEX,
        },
      },
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
      select: USER_PUBLIC_SELECT
    });

    return updatedUser;
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.user.update({
      select: USER_PUBLIC_SELECT,
      where: { id },
      data: {
        active: false
      }
    });
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: USER_PUBLIC_SELECT_WITH_ID,
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    const userAuth = await this.prisma.authIdentity.findUnique({
      where: {
        provider_provider_id: {
          provider: AuthProvider.LOCAL,
          provider_id: user.email,
        },
      }
    });

    return {
      ...user, 
      password: userAuth?.password
    }
  }
}
