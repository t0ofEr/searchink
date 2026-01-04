import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dbConfig from 'src/config/db.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(dbConfig.KEY) private dbCfg: ConfigType<typeof dbConfig>,
    ) {
        const logger = new Logger('PrismaService');

        if (!dbCfg.url) {
            throw new Error('DATABASE_URL is not defined');
        }

        logger.log(`Connecting to database at ${dbCfg.url}...`);

        const adapter = new PrismaPg({ connectionString: dbCfg.url });
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}