> 🚧 В активной разработке

# StreamVault

Платформа для видеопремьер с живым чатом. Авторы загружают видео и назначают дату выхода - в назначенное время начинается премьера, становится доступным чат и живой счетчик зрителей премьеры.

## Стек

**Backend:** NestJS · TypeScript · PostgreSQL · PrismaORM · Redis · RabbitMQ · WebSocket · JWT · Swagger(OpenAPI) · Docker

**Frontend:** Next.js · TypeScript · React · TailwindCSS

## Возможности платформы

- Загрузка видео и назначение даты премьеры
- JWT регистрация и авторизация
- Живой чат во время просмотра премьеры через WebSocket
- Автоматический запуск премьеры по расписанию (cron)
- Счетчик зрителей онлайн через Redis
- Уведомление пользователей о начале премьеры через RabbitMQ
- REST API с удобной документацией Swagger

## Архитектура

```
streamvault/
├── backend/
│   ├── prisma/   # Схемы базы данных
│   ├── src/
│   │   ├── auth/     # JWT авторизации
│   │   ├── message/  # WebSocket чат
│   │   ├── prisma/   # Модуль конфигурации PrismaORM
│   │   ├── redis/    # Модуль конфигурации Redis
│   │   ├── shared/   # Guards, interceptors, декораторы
│   │   ├── stream/   # CRUD стримов, Cron для отложенных премьер
│   │   ├── user/     # Создание и настройка профиля
│   └── Dockerfile
├── frontend/
└── docker-compose.yml
```

## Запуск

## Docker

### Через Docker

```bash
git clone https://github.com/1danay/streamvault
cd streamvault
docker-compose up -d
```

Приложение доступно на `http://localhost:<Ваш порт>`  
Swagger документация: `http://localhost:<Ваш порт>/api`

### Локально

```bash
git clone https://github.com/1danay/streamvault
cd streamvault

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## Переменные окружения

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/streamvault

HTTP_CORS='localhost:3000'

HTTP_PORT='8080'
HTTP_HOST='http://localhost:8080'

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

RABBIT_MQ_URLS='amqp://localhost:5672'

REDIS_USER='default'
REDIS_PASSWORD='123456'
REDIS_HOST='localhost'
REDIS_PORT=6379
```

## API

| Метод  | Эндпоинт            | Описание                |
| ------ | ------------------- | ----------------------- |
| GET    | /                   | Состояние приложения    |
| POST   | /auth/login         | Авторизация             |
| POST   | /auth/register      | Регистрация             |
| POST   | /streams            | Создать стрим           |
| GET    | /streams            | Список всех стримов     |
| PUT    | /streams/:id        | Обновить стрим          |
| GET    | /streams/:id        | Найти стрим             |
| PATCH  | /streams/:id/finish  | Закончить стрим         |
| DELETE | /streams/:id        | Удалить стрим           |
| GET    | /message            | История чата трансляции |

Полная документация: `/api` (Swagger)

## Roadmap

- [ ] Frontend (Next.js)
- [ ] Модуль уведомлений (RabbitMQ consumer)
- [ ] Профиль пользователя
