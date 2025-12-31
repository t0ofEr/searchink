import { registerAs } from "@nestjs/config"

export default registerAs("googleOAuth", () => ({
    clientID: process.env.GOOGLE_AUTH_SECRET_ID,
    clientSecret: process.env.GOOGLE_AUTH_SECRET_CLIENT,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URI,
}));