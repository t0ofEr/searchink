import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsDateString,
    IsEnum,
    IsUrl,
} from 'class-validator';
import { GenderEnum } from 'generated/prisma/enums';
import { PublicUserType } from '../enums/public-user-type.enum';
import { IsEqualTo } from '../validators/is-equal-to.validator';


export class CreateUserDto {
    @IsString({ message: 'El nombre de usuario debe ser texto' })
    @IsNotEmpty({ message: 'Nombre de usuario es obligatorio' })
    @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El nombre de usuario no debe exceder los 30 caracteres' })
    username: string;

    @IsOptional()
    @IsString({ message: 'El nombre debe ser texto' })
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString({ message: 'El apellido debe ser texto' })
    @MaxLength(100)
    lastname?: string;

    @IsEmail({}, { message: 'Debe ingresar un correo válido' })
    @MaxLength(150, { message: 'El correo no debe exceder los 150 caracteres' })
    email: string;

    @IsString({ message: 'La contraseña debe ser texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(64, { message: 'La contraseña no debe exceder los 64 caracteres' })
    password: string;

    @IsString({ message: 'Confirmación de contraseña debe ser texto' })
    @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria' })
    @IsEqualTo('password', {
        message: 'Las contraseñas no coinciden',
    })
    confirm_password: string;

    @IsOptional()
    @Matches(/^\+?[0-9]{8,15}$/, {
        message: 'Debe ingresar un numero de telefono valido',
    })
    phone_number?: string;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de nacimiento debe ser válida' })
    birthday_date?: string;

    @IsEnum(GenderEnum, {
        message: 'El género seleccionado no es válido',
    })
    gender: GenderEnum;

    @IsOptional()
    @IsUrl({}, { message: 'Instagram debe ser una URL válida' })
    @MaxLength(500)
    instagram_url?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Facebook debe ser una URL válida' })
    @MaxLength(500)
    facebook_url?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Twitter debe ser una URL válida' })
    @MaxLength(500)
    twitter_url?: string;

    @IsEnum(PublicUserType, {
        message: 'El tipo de usuario debe ser CLIENT o ARTIST',
    })
    user_type: PublicUserType;
}
