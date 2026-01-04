import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from 'generated/prisma/client';
import { USER_TYPE_SUPER_ADMIN_INDEX } from 'src/common/constants/user.constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { USER_PUBLIC_SELECT, USER_PUBLIC_SELECT_WITH_ID, USER_SESSION_SELECT } from 'prisma/selects/users/default.select';
import { FollowUserDto } from './dto/follow-user.dto';
import { UnfollowUserDto } from './dto/unfollow-user.dto';
import { GoogleUserDto } from 'src/auth/dto/google-user.dto';
import { generateUsername } from './utils/username.util';
import { resolveProfileStatus } from './domain/profile.domain';
import { normalizeEmail } from './utils/email.util';
import { Prisma } from 'generated/prisma/browser';
import { buildUserBaseData } from './helpers/data.helper';
import { assertNotSameUser } from './helpers/validators.helper';
import { AuthIdentityService } from 'src/auth-identity/auth-identity.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authIdentityService: AuthIdentityService,
  ) { }
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

  private async createNewLocalUser(
    tx: Prisma.TransactionClient,
    userData: any,
    password: string,
  ) {
    const user = await tx.user.create({
      data: userData,
    });

    await this.authIdentityService.createAuthIdentity(user.id, user.email, AuthProvider.LOCAL, password, tx);

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

  async localRegister(dto: CreateUserDto) {
    const normalizedEmail = normalizeEmail(dto.email);
    const baseUserData = buildUserBaseData(dto);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: normalizedEmail },
        include: { authIdentities: true },
      });

      if (!user) {
        return this.createNewLocalUser(tx, baseUserData, dto.password);
      }

      const { password, confirm_password, ...restData } = baseUserData;

      return this.authIdentityService.attachLocalIdentityToExistingUser(
        tx,
        user,
        restData,
        password,
      );
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
      
      await this.authIdentityService.createAuthIdentity(user.id, sub, AuthProvider.GOOGLE, undefined, tx);

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
    
    if(updateUserDto.email) {
      updateUserDto.email = normalizeEmail(updateUserDto.email);
    }
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

  async followUser(followUserDto: FollowUserDto) {

    const { follower_id, followed_id } = followUserDto;

    assertNotSameUser(follower_id, followed_id, 'No puedes seguirte a ti mismo');

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
