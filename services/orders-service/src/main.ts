import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module.js';
import { InternalTokenGuard } from './shared/presentation/internal-token.guard.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Solo se aceptan solicitudes que vienen del API Gateway.
  app.useGlobalGuards(new InternalTokenGuard());

  const port = process.env.PORT ?? 3003;

  await app.listen(port);

  console.log(`Orders Service ejecutándose en el puerto ${port}`);
}

bootstrap();
