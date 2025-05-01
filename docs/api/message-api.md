# API для работы с сообщениями

## Общая информация

Базовый URL: `http://localhost:3000/api/messages`

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

## Эндпоинты

### Получение списка сообщений

```http
GET /messages
```

**Параметры запроса**:
- `page` (number, optional) - Номер страницы (по умолчанию 1)
- `limit` (number, optional) - Количество сообщений на странице (по умолчанию 20)
- `communityId` (string, optional) - UUID сообщества для фильтрации

**Ответ**:
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "content": "Текст сообщения",
      "author": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "username": "user1"
      },
      "communityId": "123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2024-03-20T10:00:00.000Z",
      "updatedAt": "2024-03-20T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Получение сообщения по ID

```http
GET /messages/{id}
```

**Параметры**:
- `id` (string, required) - UUID сообщения

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Текст сообщения",
  "author": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "user1"
  },
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Создание сообщения

```http
POST /messages
```

**Тело запроса**:
```json
{
  "content": "Текст сообщения",
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "communityId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Текст сообщения",
  "author": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "user1"
  },
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Обновление сообщения

```http
PUT /messages/{id}
```

**Параметры**:
- `id` (string, required) - UUID сообщения

**Тело запроса**:
```json
{
  "content": "Обновленный текст сообщения"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Обновленный текст сообщения",
  "author": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "user1"
  },
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:00:00.000Z"
}
```

### Удаление сообщения

```http
DELETE /messages/{id}
```

**Параметры**:
- `id` (string, required) - UUID сообщения

**Ответ**: 204 No Content

### Получение комментариев сообщения

```http
GET /messages/{id}/comments
```

**Параметры**:
- `id` (string, required) - UUID сообщения
- `page` (number, optional) - Номер страницы (по умолчанию 1)
- `limit` (number, optional) - Количество комментариев на странице (по умолчанию 20)

**Ответ**:
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "content": "Текст комментария",
      "author": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "username": "user1"
      },
      "messageId": "123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2024-03-20T10:00:00.000Z",
      "updatedAt": "2024-03-20T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

## Коды ошибок

- `400 Bad Request` - Неверные данные в запросе
- `401 Unauthorized` - Пользователь не авторизован
- `403 Forbidden` - Нет прав на выполнение операции
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Примеры использования

### TypeScript/JavaScript

```typescript
// Получение списка сообщений
const getMessages = async (page = 1, limit = 20, communityId?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(communityId && { communityId }),
  });
  
  const response = await fetch(`http://localhost:3000/api/messages?${params}`);
  return await response.json();
};

// Создание сообщения
const createMessage = async (content: string, authorId: string, communityId: string) => {
  const response = await fetch('http://localhost:3000/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, authorId, communityId }),
  });
  return await response.json();
};

// Обновление сообщения
const updateMessage = async (id: string, content: string) => {
  const response = await fetch(`http://localhost:3000/api/messages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  return await response.json();
};
```

### React

```typescript
import { useState, useEffect } from 'react';

const MessageList = ({ communityId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages?page=${page}&limit=20&communityId=${communityId}`
        );
        if (!response.ok) {
          throw new Error('Ошибка при загрузке сообщений');
        }
        const data = await response.json();
        setMessages(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [communityId, page]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Сообщения</h1>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
          <small>Автор: {message.author.username}</small>
        </div>
      ))}
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
7. Реализуйте пагинацию для больших списков сообщений
8. Используйте WebSocket для обновления сообщений в реальном времени 