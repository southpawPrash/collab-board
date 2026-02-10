import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Start the server
  await app.listen(port);

  // Log that the server is running
  const logger = new Logger('Bootstrap');
  logger.log(`Backend running on http://localhost:${port}`);
}

bootstrap();
