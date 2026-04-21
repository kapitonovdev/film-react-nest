import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppConfig, CONFIG_TOKEN } from './app.config.provider';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  configureApp(app);
  const config = app.get<AppConfig>(CONFIG_TOKEN);
  await app.listen(config.app.port);
}
bootstrap();
