import { INestApplication } from '@nestjs/common';
import * as express from 'express';
import * as path from 'node:path';

export function configureApp(app: INestApplication): void {
  app.use(
    '/content/afisha',
    express.static(path.join(__dirname, '..', 'public', 'content', 'afisha')),
  );
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
}
