import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import googleOauthConfig from './config/google-oauth.config';
import { envValidationSchema } from './config/env.validation';
import { CacheModule } from '@nestjs/cache-manager';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, googleOauthConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
