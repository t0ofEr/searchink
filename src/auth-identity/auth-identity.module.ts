import { Module } from '@nestjs/common';
import { AuthIdentityService } from './auth-identity.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [AuthIdentityService], 
    exports: [AuthIdentityService],
})
export class AuthIdenityModule {}
