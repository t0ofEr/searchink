import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from 'src/config/envs';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const logger = new Logger('PrismaService');

        if (!envs.dbUrl) {
            throw new Error('DATABASE_URL is not defined');
        }
        
        logger.log(`Connecting to database at ${envs.dbUrl}...`);

        const adapter = new PrismaPg({ connectionString: envs.dbUrl });
        super({ adapter });
    }
}