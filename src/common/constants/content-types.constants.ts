export const CONTENT_TYPE_COMMENTS_NAME = "Comentarios" as const;
export const CONTENT_TYPE_NEWS_NAME = "Noticias" as const;
export const CONTENT_TYPE_USERS_NAME = "Usuarios" as const;
export const CONTENT_TYPE_PROJECTS_NAME = "Proyectos" as const;

export const CONTENT_TYPE_COMMENTS_INDEX = 1 as const;
export const CONTENT_TYPE_NEWS_INDEX = 2 as const;
export const CONTENT_TYPE_USERS_INDEX = 3 as const;
export const CONTENT_TYPE_PROJECTS_INDEX = 4 as const;

export const CONTENT_TYPES: Record<number, string> = {
    [CONTENT_TYPE_COMMENTS_INDEX]: CONTENT_TYPE_COMMENTS_NAME,
    [CONTENT_TYPE_NEWS_INDEX]: CONTENT_TYPE_NEWS_NAME,
    [CONTENT_TYPE_USERS_INDEX]: CONTENT_TYPE_USERS_NAME,
    [CONTENT_TYPE_PROJECTS_INDEX]: CONTENT_TYPE_PROJECTS_NAME,
} as const;