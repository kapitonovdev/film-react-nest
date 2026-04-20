import { ConfigService } from '@nestjs/config';

export const CONFIG_TOKEN = 'CONFIG';

export const configProvider = {
  provide: CONFIG_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    app: {
      port: Number(configService.get<string>('PORT') ?? '3000'),
    },
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') ?? 'mongodb',
      url:
        configService.get<string>('DATABASE_URL') ??
        'mongodb://localhost:27017/prac',
    },
  }),
};

export interface AppConfig {
  app: AppConfigHttp;
  database: AppConfigDatabase;
}

export interface AppConfigHttp {
  port: number;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
