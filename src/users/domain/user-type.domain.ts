import { USER_TYPE_ADMIN_INDEX, USER_TYPE_ARTIST_INDEX, USER_TYPE_CLIENT_INDEX, USER_TYPE_SUPER_ADMIN_INDEX } from "src/common/constants/user.constants";
import { PublicUserType } from "../enums/public-user-type.enum";

export function mapPublicUserTypeToId(type: PublicUserType): number {
    switch (type) {
        case PublicUserType.CLIENT:
            return USER_TYPE_CLIENT_INDEX;
        case PublicUserType.ARTIST:
            return USER_TYPE_ARTIST_INDEX;
        default:
            throw new Error('Tipo de usuario no soportado');
    }
}

export function matchUserTypes(userTypeId: number, userTypes: number[]): boolean {
    return userTypes.includes(userTypeId);
}

export function isAdmin(userTypeId: number): boolean {
    switch (userTypeId) {
        case USER_TYPE_SUPER_ADMIN_INDEX:
        case USER_TYPE_ADMIN_INDEX:
            return true;
        default:
            return false;
    }
}