import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from 'generated/prisma/client';
import { isMinor } from 'src/utils/minor-age-validator.util';
import { mapPublicUserTypeToId } from './domain/user-type.domain';
import * as bcrypt from 'bcrypt';
import { USER_TYPE_SUPER_ADMIN_INDEX } from 'src/common/constants/user.constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { USER_PUBLIC_SELECT, USER_PUBLIC_SELECT_WITH_ID, USER_SESSION_SELECT } from 'prisma/selects/users/default.select';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { GoogleUserDto } from 'src/auth/dto/google-user.dto';
import { generateUsername } from './utils/username.util';
import { mergeIfEmpty, resolveProfileStatus } from './utils/profile.util';
import { normalizeEmail } from './utils/email.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  private assertNotSameUser(
    actorId: number,
    targetId: number,
    message = 'La acción no es válida sobre el mismo usuario',
  ): void {
    if (actorId === targetId) {
      throw new BadRequestException(message);
    }
  }


  async localRegister(dto: CreateUserDto) {
    const { password, confirm_password, user_type, birthday_date, email, ...rest } = dto;
    const birthdayDate = new Date(birthday_date);
    const normalizedEmail = normalizeEmail(email);

    return this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!existingUser) {
        const user = await tx.user.create({
          data: {
            email: normalizedEmail,
            birthday_date: birthdayDate,
            is_minor: isMinor(birthdayDate),
            user_type_id: mapPublicUserTypeToId(user_type),
            ...rest,
          },
        });

        await tx.authIdentity.create({
          data: {
            user_id: user.id,
            provider: AuthProvider.LOCAL,
            provider_id: normalizedEmail,
            password: await bcrypt.hash(password, 10),
          },
        });

        return tx.user.update({
          where: { id: user.id },
          data: {
            profile_status: resolveProfileStatus(user),
            created_by: user.id,
            modified_by: user.id,
          },
          select: USER_PUBLIC_SELECT_WITH_ID,
        });
      }

      await tx.authIdentity.create({
        data: {
          user_id: existingUser.id,
          provider: AuthProvider.LOCAL,
          provider_id: normalizedEmail,
          password: await bcrypt.hash(password, 10),
        },
      });

      const updateData = mergeIfEmpty(existingUser, {
        birthday_date: birthdayDate,
        is_minor: isMinor(birthdayDate),
        user_type_id: mapPublicUserTypeToId(user_type),
        ...rest
      });

      const updatedUser = await tx.user.update({
        where: { id: existingUser.id },
        data: updateData,
      });

      return tx.user.update({
        where: { id: updatedUser.id },
        data: {
          profile_status: resolveProfileStatus(updatedUser),
        },
        select: USER_PUBLIC_SELECT_WITH_ID,
      });
    });
  }


  async googleRegister(googleUserDto: GoogleUserDto) {
    const { sub, email, ...userData } = googleUserDto;
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizeEmail(email),
          ...userData,
          username: await generateUsername(userData.firstname, tx),
        },
      });

      await tx.authIdentity.create({
        data: {
          user_id: user.id,
          provider: AuthProvider.GOOGLE,
          provider_id: sub,
        },
      });

      return await tx.user.update({
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
    const user = await this.prisma.user.findFirst({
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

  async getUserByEmail(email: string, requiredUser = true) {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      select: USER_PUBLIC_SELECT_WITH_ID,
    });

    if (!user && requiredUser) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    return user;
  }

  async getUserAuthIdentity(provider: AuthProvider, provider_id: string) {
    const userAuth = await this.prisma.authIdentity.findUnique({
      where: {
        provider_provider_id: {
          provider,
          provider_id,
        },
      },
      select: {
        provider: true,
        provider_id: true,
        password: true,
        user_id: true,
        user: {
          select: USER_PUBLIC_SELECT_WITH_ID
        }
      },
    });
    return userAuth;
  }

  async linkAuthIdentity(userId: number, provider: AuthProvider, providerId: string) {
    return this.prisma.authIdentity.create({
      data: {
        user_id: userId,
        provider: provider,
        provider_id: providerId,
      },
    });
  }

  async assertUsersActive(ids: number[]): Promise<void> {
    const count = await this.prisma.user.count({
      where: {
        id: { in: ids },
        active: true,
        user_type_id: {
          not: USER_TYPE_SUPER_ADMIN_INDEX,
        }
      },
    });

    if (count !== ids.length) {
      throw new NotFoundException('Uno o más usuarios no existen o están inactivos');
    }
  }

  async followUser(followUserDto: FollowUserDto) {

    const { follower_id, followed_id } = followUserDto;

    this.assertNotSameUser(
      follower_id,
      followed_id,
      'No puedes seguirte a ti mismo',
    );

    await this.assertUsersActive([follower_id, followed_id]);

    return this.prisma.userFollow.upsert({
      where: {
        follower_id_followed_id: {
          follower_id,
          followed_id
        }
      },
      update: {
        active: true,
      },
      create: {
        follower_id,
        followed_id,
        active: true,
      },
    });
  }

  async unfollowUser(unfollowUserDto: UnfollowUserDto) {
    return this.prisma.userFollow.update({
      where: {
        follower_id_followed_id: unfollowUserDto,
      },
      data: {
        active: false,
      }
    })
  }

  async findOneForSession(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, active: true },
      select: USER_SESSION_SELECT,
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    return user;
  }
}
