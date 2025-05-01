# API для работы с интересами

## Общая информация

Базовый URL: `http://localhost:3000/api/interests`

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

## Эндпоинты

### Получение списка интересов

```http
GET /interests
```

**Описание**: Возвращает список всех интересов

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Программирование",
    "description": "Интерес к разработке программного обеспечения",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Получение интереса по ID

```http
GET /interests/{id}
```

**Параметры**:
- `id` (string, required) - UUID интереса

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Программирование",
  "description": "Интерес к разработке программного обеспечения",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Поиск интереса по названию

```http
GET /interests/search/name?name={name}
```

**Параметры**:
- `name` (string, required) - Название для поиска

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Программирование",
    "description": "Интерес к разработке программного обеспечения",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Создание интереса

```http
POST /interests
```

**Тело запроса**:
```json
{
  "name": "Программирование",
  "description": "Интерес к разработке программного обеспечения"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Программирование",
  "description": "Интерес к разработке программного обеспечения",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Обновление интереса

```http
PUT /interests/{id}
```

**Параметры**:
- `id` (string, required) - UUID интереса

**Тело запроса**:
```json
{
  "name": "Веб-программирование",
  "description": "Интерес к разработке веб-приложений"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Веб-программирование",
  "description": "Интерес к разработке веб-приложений",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:00:00.000Z"
}
```

### Удаление интереса

```http
DELETE /interests/{id}
```

**Параметры**:
- `id` (string, required) - UUID интереса

**Ответ**: 204 No Content

### Добавление интереса пользователю

```http
POST /interests/user
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "interestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Удаление интереса у пользователя

```http
DELETE /interests/user
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "interestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Добавление интереса сообществу

```http
POST /interests/community
```

**Тело запроса**:
```json
{
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "interestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Удаление интереса у сообщества

```http
DELETE /interests/community
```

**Тело запроса**:
```json
{
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "interestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Получение интересов пользователя

```http
GET /interests/user/{userId}
```

**Параметры**:
- `userId` (string, required) - UUID пользователя

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Программирование",
    "description": "Интерес к разработке программного обеспечения",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Получение интересов сообщества

```http
GET /interests/community/{communityId}
```

**Параметры**:
- `communityId` (string, required) - UUID сообщества

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Программирование",
    "description": "Интерес к разработке программного обеспечения",
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
// Получение списка интересов
const getInterests = async () => {
  const response = await fetch('http://localhost:3000/api/interests');
  return await response.json();
};

// Создание интереса
const createInterest = async (name: string, description: string) => {
  const response = await fetch('http://localhost:3000/api/interests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  return await response.json();
};

// Добавление интереса пользователю
const addUserInterest = async (userId: string, interestId: string) => {
  const response = await fetch('http://localhost:3000/api/interests/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, interestId }),
  });
  return response.ok;
};
```

### React

```typescript
import { useState, useEffect } from 'react';

const InterestList = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/interests');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке интересов');
        }
        const data = await response.json();
        setInterests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Список интересов</h1>
      <ul>
        {interests.map((interest) => (
          <li key={interest.id}>
            <h2>{interest.name}</h2>
            <p>{interest.description}</p>
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