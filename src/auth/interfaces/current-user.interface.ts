export interface CurrentUser {
    id: number;
    username: string;
    email: string;
    user_type_id: number;
    roles: string[]; // Importante: los roles que calculamos antes
    active: boolean;
}