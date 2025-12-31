import { ProfileStatus, User } from "generated/prisma/browser";

export function isProfileComplete(user: User): boolean {
    return Boolean(
        user.email &&
        user.username &&
        user.birthday_date &&
        user.is_minor !== null &&
        user.gender &&
        user.user_type_id
    );
}

export function resolveProfileStatus(user: User): ProfileStatus {
    return isProfileComplete(user) ? ProfileStatus.COMPLETE : ProfileStatus.INCOMPLETE;
}

export function mergeIfEmpty<T extends object>(
    current: T,
    incoming: Partial<T>,
): Partial<T> {
    const result: Partial<T> = {};

    for (const key in incoming) {
        if (
            current[key] === null ||
            current[key] === undefined
        ) {
            result[key] = incoming[key];
        }
    }

    return result;
}