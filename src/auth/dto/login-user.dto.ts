import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({ message: 'Correo es obligatorio' })
    @IsEmail({}, { message: 'Debe ingresar un correo válido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser texto' })
    password: string;
}