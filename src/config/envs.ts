import 'dotenv/config'
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    SUPER_ADMINISTRATOR_PASS: string;
    SUPER_ADMINISTRATOR_EMAIL: string;
    JWT_SECRET_PASSWORD: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    SUPER_ADMINISTRATOR_PASS: joi.string().required(),
    SUPER_ADMINISTRATOR_EMAIL: joi.string().required(),
    JWT_SECRET_PASSWORD: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );

if (error) {
    throw new Error(`Config validation error: ${error?.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    dbUrl: envVars.DATABASE_URL,
    superAdminPass: envVars.SUPER_ADMINISTRATOR_PASS,
    superAdmimEmail: envVars.SUPER_ADMINISTRATOR_EMAIL,
    jwtSecret: envVars.JWT_SECRET_PASSWORD,
}
