import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    JWT_SECRET_PASSWORD: Joi.string().required(),
    JWT_EXPIRE_IN: Joi.string().default('3600s'),

    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    
    SUPER_ADMINISTRATOR_PASS: Joi.string().required(),
    SUPER_ADMINISTRATOR_EMAIL: Joi.string().email().required(),

    GOOGLE_AUTH_SECRET_ID: Joi.string().required(),
    GOOGLE_AUTH_SECRET_CLIENT: Joi.string().required(),
    GOOGLE_AUTH_CALLBACK_URI: Joi.string().uri().required(),

    TTL_ONE_MIN: Joi.number().required(),
    TTL_THIRTY_MIN: Joi.number().required(),
    TTL_ONE_HOUR: Joi.number().required(),
    TTL_ONE_DAY: Joi.number().required(),
});