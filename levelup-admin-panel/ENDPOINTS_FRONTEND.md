# Endpoints del Frontend que se Comunican con el Backend

Este documento lista todos los endpoints que el frontend de LevelUp Admin Panel utiliza o debería utilizar para comunicarse con el backend.

**Base URL del Backend:** `http://localhost:8080/api`

---

## 🔐 Autenticación (AuthService)

### POST `/auth/login`
- **Archivo:** `src/services/AuthService.ts`
- **Método:** `login(email: string, password: string)`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta:**
  ```json
  {
    "token": "string",
    "email": "string",
    "nombre": "string",
    "role": "string"
  }
  ```
- **Descripción:** Autentica un usuario y devuelve un token JWT

### POST `/auth/register`
- **Archivo:** `src/services/AuthService.ts`
- **Método:** `register(nombre: string, email: string, password: string, telefono?: string)`
- **Body:**
  ```json
  {
    "nombre": "string",
    "email": "string",
    "password": "string",
    "telefono": "string (opcional)"
  }
  ```
- **Respuesta:**
  ```json
  {
    "token": "string",
    "email": "string",
    "nombre": "string",
    "role": "string"
  }
  ```
- **Descripción:** Registra un nuevo usuario y devuelve un token JWT

---

## 👥 Usuarios (UserRepository)

### GET `/users`
- **Archivo:** `src/repositories/UserRepository.ts`
- **Método:** `findAll()`
- **Respuesta:** Array de objetos User
- **Descripción:** Obtiene todos los usuarios del sistema
- **Fallback:** Si falla, usa localStorage o archivo JSON local

### PUT `/users/{id}`
- **Archivo:** `src/repositories/UserRepository.ts`
- **Método:** `update(id: string, userData: Partial<User>)`
- **Body:** Objeto User parcial con los campos a actualizar
- **Respuesta:** Objeto User actualizado
- **Descripción:** Actualiza la información de un usuario específico
- **Fallback:** Si falla, actualiza en localStorage

---

## 📦 Productos (ProductRepository)

### GET `/products`
- **Archivo:** `src/repositories/ProductRepository.ts`
- **Método:** `findAll()`
- **Respuesta:** Array de objetos Product
- **Descripción:** Obtiene todos los productos disponibles
- **Fallback:** Si falla, usa localStorage o archivo JSON local

---

## 🛒 Órdenes/Pedidos (OrderRepository)

### GET `/orders?userId={userId}`
- **Archivo:** `src/repositories/OrderRepository.ts`
- **Método:** `findByUserId(userId: string)`
- **Query Params:** `userId` - ID del usuario
- **Respuesta:** Array de objetos Order del usuario especificado
- **Descripción:** Obtiene todas las órdenes de un usuario específico

### POST `/orders`
- **Archivo:** `src/repositories/OrderRepository.ts`
- **Método:** `create(orderData: Partial<Order>)`
- **Body:** Objeto Order con los datos del pedido
- **Respuesta:** Objeto Order creado con ID generado
- **Descripción:** Crea un nuevo pedido (compra o canje)
- **Fallback:** Si falla, guarda en localStorage

### PUT `/orders/{id}`
- **Archivo:** `src/repositories/OrderRepository.ts`
- **Método:** `update(id: string, orderData: Partial<Order>)`
- **Body:** Objeto Order parcial con los campos a actualizar
- **Respuesta:** Objeto Order actualizado
- **Descripción:** Actualiza el estado o información de un pedido

### DELETE `/orders/{id}`
- **Archivo:** `src/repositories/OrderRepository.ts`
- **Método:** `delete(id: string)`
- **Respuesta:** Vacía (204 No Content)
- **Descripción:** Elimina un pedido
- **Fallback:** Si falla, elimina de localStorage

---

## 📝 Blogs/Noticias (BlogRepository)

### GET `/blogs`
- **Archivo:** `src/repositories/BlogRepository.ts`
- **Método:** `findAll()`
- **Respuesta:** Array de objetos BlogItem (incluye eventos, videos, notas)
- **Descripción:** Obtiene todos los elementos del blog (eventos, noticias, videos)
- **Fallback:** Si falla, usa localStorage o archivos JSON locales (`levelup_blogs.json`, `levelup_news.json`)

---

## 🎉 Eventos (EventRepository)

### GET `/events`
- **Archivo:** `src/repositories/EventRepository.ts`
- **Método:** `findAll()`
- **Respuesta:** Array de objetos Event
- **Descripción:** Obtiene todos los eventos
- **Fallback:** Si falla, usa localStorage o archivo JSON local

---

## ⭐ Reseñas/Reviews (ReviewRepository)

