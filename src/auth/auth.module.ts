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

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(cacheConfig),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
