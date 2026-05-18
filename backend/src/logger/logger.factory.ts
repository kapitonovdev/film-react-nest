import { LoggerService } from '@nestjs/common';

import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type LogFormat = 'dev' | 'json' | 'tskv';

export function createLogger(
  format = process.env.LOG_FORMAT,
  nodeEnv = process.env.NODE_ENV,
): LoggerService {
  const normalizedFormat = normalizeLogFormat(format, nodeEnv);

  if (normalizedFormat === 'json') {
    return new JsonLogger();
  }

  if (normalizedFormat === 'tskv') {
    return new TskvLogger();
  }

  return new DevLogger();
}

function normalizeLogFormat(
  format: string | undefined,
  nodeEnv: string | undefined,
): LogFormat {
  if (format === 'json' || format === 'tskv' || format === 'dev') {
    return format;
  }

  if (nodeEnv === 'production') {
    return 'tskv';
  }

  return 'dev';
}
