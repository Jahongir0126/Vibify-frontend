# API для работы с сообществами

## Общая информация

Базовый URL: `http://localhost:3000/api/communities`

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

## Эндпоинты

### Получение списка сообществ

```http
GET /communities
```

**Описание**: Возвращает список всех сообществ

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Сообщество разработчиков",
    "description": "Сообщество для обсуждения разработки",
    "specialty": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Разработка"
    },
    "interests": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Программирование"
      }
    ],
    "members": [
      {
        "userId": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Иван Иванов"
      }
    ],
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Получение сообщества по ID

```http
GET /communities/{id}
```

**Параметры**:
- `id` (string, required) - UUID сообщества

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Сообщество разработчиков",
  "description": "Сообщество для обсуждения разработки",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Создание сообщества

```http
POST /communities
```

**Тело запроса**:
```json
{
  "name": "Сообщество разработчиков",
  "description": "Сообщество для обсуждения разработки"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Сообщество разработчиков",
  "description": "Сообщество для обсуждения разработки",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Обновление сообщества

```http
PUT /communities/{id}
```

**Параметры**:
- `id` (string, required) - UUID сообщества

**Тело запроса**:
```json
{
  "name": "Сообщество веб-разработчиков",
  "description": "Сообщество для обсуждения веб-разработки"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Сообщество веб-разработчиков",
  "description": "Сообщество для обсуждения веб-разработки",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:00:00.000Z"
}
```

### Удаление сообщества

```http
DELETE /communities/{id}
```

**Параметры**:
- `id` (string, required) - UUID сообщества

**Ответ**: 204 No Content

### Присоединение к сообществу

```http
POST /communities/join
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "communityId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Выход из сообщества

```http
POST /communities/leave
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "communityId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Получение сообществ пользователя

```http
GET /communities/user/{userId}
```

**Параметры**:
- `userId` (string, required) - UUID пользователя

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Сообщество разработчиков",
    "description": "Сообщество для обсуждения разработки",
    "specialty": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Разработка"
    },
    "interests": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Программирование"
      }
    ],
    "members": [
      {
        "userId": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Иван Иванов"
      }
    ],
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Получение пользователей сообщества

```http
GET /communities/{communityId}/users
```

**Параметры**:
- `communityId` (string, required) - UUID сообщества

**Ответ**:
```json
[
  {
    "userId": "123e4567-e89b-12d3-a456-426614174003",
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
]
```

### Поиск сообществ по интересам

```http
POST /communities/search/by-interests
```

**Тело запроса**:
```json
{
  "interestIds": [
    "123e4567-e89b-12d3-a456-426614174002",
    "123e4567-e89b-12d3-a456-426614174004"
  ]
}
```

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Сообщество разработчиков",
    "description": "Сообщество для обсуждения разработки",
    "specialty": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Разработка"
    },
    "interests": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Программирование"
      }
    ],
    "members": [
      {
        "userId": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Иван Иванов"
      }
    ],
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Поиск сообществ по специальности

```http
GET /communities/specialty/{specialtyId}
```

**Параметры**:
- `specialtyId` (string, required) - UUID специальности

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Сообщество разработчиков",
    "description": "Сообщество для обсуждения разработки",
    "specialty": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Разработка"
    },
    "interests": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Программирование"
      }
    ],
    "members": [
      {
        "userId": "123e4567-e89b-12d3-a456-426614174003",
        "name": "Иван Иванов"
      }
    ],
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

## Коды ошибок

- `400 Bad Request` - Неверные данные в запросе
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Примеры использования

### TypeScript/JavaScript

```typescript
// Получение списка сообществ
const getCommunities = async () => {
  const response = await fetch('http://localhost:3000/api/communities');
  return await response.json();
};

// Создание сообщества
const createCommunity = async (name: string, description: string) => {
  const response = await fetch('http://localhost:3000/api/communities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  return await response.json();
};

// Присоединение к сообществу
const joinCommunity = async (userId: string, communityId: string) => {
  const response = await fetch('http://localhost:3000/api/communities/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, communityId }),
  });
  return response.ok;
};

// Получение сообществ пользователя
const getUserCommunities = async (userId: string) => {
  const response = await fetch(`http://localhost:3000/api/communities/user/${userId}`);
  return await response.json();
};

// Получение пользователей сообщества
const getCommunityUsers = async (communityId: string) => {
  const response = await fetch(`http://localhost:3000/api/communities/${communityId}/users`);
  return await response.json();
};

// Поиск сообществ по интересам
const findCommunitiesByInterests = async (interestIds: string[]) => {
  const response = await fetch('http://localhost:3000/api/communities/search/by-interests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ interestIds }),
  });
  return await response.json();
};

// Поиск сообществ по специальности
const findCommunitiesBySpecialty = async (specialtyId: string) => {
  const response = await fetch(`http://localhost:3000/api/communities/specialty/${specialtyId}`);
  return await response.json();
};
```

### React

```typescript
import { useState, useEffect } from 'react';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/communities');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке сообществ');
        }
        const data = await response.json();
        setCommunities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Список сообществ</h1>
      <ul>
        {communities.map((community) => (
          <li key={community.id}>
            <h2>{community.name}</h2>
            <p>{community.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Рекомендации по использованию

1. Всегда обрабатывайте ошибки при работе с API
2. Используйте типизацию для всех запросов и ответов
3. Кэшируйте часто запрашиваемые данные
4. Реализуйте механизм повторных попыток при временных сбоях
5. Используйте debounce/throttle для частых запросов
6. Добавьте индикаторы загрузки для улучшения UX 