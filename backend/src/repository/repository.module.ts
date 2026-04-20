import { Module } from '@nestjs/common';

import { AppConfigModule } from '../app-config.module';
import { FilmsRepository } from './films.repository';
import { repositoryProviders } from './repository.providers';

@Module({
  imports: [AppConfigModule],
  providers: [...repositoryProviders, FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
