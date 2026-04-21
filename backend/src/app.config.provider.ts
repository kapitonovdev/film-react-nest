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
      driver: configService.get<string>('DATABASE_DRIVER') ?? 'postgres',
      url:
        configService.get<string>('DATABASE_URL') ??
        'postgres://localhost:5432/exampledb',
      username: configService.get<string>('DATABASE_USERNAME') ?? 'exampleuser',
      password:
        configService.get<string>('DATABASE_PASSWORD') ?? 'examplepassword',
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
  username: string;
  password: string;
}
