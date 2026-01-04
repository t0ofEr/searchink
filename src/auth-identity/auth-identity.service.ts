import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthProvider, Prisma } from 'generated/prisma/browser';
import { USER_PUBLIC_SELECT_WITH_ID } from 'prisma/selects/users/default.select';
import { mergeIfEmpty, resolveProfileStatus } from 'src/users/domain/profile.domain';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthIdentityService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getAuthIdentity(provider: AuthProvider, provider_id: string) {
        const AuthIdentity = await this.prisma.authIdentity.findUnique({
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
        return AuthIdentity;
    }

    async createAuthIdentity(
        userId: number,
        provider_id: string,
        provider: AuthProvider,
        password?: string,
        tx?: Prisma.TransactionClient,
    ) {
        const client = tx ? tx.authIdentity : this.prisma.authIdentity;
        const data: Prisma.AuthIdentityCreateInput = {
            provider: provider,
            provider_id: provider_id,
            user: {
                connect: { id: userId }
            }
        };

        if (provider === AuthProvider.LOCAL && password) {
            data.password = await bcrypt.hash(password, 10);
        }

        return client.create({
            data,
        });
    }

    async attachLocalIdentityToExistingUser(
        tx: Prisma.TransactionClient,
        user: any,
        userData: any,
        password: string,
    ) {
        const hasLocalIdentity = user.authIdentities.some(
            (i) => i.provider === AuthProvider.LOCAL,
        );

        if (hasLocalIdentity) {
            throw new BadRequestException('Usuario ya registrado con credenciales locales');
        }

        await this.createAuthIdentity(user.id, user.email, AuthProvider.LOCAL, password, tx);

        const updateData = mergeIfEmpty(user, userData);
        const { user_type_id, ...rest } = updateData;

        const dataToUpdate: Prisma.UserUpdateInput = { ...rest };

        if (user_type_id) {
            dataToUpdate.userType = {
                connect: { id: user_type_id },
            };
        }

        const updatedUser = await tx.user.update({
            where: { id: user.id },
            data: dataToUpdate,
        });

        return tx.user.update({
            where: { id: user.id },
            data: {
                profile_status: resolveProfileStatus(updatedUser),
            },
            select: USER_PUBLIC_SELECT_WITH_ID,
        });
    }
}
