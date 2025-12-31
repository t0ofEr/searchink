import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import googleOauthConfig from 'src/config/google-oauth.config';
import { VerifyCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject(googleOauthConfig.KEY)
        private googleConfiguration: ConfigType<typeof googleOauthConfig>,
        private authService: AuthService,
    ) {
        const options: StrategyOptions = {
            clientID: googleConfiguration.clientID!,
            clientSecret: googleConfiguration.clientSecret!,
            callbackURL: googleConfiguration.callbackURL!,
            scope: ['email', 'profile'],
        };

        super(options);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {

        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            avatar_url: profile.photos[0].value,
            sub: profile.id,
        });

        return user;
    }
}

