import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import cacheConfig from 'src/config/cache.config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY) private jwtCfg: ConfigType<typeof jwtConfig>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(cacheConfig.KEY) private cacheCfg: ConfigType<typeof cacheConfig>,
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtCfg.secret as string,
        });
    }

    async validate(payload: any) {
        const cacheKey = `user_session_${payload.sub}`;

        let user = await this.cacheManager.get(cacheKey);
        
        if (!user) {
            user = await this.authService.findOneUserForSession(payload.sub);

            if (!user) throw new UnauthorizedException();

            await this.cacheManager.set(cacheKey, user, this.cacheCfg.ttlOneHour); 
        }

        return user;
    }
}
