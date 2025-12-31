import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
export default registerAs('jwt', (): JwtModuleOptions => {
    return {
        secret: process.env.JWT_SECRET_PASSWORD!,
        signOptions: {
            expiresIn: process.env.JWT_EXPIRE_IN as any,
        }
    }
})