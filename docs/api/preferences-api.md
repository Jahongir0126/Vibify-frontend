# API для работы с предпочтениями пользователей

## Общая информация

Базовый URL: `http://localhost:3000/api/preferences`

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

## Эндпоинты

### Получение предпочтений пользователя

```http
GET /preferences/{userId}
```

**Параметры**:
- `userId` (string, required) - UUID пользователя

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "notifications": {
    "email": true,
    "push": true,
    "communityUpdates": true,
    "messageReplies": true
  },
  "privacy": {
    "profileVisibility": "public",
    "showEmail": false,
    "showInterests": true
  },
  "language": "ru",
  "theme": "light",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Создание предпочтений

```http
POST /preferences
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "notifications": {
    "email": true,
    "push": true,
    "communityUpdates": true,
    "messageReplies": true
  },
  "privacy": {
    "profileVisibility": "public",
    "showEmail": false,
    "showInterests": true
  },
  "language": "ru",
  "theme": "light"
}
```

**Ответ**: 201 Created

### Обновление предпочтений

```http
PUT /preferences/{userId}
```

**Параметры**:
- `userId` (string, required) - UUID пользователя

**Тело запроса**:
```json
{
  "notifications": {
    "email": false,
    "push": true,
    "communityUpdates": true,
    "messageReplies": false
  },
  "privacy": {
    "profileVisibility": "private",
    "showEmail": false,
    "showInterests": false
  },
  "language": "en",
  "theme": "dark"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "notifications": {
    "email": false,
    "push": true,
    "communityUpdates": true,
    "messageReplies": false
  },
  "privacy": {
    "profileVisibility": "private",
    "showEmail": false,
    "showInterests": false
  },
  "language": "en",
  "theme": "dark",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:00:00.000Z"
}
```

### Удаление предпочтений

```http
DELETE /preferences/{userId}
```

**Параметры**:
- `userId` (string, required) - UUID пользователя

**Ответ**: 204 No Content

## Коды ошибок

- `400 Bad Request` - Неверные данные в запросе
- `401 Unauthorized` - Пользователь не авторизован
- `403 Forbidden` - Нет прав на выполнение операции
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Примеры использования

### TypeScript/JavaScript

```typescript
// Получение предпочтений пользователя
const getPreferences = async (userId: string) => {
  const response = await fetch(`http://localhost:3000/api/preferences/${userId}`);
  return await response.json();
};

// Создание предпочтений
const createPreferences = async (preferences: PreferencesDto) => {
  const response = await fetch('http://localhost:3000/api/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });
  return await response.json();
};

// Обновление предпочтений
const updatePreferences = async (userId: string, preferences: UpdatePreferencesDto) => {
  const response = await fetch(`http://localhost:3000/api/preferences/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });
  return await response.json();
};
```

### React

```typescript
import { useState, useEffect } from 'react';

const UserPreferences = ({ userId }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/preferences/${userId}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке предпочтений');
        }
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleUpdate = async (updatedPreferences) => {
    try {
      const response = await fetch(`http://localhost:3000/api/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences),
      });
      if (!response.ok) {
        throw new Error('Ошибка при обновлении предпочтений');
      }
      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Настройки пользователя</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdate({
          notifications: {
            email: e.target.email.checked,
            push: e.target.push.checked,
            communityUpdates: e.target.communityUpdates.checked,
            messageReplies: e.target.messageReplies.checked,
          },
          privacy: {
            profileVisibility: e.target.profileVisibility.value,
            showEmail: e.target.showEmail.checked,
            showInterests: e.target.showInterests.checked,
          },
          language: e.target.language.value,
          theme: e.target.theme.value,
        });
      }}>
        {/* Форма настроек */}
      </form>
    </div>
  );
};
```

## Рекомендации по использованию

1. Всегда проверяйте права доступа перед выполнением операций
2. Используйте типизацию для всех запросов и ответов
3. Кэшируйте предпочтения пользователя для оптимизации производительности
4. Реализуйте механизм отката изменений при ошибках
5. Добавьте валидацию данных на клиенте
6. Используйте debounce для частых обновлений
7. Сохраняйте историю изменений предпочтений
8. Предоставьте пользователю возможность экспорта/импорта настроек 