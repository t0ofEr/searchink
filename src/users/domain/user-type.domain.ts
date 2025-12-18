import { USER_TYPE_ARTIST_INDEX, USER_TYPE_CLIENT_INDEX } from "src/common/constants/user.constants";
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
