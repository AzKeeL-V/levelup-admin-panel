# Uso de axiosInstance y Mock Backend en los Repositorios

Este proyecto está preparado para funcionar tanto con un backend real (API REST) como en modo mock (sin backend, usando localStorage o archivos JSON locales).

## ¿Cómo funciona cada repositorio?
Cada repositorio intenta primero obtener los datos desde un backend real usando `axiosInstance`. Si la petición falla (por ejemplo, porque no hay backend disponible), automáticamente recurre a los datos locales (localStorage o archivos JSON en `/public`).

---

## Ejemplo de flujo en los métodos `findAll`

```ts
try {
  // 1. Intenta obtener los datos desde el backend real
  const response = await axiosInstance.get('/recurso');
  return response.data;
} catch (err) {
  // 2. Si falla, usa localStorage o JSON local
}
// ...código para cargar datos locales...
```

---

## Endpoints simulados por cada repositorio

- **UserRepository**: `/users`
- **ProductRepository**: `/products`
- **ReviewRepository**: `/reviews`
- **EventRepository**: `/events`
- **BlogRepository**: `/blogs`
- **OrderRepository**: `/orders`

> Si no existe backend, la app muestra errores de red en consola pero sigue funcionando con datos mock.

---

## ¿Dónde está configurado axiosInstance?

El archivo `src/utils/axiosInstance.ts` exporta la instancia de axios usada en todos los repositorios. Puedes cambiar la URL base ahí para apuntar a tu backend real cuando lo tengas.

---

## ¿Cómo migrar a backend real?

1. Implementa los endpoints REST en tu backend.
2. Cambia la URL base en `axiosInstance`.
3. ¡Listo! La app automáticamente usará el backend real y dejará de mostrar errores de red.

---

## Notas
- El flujo está documentado en los métodos relevantes de cada repositorio.
- Puedes buscar `axiosInstance` en el código para ver todos los usos.
- Si quieres evitar los errores de red en desarrollo, puedes comentar temporalmente la parte de axios en los métodos `findAll`.

---

> Documentación generada automáticamente por GitHub Copilot (GPT-4.1)
