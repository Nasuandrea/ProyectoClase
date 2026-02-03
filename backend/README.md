# Backend API - PHP

API REST desarrollada en PHP para servir datos en formato JSON a una aplicación frontend JavaScript.

## 📋 Descripción

Este backend actúa como una API que procesa peticiones HTTP, consulta una base de datos MySQL y devuelve los datos en formato JSON para ser consumidos por el frontend.

## 🗂️ Estructura del Proyecto

```
backend/
└── api/
    ├── actualizar_usuario.php
    ├── conexion.php
    ├── eliminar_usuario.php
    ├── enviar_contacto.php
    ├── obtener_categorias.php
    ├── obtener_info.php
    ├── obtener_profesionales.php
    ├── obtener_skills.php
    ├── obtener_usuario.php
    ├── obtener_usuarios.php
    ├── reenviar_contactos.php
    └── registrar_usuario.php
```

## 🚀 Características

- **Formato JSON**: Todas las respuestas se devuelven en formato JSON con UTF-8


1. **Configurar la base de datos**
   
   Edita el archivo `api/conexion.php` con tus credenciales:
   ```php
   $host = "localhost";
   $user = "tu_usuario";
   $password = "tu_contraseña";
   $database = "tu_base_de_datos";
   ```

2. **Estructura de la base de datos**
   
   La API espera las siguientes tablas principales:
   - `users` - Información de usuarios/profesionales
   - `skills` - Habilidades técnicas
   - `categories` - Categorías profesionales
   - `user_skills` - Relación usuario-habilidades
   - `user_categories` - Relación usuario-categorías

## 🔌 Endpoints Disponibles

### 📄 Obtener Usuario

```
GET /api/obtener_usuario.php?id={user_id}
```

**Parámetros:**
- `id` (requerido): ID del usuario

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "ciudad": "Madrid",
    "provincia": "Madrid",
    "modalidad": "Remoto",
    "backend": "PHP, Node.js",
    "frontend": "React, Vue",
    "avatar3D": "url_avatar_3d",
    "avatar2D": "url_avatar_2d",
    "especializacion": "Fullstack Developer",
    "skills": ["PHP", "JavaScript", "MySQL"],
    "categorias": ["Desarrollo Web", "Backend"]
  }
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "error": "Usuario no encontrado"
}
```

### 👥 Obtener Usuarios

```
GET /api/obtener_usuarios.php
```

**Descripción:** Devuelve la lista completa de usuarios registrados.

### 🏷️ Obtener Categorías

```
GET /api/obtener_categorias.php
```

**Descripción:** Devuelve todas las categorías disponibles.

### 💼 Obtener Skills

```
GET /api/obtener_skills.php
```

**Descripción:** Devuelve todas las habilidades técnicas disponibles.

### 👨‍💼 Obtener Profesionales

```
GET /api/obtener_profesionales.php
```

**Descripción:** Devuelve la lista de profesionales con sus datos completos.

### ➕ Registrar Usuario

```
POST /api/registrar_usuario.php
```

**Cuerpo (JSON o FormData):** Datos del usuario a registrar.

### 🔄 Actualizar Usuario

```
POST /api/actualizar_usuario.php
```

**Parámetros:**
- `id` (requerido): ID del usuario
- Otros campos a actualizar

### 🗑️ Eliminar Usuario

```
POST /api/eliminar_usuario.php
```

**Parámetros:**
- `id` (requerido): ID del usuario a eliminar

### 📧 Enviar Contacto

```
POST /api/enviar_contacto.php
```

**Descripción:** Procesa formularios de contacto.

### 📨 Reenviar Contactos

```
POST /api/reenviar_contactos.php
```

**Descripción:** Gestiona el reenvío de mensajes de contacto.

## 📝 Notas de Desarrollo

- Todos los archivos PHP devuelven JSON con codificación UTF-8
- Las respuestas incluyen `JSON_UNESCAPED_UNICODE` para caracteres especiales
- Los arrays vacíos se devuelven como `[]` en lugar de `null`
- Las relaciones many-to-many se gestionan mediante tablas intermedias

## 🐛 Debugging

Para activar mensajes de error en desarrollo, agrega al inicio de tus archivos PHP:

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```
