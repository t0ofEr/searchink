import 'dotenv/config'
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    SUPER_ADMINISTRATOR_PASS: string;
    SUPER_ADMINISTRATOR_EMAIL: string;
    GOOGLE_AUTH_SECRET_ID: string;
    GOOGLE_AUTH_SECRET_CLIENT: string;
    GOOGLE_AUTH_CALLBACK_URI: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    SUPER_ADMINISTRATOR_PASS: joi.string().required(),
    SUPER_ADMINISTRATOR_EMAIL: joi.string().required(),
    JWT_SECRET_PASSWORD: joi.string().required(),
    GOOGLE_AUTH_SECRET_ID: joi.string().required(),
    GOOGLE_AUTH_SECRET_CLIENT: joi.string().required(),
    GOOGLE_AUTH_CALLBACK_URI: joi.string().required(),
})
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error?.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    dbUrl: envVars.DATABASE_URL,
    superAdminPass: envVars.SUPER_ADMINISTRATOR_PASS,
    superAdmimEmail: envVars.SUPER_ADMINISTRATOR_EMAIL,
    googleAuthId: envVars.GOOGLE_AUTH_SECRET_ID,
    googleAuthClient: envVars.GOOGLE_AUTH_SECRET_CLIENT,
    googleAuthCallbackUri: envVars.GOOGLE_AUTH_CALLBACK_URI,
}