### GET `/reviews`
- **Archivo:** `src/repositories/ReviewRepository.ts`
- **Método:** `findAll()`
- **Respuesta:** Array de objetos Review
- **Descripción:** Obtiene todas las reseñas de productos
- **Fallback:** Si falla, usa localStorage o archivo JSON local

---

## 🎁 Órdenes de Canje (RedemptionOrderRepository)

**Nota:** Este repositorio actualmente NO tiene integración con el backend. Solo usa localStorage.

### Endpoints Sugeridos (No Implementados):

#### GET `/redemptions`
- **Descripción:** Obtener todas las órdenes de canje
- **Estado:** ❌ No implementado

#### GET `/redemptions?userId={userId}`
- **Descripción:** Obtener órdenes de canje de un usuario específico
- **Estado:** ❌ No implementado

#### POST `/redemptions`
- **Descripción:** Crear una nueva orden de canje
- **Estado:** ❌ No implementado

#### PUT `/redemptions/{id}`
- **Descripción:** Actualizar una orden de canje
- **Estado:** ❌ No implementado

#### DELETE `/redemptions/{id}`
- **Descripción:** Eliminar una orden de canje
- **Estado:** ❌ No implementado

---

## 📊 Resumen de Endpoints

| Método | Endpoint | Implementado | Fallback |
|--------|----------|--------------|----------|
| POST | `/auth/login` | ✅ | ❌ |
| POST | `/auth/register` | ✅ | ❌ |
| GET | `/users` | ✅ | ✅ localStorage/JSON |
| PUT | `/users/{id}` | ✅ | ✅ localStorage |
| GET | `/products` | ✅ | ✅ localStorage/JSON |
| GET | `/orders?userId={userId}` | ✅ | ❌ |
| POST | `/orders` | ✅ | ✅ localStorage |
| PUT | `/orders/{id}` | ✅ | ❌ |
| DELETE | `/orders/{id}` | ✅ | ✅ localStorage |
| GET | `/blogs` | ✅ | ✅ localStorage/JSON |
| GET | `/events` | ✅ | ✅ localStorage/JSON |
| GET | `/reviews` | ✅ | ✅ localStorage/JSON |
| GET | `/redemptions` | ❌ | ✅ localStorage |
| POST | `/redemptions` | ❌ | ✅ localStorage |
| PUT | `/redemptions/{id}` | ❌ | ✅ localStorage |
| DELETE | `/redemptions/{id}` | ❌ | ✅ localStorage |

---

## 🔧 Configuración

### Instancias de Axios

El frontend utiliza dos instancias de Axios configuradas:

1. **`axiosInstance`** (`src/utils/axiosInstance.ts`)
   - Base URL: `http://localhost:8080/api`
   - Timeout: 10000ms
   - Incluye interceptor para agregar token JWT automáticamente

2. **`api`** (`src/services/api.ts`)
   - Base URL: `http://localhost:8080/api`
   - Incluye interceptor para agregar token JWT desde localStorage

### Headers Automáticos

Todas las peticiones incluyen:
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (si el usuario está autenticado)

---

## 📝 Notas Importantes

1. **Fallback Strategy:** La mayoría de los repositorios implementan una estrategia de fallback que intenta usar el backend primero, y si falla, recurre a localStorage o archivos JSON locales.

2. **Autenticación:** Los endpoints de autenticación (`/auth/login` y `/auth/register`) NO tienen fallback. Si el backend no está disponible, fallarán.

3. **RedemptionOrderRepository:** Este es el único repositorio que NO tiene integración con el backend y solo funciona con localStorage.

4. **Endpoints Faltantes:** 
   - No hay endpoint para obtener el usuario actual (`/me` o `/auth/me`)
   - No hay endpoints CRUD completos para productos (solo GET)
   - No hay endpoints CRUD para eventos (solo GET)
   - No hay endpoints CRUD para blogs/noticias (solo GET)
   - No hay endpoints CRUD para reviews (solo GET)

5. **Sincronización de Datos:** El frontend mantiene una copia local de los datos en localStorage y los sincroniza con archivos JSON estáticos cuando el backend no está disponible.

---

## 🚀 Recomendaciones

1. **Implementar endpoints faltantes en el backend:**
   - CRUD completo para productos
   - CRUD completo para eventos
   - CRUD completo para blogs/noticias
   - CRUD completo para reviews
   - CRUD completo para redemptions

2. **Agregar endpoint `/auth/me`** para obtener información del usuario actual autenticado

3. **Estandarizar respuestas de error** del backend para mejorar el manejo de errores en el frontend

4. **Implementar paginación** en endpoints que devuelven listas grandes (users, products, orders, etc.)

5. **Agregar filtros y búsqueda** en los endpoints GET para mejorar el rendimiento
