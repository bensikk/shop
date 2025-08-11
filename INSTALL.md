# Инструкция по установке Music Shop

## Требования

- Node.js 18+ 
- PostgreSQL 12+
- PgAdmin4 (для управления базой данных)

## Пошаговая установка

### 1. Клонирование репозитория

```bash
git clone <your-repo-url>
cd music-shop
```

### 2. Установка зависимостей

```bash
npm run install:all
```

### 3. Настройка базы данных

#### 3.1 Создание базы данных в PostgreSQL

1. Откройте PgAdmin4
2. Подключитесь к вашему PostgreSQL серверу
3. Создайте новую базу данных с именем `music_shop`

#### 3.2 Настройка переменных окружения

Создайте файл `backend/.env` на основе `backend/env.example`:

```bash
cp backend/env.example backend/.env
```

Отредактируйте `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/music_shop"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION_TIME="3600s"

# App
PORT=3000
NODE_ENV=development
```

Замените `username`, `password` на ваши реальные данные для подключения к PostgreSQL.

### 4. Настройка базы данных

```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:migrate

# Заполнение тестовыми данными
npm run db:seed
```

### 5. Запуск приложения

```bash
# Запуск в режиме разработки (backend + frontend)
npm run dev
```

Или запустите отдельно:

```bash
# Backend (в одном терминале)
npm run dev:backend

# Frontend (в другом терминале)
npm run dev:frontend
```

## Доступ к приложению

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger документация**: http://localhost:3000/api/docs
- **Prisma Studio**: http://localhost:5555 (запустите `npm run db:studio`)

## Тестовые аккаунты

После выполнения `npm run db:seed` будут созданы тестовые пользователи:

### Администратор
- Email: `admin@musicshop.com`
- Пароль: `admin123`

### Обычный пользователь
- Email: `user@musicshop.com`
- Пароль: `user123`

## Структура проекта

```
music-shop/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Аутентификация
│   │   ├── users/          # Управление пользователями
│   │   ├── products/       # Товары
│   │   ├── categories/     # Категории
│   │   ├── orders/         # Заказы
│   │   └── prisma/         # База данных
│   ├── prisma/
│   │   ├── schema.prisma   # Схема БД
│   │   └── seed.ts         # Тестовые данные
│   └── package.json
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/          # Страницы
│   │   ├── contexts/       # React контексты
│   │   ├── hooks/          # Кастомные хуки
│   │   └── lib/            # Утилиты
│   └── package.json
└── package.json
```

## Полезные команды

```bash
# Установка всех зависимостей
npm run install:all

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Применение миграций БД
npm run db:migrate

# Заполнение БД тестовыми данными
npm run db:seed

# Открытие Prisma Studio
npm run db:studio

# Линтинг backend
cd backend && npm run lint

# Линтинг frontend
cd frontend && npm run lint
```

## Возможные проблемы

### Ошибка подключения к базе данных
- Проверьте, что PostgreSQL запущен
- Убедитесь, что данные в `DATABASE_URL` корректны
- Проверьте, что база данных `music_shop` существует

### Ошибка портов
- Убедитесь, что порты 3000 и 5173 свободны
- Или измените порты в конфигурации

### Ошибка зависимостей
- Удалите `node_modules` и `package-lock.json`
- Выполните `npm install` заново

## Поддержка

Если у вас возникли проблемы, проверьте:
1. Версию Node.js (должна быть 18+)
2. Настройки базы данных
3. Переменные окружения
4. Логи в консоли
