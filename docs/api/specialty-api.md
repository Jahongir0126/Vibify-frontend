# API для работы со специальностями

## Общая информация

Базовый URL: `http://localhost:3000/api/specialties`

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

## Эндпоинты

### Получение списка специальностей

```http
GET /specialties
```

**Описание**: Возвращает список всех специальностей

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Веб-разработка",
    "description": "Разработка веб-приложений и сайтов",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Получение специальности по ID

```http
GET /specialties/{id}
```

**Параметры**:
- `id` (string, required) - UUID специальности

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Веб-разработка",
  "description": "Разработка веб-приложений и сайтов",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Поиск специальности по названию

```http
GET /specialties/search/name?name={name}
```

**Параметры**:
- `name` (string, required) - Название для поиска

**Ответ**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Веб-разработка",
    "description": "Разработка веб-приложений и сайтов",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

### Создание специальности

```http
POST /specialties
```

**Тело запроса**:
```json
{
  "name": "Веб-разработка",
  "description": "Разработка веб-приложений и сайтов"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Веб-разработка",
  "description": "Разработка веб-приложений и сайтов",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Обновление специальности

```http
PUT /specialties/{id}
```

**Параметры**:
- `id` (string, required) - UUID специальности

**Тело запроса**:
```json
{
  "name": "Фронтенд-разработка",
  "description": "Разработка пользовательского интерфейса"
}
```

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Фронтенд-разработка",
  "description": "Разработка пользовательского интерфейса",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:00:00.000Z"
}
```

### Удаление специальности

```http
DELETE /specialties/{id}
```

**Параметры**:
- `id` (string, required) - UUID специальности

**Ответ**: 204 No Content

### Добавление специальности пользователю

```http
POST /specialties/user
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "specialtyId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Удаление специальности у пользователя

```http
DELETE /specialties/user
```

**Тело запроса**:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "specialtyId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Добавление специальности сообществу

```http
POST /specialties/community
```

**Тело запроса**:
```json
{
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "specialtyId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Удаление специальности у сообщества

```http
DELETE /specialties/community
```

**Тело запроса**:
```json
{
  "communityId": "123e4567-e89b-12d3-a456-426614174000",
  "specialtyId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Ответ**: 200 OK

### Получение специальности пользователя

```http
GET /specialties/user/{userId}
```

**Параметры**:
- `userId` (string, required) - UUID пользователя

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Веб-разработка",
  "description": "Разработка веб-приложений и сайтов",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

### Получение специальности сообщества

```http
GET /specialties/community/{communityId}
```

**Параметры**:
- `communityId` (string, required) - UUID сообщества

**Ответ**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Веб-разработка",
  "description": "Разработка веб-приложений и сайтов",
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

## Коды ошибок

- `400 Bad Request` - Неверные данные в запросе
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Примеры использования

### TypeScript/JavaScript

```typescript
// Получение списка специальностей
const getSpecialties = async () => {
  const response = await fetch('http://localhost:3000/api/specialties');
  return await response.json();
};

// Создание специальности
const createSpecialty = async (name: string, description: string) => {
  const response = await fetch('http://localhost:3000/api/specialties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  return await response.json();
};

// Добавление специальности пользователю
const addUserSpecialty = async (userId: string, specialtyId: string) => {
  const response = await fetch('http://localhost:3000/api/specialties/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, specialtyId }),
  });
  return response.ok;
};
```

### React

```typescript
import { useState, useEffect } from 'react';

const SpecialtyList = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/specialties');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке специальностей');
        }
        const data = await response.json();
        setSpecialties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Список специальностей</h1>
      <ul>
        {specialties.map((specialty) => (
          <li key={specialty.id}>
            <h2>{specialty.name}</h2>
            <p>{specialty.description}</p>
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