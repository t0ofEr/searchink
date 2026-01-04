import appConfig from "./app.config";
import cacheConfig from "./cache.config";
import dbConfig from "./db.config";
import googleOauthConfig from "./google-oauth.config";
import jwtConfig from "./jwt.config";
import superAdminConfig from "./super-admin.config";

export const allConfigsObject = {
    google: googleOauthConfig,
    jwt: jwtConfig,
    cache: cacheConfig,
    superadmin: superAdminConfig,
    app: appConfig,
    db: dbConfig,
};

export const allConfigsArray = [
    googleOauthConfig,
    jwtConfig,
    cacheConfig,
    superAdminConfig,
    appConfig,
    dbConfig,
];