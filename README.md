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

## 🔁 Ejemplo de flujo de trabajo

1. Cada persona trabaja en su propia rama:
   - Marta en CSS → `frontend/css`
   - Jorge en base de datos → `backend/database`
   - Isma en 3D → `simulacion/3d-js`

2. Cuando termina una tarea:
   - Se hace un **Pull Request** hacia `develop`.

3. Cuando todo está probado y validado:
   - `develop` se fusiona con `main`.

---

## 🌐 Descripción de la Web

La web será una **Landing Page** donde se mostrará un **catálogo de avatares 3D** que representan a personas simuladas.

Cada avatar incluirá:
- 👤 Imagen/Modelo en **3D**
- 📄 Datos personales básicos
- 🧠 Competencias y habilidades
- 🏷 Especialidad o rol

Los avatares aparecerán organizados en forma de **catálogo visual**, permitiendo al usuario:
- Navegar entre los diferentes perfiles
- Ver la información de cada uno
- Comparar competencias

---

## 🛒 Sistema de Contratación

Cuando el usuario seleccione un avatar y pulse en **“Contratar”**, se mostrará un **formulario de contratación** que incluirá:

- 📝 Nombre del contratante  
- 📧 Email de contacto  
- 📞 Teléfono  
- 📌 Servicio requerido  
- 📅 Fecha o duración del servicio  
- 💬 Observaciones adicionales  

Este formulario permitirá simular la contratación de los servicios ofrecidos por el avatar seleccionado.

---

## 🎯 Objetivo

Crear una experiencia interactiva que combine:
- Diseño atractivo
- Modelos 3D
- Catálogo de perfiles
- Simulación realista de contratación de servicios

---

## 🔐 Sistema de Inicio de Sesión

La web contará con un **sistema de inicio de sesión** para que cada usuario pueda acceder a su perfil personal y gestionar su información.

Una vez autenticado, el usuario podrá:

- ✏️ Editar sus **datos personales**
- 🧠 Modificar y actualizar sus **competencias**
- 🏷 Cambiar su especialidad o rol
- 📄 Revisar cómo aparece su perfil dentro del catálogo

> ⚠️ Los avatares 3D serán fijos.  
> El usuario **no podrá personalizar ni modificar el avatar**, solo la información y las competencias asociadas a él.

---

## 👤 Perfil de Usuario

Cada usuario tendrá un panel privado donde podrá gestionar:

- Nombre
- Email
- Descripción personal
- Lista de competencias
- Servicios que ofrece
- Información visible en el catálogo

---
ARBOL
WEB AULA VIRTUAL
│
├── 🟢 ZONA PÚBLICA (Accesible por todos)
│   ├── 🏠 Home (Landing Page)
│   │   ├── Hero (Gancho + Demo 3D)
│   │   └── Destacados
│   │
│   ├── 📂 Catálogo (La página principal)
│   │   ├── Sidebar (Filtros: HTML, CSS, Rol...)
│   │   └── Grid (Tarjetas de Trabajadores)
│   │
│   ├── 👤 Ficha de Detalle (Perfil público)
│   │   ├── Visor 3D (Interactivo)
│   │   ├── Datos y Gráfica de Skills
│   │   └── Botón "Contratar"
│   │
│   └── 🔐 Login / Registro
│       ├── Formulario Acceso
│       └── Formulario Registro (Selector: ¿Cliente o Trabajador?)
│
└── 🔴 ZONA PRIVADA (Requiere Login)
    │
    ├── 🛠 Dashboard Trabajador (Backoffice)
    │   ├── Edición de Datos Personales
    │   ├── Configuración Avatar 3D
    │   └── Switch "Disponible/No Disponible"
    │
    └── 🛍️ Dashboard Cliente (Área Personal)
        ├── Historial de Contrataciones
        └── Estado de pedidos

