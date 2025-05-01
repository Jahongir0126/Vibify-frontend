# API для работы с лайками

## Общая информация

Базовый URL: `http://localhost:3000/api/likes`

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

## Эндпоинты

### Получение лайков сообщения

```http
GET /likes/message/{messageId}
```

**Параметры**:
- `messageId` (string, required) - UUID сообщения

**Ответ**:
```json
{
  "count": 5,
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "username": "user1"
    }
  ]
}
```

### Добавление лайка сообщению

```http
POST /likes/message
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "messageId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Удаление лайка с сообщения

```http
DELETE /likes/message
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "messageId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Получение лайков комментария

```http
GET /likes/comment/{commentId}
```

**Параметры**:
- `commentId` (string, required) - UUID комментария

**Ответ**:
```json
{
  "count": 3,
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "username": "user1"
    }
  ]
}
```

### Добавление лайка комментарию

```http
POST /likes/comment
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "commentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Удаление лайка с комментария

```http
DELETE /likes/comment
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "commentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

## Коды ошибок

- `400 Bad Request` - Неверные данные в запросе
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Примеры использования

### TypeScript/JavaScript

```typescript
// Получение лайков сообщения
const getMessageLikes = async (messageId: string) => {
  const response = await fetch(`http://localhost:3000/api/likes/message/${messageId}`);
  return await response.json();
};

// Добавление лайка сообщению
const likeMessage = async (userId: string, messageId: string) => {
  const response = await fetch('http://localhost:3000/api/likes/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, messageId }),
  });
  return response.ok;
};

// Удаление лайка с сообщения
const unlikeMessage = async (userId: string, messageId: string) => {
  const response = await fetch('http://localhost:3000/api/likes/message', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, messageId }),
  });
  return response.ok;
};
```

### React

```typescript
import { useState, useEffect } from 'react';

const MessageLikes = ({ messageId }) => {
  const [likes, setLikes] = useState({ count: 0, users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/likes/message/${messageId}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке лайков');
        }
        const data = await response.json();
        setLikes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [messageId]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h3>Лайки: {likes.count}</h3>
      <ul>
        {likes.users.map((user) => (
          <li key={user.id}>{user.username}</li>
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