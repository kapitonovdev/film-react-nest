import { INestApplication } from '@nestjs/common';
import * as express from 'express';
import * as path from 'node:path';

export function configureApp(app: INestApplication): void {
  app.use(
    '/content',
    express.static(path.join(__dirname, '..', 'public', 'content')),
  );
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
}
