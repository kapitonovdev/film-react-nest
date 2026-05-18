# FILM

Приложение состоит из React/Vite frontend, NestJS backend, PostgreSQL и nginx.

## Ссылки

- Локально: http://localhost
- pgAdmin: http://localhost:8080
- Production: будет добавлен после настройки Yandex Cloud, домена и SSH-доступа.

## Быстрый запуск в Docker

1. Создайте env-файл:

```bash
cp .env.example .env
```

2. Соберите и запустите контейнеры:

```bash
docker compose up -d --build
```

3. Заполните базу через pgAdmin или `psql` файлами из `backend/test` в таком порядке:

```bash
backend/test/prac.init.sql
backend/test/prac.films.sql
backend/test/prac.schedules.sql
```

После запуска frontend доступен на `http://localhost`, backend проксируется через `http://localhost/api/afisha`, статический контент доступен через `http://localhost/content/afisha`.

## Локальная разработка

Backend:

```bash
cd backend
npm ci
npm run start:dev
```

Frontend:

```bash
cd frontend
npm ci
npm run dev
```

## Проверки

```bash
cd backend
npm run lint
npm run test
npm run build
```

```bash
cd frontend
npm run lint
npm run build
```

## Логирование

Backend поддерживает три формата логов через переменную `LOG_FORMAT`:

- `dev` - стандартный цветной `ConsoleLogger` NestJS.
- `json` - структурированные JSON-записи.
- `tskv` - tab-separated key-value записи для серверных log agents.

Если `LOG_FORMAT` не задан, в разработке используется `dev`, а при `NODE_ENV=production` используется `tskv`.

## Docker images

GitHub Actions workflow `.github/workflows/docker.yml` собирает и публикует образы при push в `main`:

- `ghcr.io/kapitonovdev/film-react-nest-backend:latest`
- `ghcr.io/kapitonovdev/film-react-nest-frontend:latest`
- `ghcr.io/kapitonovdev/film-react-nest-nginx:latest`

Для финального деплоя на Yandex Cloud нужно добавить production URL в этот README, скопировать `docker-compose.yml` и `.env` на сервер, выполнить `docker compose pull` и `docker compose up -d`.
