# 📚 Proyecto de Clase

## 🧩 ¿Qué es?

Un **aula virtual de personas simuladas**, presentada en forma de **catálogo**, donde se podrán:

- Visualizar **avatares 3D**
- Realizar **selección de competencias**
- **Contratar servicios**

---

## 🧠 Distribución de Funciones

### 🧭 Control del Proyecto

| Rol              | Persona        | Detalle              |
|------------------|----------------|----------------------|
| 👨‍💼 Controlador (Team Leader) | **Matías**        | Elegido por votación |
| 👩‍🏫 Asesora           | **Andrea**        |                      |

---

### 🔄 Control de Versiones

| Herramienta | Responsable |
|------------|------------|
| GitHub     | **Andrea** |

---

## 🎨 Frontend

### 🎨 Diseño

| Herramienta | Responsables |
|------------|-------------|
| Figma      | **Vane**, **Jona** |

---

### 🎨 Estilos (CSS)

| Responsables |
|-------------|
| **Mat**, **Marta**, **Néstor** |

---

### 🧱 Estructura (HTML)

| Responsables |
|-------------|
| **Alex**, **Marta**, **Carlos** |

---

### ⚙️ Funcionalidad (JavaScript)

| Rol            | Responsables |
|---------------|-------------|
| Principal     | **Mat**     |
| Soporte       | **Isma**, **Andrea** |

---

### 🌐 CMS

| Plataforma | Responsable |
|-----------|------------|
| WordPress | **Néstor** |

---

## 🛠 Backend

### 📦 Recogida y Entrega de Datos  
*(JSON / Node.js)*

| Responsables |
|-------------|
| **Jorge**, **Peterson**, **Andrea** |

---

### 🗄 Base de Datos  
*(MySQL)*

| Responsables |
|-------------|
| **Jorge**, **Peterson**, **Andrea** |

---

### 🕶 Simulación 3D (JavaScript)

| Responsables |
|-------------|
| **Isma**, **Mati** |

---

## 🏷 Nombre del Proyecto

> ✏️ **Nombre del proyecto:**  
> *(Ponerlo acá)*

---

## 🌿 Estructura de Ramas en GitHub

### 🔑 Ramas principales

- `main` → versión estable y lista para entregar.
- `develop` → donde se integra todo lo que se va desarrollando.

---

### 🎨 Ramas por áreas

#### Frontend
- `frontend/html`
- `frontend/css`
- `frontend/js`
- `frontend/figma`

#### Backend
- `backend/api`
- `backend/database`
- `backend/json-node`

#### 🕶 Simulación 3D
- `simulacion/3d-js`

#### 🌐 WordPress
- `wordpress`

---

### ⚙️ Ramas por funcionalidades

- `feature/avatar-3d`
- `feature/catalogo`
- `feature/seleccion-competencias`
- `feature/contratar-servicios`

---

### 🛠 Ramas de soporte

- `docs` → documentación y README.
- `config` → configuraciones del proyecto.
- `hotfix` → correcciones rápidas en producción.

---

## 🔁 Ejemplo de flujo de trabajo

1. Cada persona trabaja en su propia rama:
   - Marta en CSS → `frontend/css`
   - Jorge en base de datos → `backend/database`
   - Isma en 3D → `simulacion/3d-js`

2. Cuando termina una tarea:
   - Se hace un **Pull Request** hacia `develop`.

3. Cuando todo está probado y validado:
   - `develop` se fusiona con `main`.