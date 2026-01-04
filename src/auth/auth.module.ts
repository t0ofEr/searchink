import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import googleOauthConfig from 'src/config/google-oauth.config';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from 'src/config/jwt.config';
import cacheConfig from 'src/config/cache.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthIdenityModule } from 'src/auth-identity/auth-identity.module';
import superAdminConfig from 'src/config/super-admin.config';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(cacheConfig),
    ConfigModule.forFeature(superAdminConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UsersModule,
    AuthIdenityModule,
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
