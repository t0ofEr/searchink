import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/exceptions/prisma-exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger("SearchinkApp");
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );
  logger.log(`Application starting on port: ${port ?? 3000}`);
  app.enableShutdownHooks();
  await app.listen(port ?? 3000);
}
bootstrap();
