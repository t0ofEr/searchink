import { USER_TYPE_SUPER_ADMIN_INDEX, SUPER_ADMIN_INDEX, USER_TYPE_SUPER_ADMIN_NAME } from "src/common/constants/user.constants";
import { AuthProvider, GenderEnum, PrismaClient } from "../../generated/prisma/client";
import * as bcrypt from 'bcrypt';
import { envs } from "src/config/envs";

const prisma = new PrismaClient();

export async function seedUsers() {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(envs.superAdminPass, saltOrRounds);
    const email = envs.superAdmimEmail;
    const birthdayDate = new Date("1997-11-28");

    console.log("Adding Super Administrator...");
    const superAdmin = await prisma.user.upsert({
        where: { id: USER_TYPE_SUPER_ADMIN_INDEX },
        update: {
            username: USER_TYPE_SUPER_ADMIN_NAME,
            email: email,
            user_type_id: USER_TYPE_SUPER_ADMIN_INDEX,
            birthday_date: birthdayDate,
            created_by: SUPER_ADMIN_INDEX,
            modified_by: SUPER_ADMIN_INDEX,
            is_minor: false,
            gender: GenderEnum.MALE,
        },
        create: {
            id: Number(USER_TYPE_SUPER_ADMIN_INDEX),
            username: USER_TYPE_SUPER_ADMIN_NAME,
            email: email,
            user_type_id: USER_TYPE_SUPER_ADMIN_INDEX,
            birthday_date: birthdayDate,
            created_by: SUPER_ADMIN_INDEX,
            modified_by: SUPER_ADMIN_INDEX,
            is_minor: false,
            gender: GenderEnum.MALE
        },
    });

    await prisma.authIdentity.upsert({
        where: {
            provider_provider_id: {
                provider: AuthProvider.LOCAL,
                provider_id: email,
            },
        },
        update: {
            password: hashedPassword,
            user_id: superAdmin.id,
            provider_id: email,
        },
        create: {
            provider: AuthProvider.LOCAL,
            provider_id: email,
            password: hashedPassword,
            user_id: superAdmin.id,
        },
    });

    console.log("Super Administrator added.");
};

