import { isMinor } from "../domain/minor-age-validator.util";
import { mapPublicUserTypeToId } from "../domain/user-type.domain";
import { CreateUserDto } from "../dto/create-user.dto";
import { normalizeEmail } from "../utils/email.util";

export function buildUserBaseData(dto: CreateUserDto) {
    const { birthday_date, email, user_type, ...rest } = dto;
    const birthdayDate = new Date(birthday_date);

    return {
        email: normalizeEmail(email),
        birthday_date: birthdayDate,
        is_minor: isMinor(birthdayDate),
        user_type_id: mapPublicUserTypeToId(user_type),
        ...rest,
    };
}