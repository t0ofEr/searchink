import { Prisma } from '../../../generated/prisma/client';

export const USER_PUBLIC_SELECT = {
    username: true,
    firstname: true,
    lastname: true,
    email: true,
    phone_number: true,
    birthday_date: true,
    is_minor: true,
    avatar_url: true,
    gender: true,
    instagram_url: true,
    facebook_url: true,
    twitter_url: true,
    has_membership: true,
    user_type_id: true,
    active: true,
} satisfies Prisma.UserSelect;

export const USER_PUBLIC_SELECT_WITH_ID = {
    id: true,
    ...USER_PUBLIC_SELECT
} satisfies Prisma.UserSelect;

export const USER_SESSION_SELECT = {
    id: true,
    username: true,
    email: true,
    roles: true,
    user_type_id: true,
    active: true,
    has_membership: true,
    profile_status: true,
} satisfies Prisma.UserSelect;