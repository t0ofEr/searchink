export const USER_TYPE_SUPER_ADMIN_NAME = "Super administrador" as const;
export const USER_TYPE_ADMIN_NAME = "Administrador" as const;
export const USER_TYPE_CLIENT_NAME = "Cliente" as const;
export const USER_TYPE_ARTIST_NAME = "Artista" as const;

export const USER_TYPE_SUPER_ADMIN_INDEX = 1 as const;
export const USER_TYPE_ADMIN_INDEX = 2 as const;
export const USER_TYPE_CLIENT_INDEX = 3 as const;
export const USER_TYPE_ARTIST_INDEX = 4 as const;

export const SUPER_ADMIN_INDEX = 1 as const;

export const USER_TYPES: Record<number, string> = {
    [USER_TYPE_SUPER_ADMIN_INDEX]: USER_TYPE_SUPER_ADMIN_NAME,
    [USER_TYPE_ADMIN_INDEX]: USER_TYPE_ADMIN_NAME,
    [USER_TYPE_CLIENT_INDEX]: USER_TYPE_CLIENT_NAME,
    [USER_TYPE_ARTIST_INDEX]: USER_TYPE_ARTIST_NAME,
} as const;