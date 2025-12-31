import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    JWT_SECRET_PASSWORD: Joi.string().required(),
    JWT_EXPIRE_IN: Joi.string().required().default('3600s'),
    PORT: Joi.number().required(),
    DATABASE_URL: Joi.string().required(),
    SUPER_ADMINISTRATOR_PASS: Joi.string().required(),
    SUPER_ADMINISTRATOR_EMAIL: Joi.string().required(),
    GOOGLE_AUTH_SECRET_ID: Joi.string().required(),
    GOOGLE_AUTH_SECRET_CLIENT: Joi.string().required(),
    GOOGLE_AUTH_CALLBACK_URI: Joi.string().required(),
    ttlOneMin: Number(process.env.TTL_ONE_MIN) * 1000,
    ttlThirtyMin: Number(process.env.TTL_THIRTY_MIN) * 1000,
    ttlOneHour: Number(process.env.TTL_ONE_HOUR) * 1000,
    ttlOneDay: Number(process.env.TTL_ONE_DAY) * 1000,
});