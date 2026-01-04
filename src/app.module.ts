import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthIdenityModule } from './auth-identity/auth-identity.module';
import { PrismaModule } from './prisma/prisma.module';
import { allConfigsArray } from './config';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: allConfigsArray,
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
    AuthIdenityModule,
    PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
