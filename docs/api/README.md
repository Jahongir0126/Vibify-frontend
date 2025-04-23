# API Documentation

## Общая информация
API построено на REST архитектуре и использует JSON для передачи данных.

### Базовый URL
```
http://localhost:3000/
```

### Аутентификация
Для доступа к защищенным эндпоинтам требуется JWT токен, который передается в заголовке:
```
Authorization: Bearer <token>
```

## Эндпоинты

### Пользователи

#### Получение профиля пользователя
```http
GET /users/{userId}
```

**Параметры:**
- `userId` (path) - ID пользователя

**Ответ:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "location": "string",
  "createdAt": "string"
}
```

#### Обновление профиля
```http
PUT /users/{userId}
```

**Параметры:**
- `userId` (path) - ID пользователя

**Тело запроса:**
```json
{
  "username": "string",
  "bio": "string",
  "location": "string",
  "avatar": "string"
}
```

### Сообщения

#### Получение сообщений чата
```http
GET /chats/{chatId}/messages
```

**Параметры:**
- `chatId` (path) - ID чата
- `limit` (query) - Количество сообщений
- `offset` (query) - Смещение

**Ответ:**
```json
{
  "messages": [
    {
      "id": "string",
      "content": "string",
      "senderId": "string",
      "createdAt": "string"
    }
  ],
  "total": "number"
}
```

## WebSocket API

### Подключение
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### События

#### Новое сообщение
```javascript
socket.on('newMessage', (message) => {
  console.log('Новое сообщение:', message);
});
```

#### Статус пользователя
```javascript
socket.on('userStatus', (status) => {
  console.log('Статус пользователя:', status);
});
```

## Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Доступ запрещен |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |

## Примеры использования

### JavaScript
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Получение профиля
const getProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
  }
};
```

### React
```jsx
import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await api.getProfile(userId);
      setProfile(data);
    };
    fetchProfile();
  }, [userId]);

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.bio}</p>
    </div>
  );
};
``` 