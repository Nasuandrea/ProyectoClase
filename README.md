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

| Responsables y Soporte|
|-------------|
| **Marta**, **Néstor** , **Daysi**|

---

### 🧱 Estructura (HTML)

| Responsables |
|-------------|
| **Alex**, **Carlos** |

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
| Soporte |
|-------------|
| **Alex** (Fotos) |

---

## 🏷 Nombre del Proyecto

> ✏️ **Nombre del proyecto:**  
> Autonomix

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

---

## 🎮 Experiencia de Usuario (UX) y Funcionamiento de la Plataforma

La página web funciona como un **catálogo interactivo de 12 autónomos**, presentado con una estética inspirada en la **selección de personajes de videojuegos**. El usuario no solo navega por perfiles, sino que “elige” al profesional que mejor encaja con sus necesidades según sus habilidades, categoría y localización.

---

## 🧭 Navegación Principal (Nav Sticky)

En la parte superior se encuentra un **nav fijo (sticky)** que siempre permanece visible:

- 🔍 **Buscador**: permite buscar por:
  - Nombre del autónomo  
  - Skills  
  - Localización (ciudad/provincia)
- 🏷 **Logo** a la izquierda.
- 👤 **Login** a la derecha:
  - Si el usuario no está logueado → aparece el icono de Login.
  - Si está logueado → aparece un pequeño avatar de usuario.

Esto permite una navegación rápida y constante desde cualquier punto de la web.

---

## 🏷 Identidad de la Página

Debajo del nav aparece:
- El **nombre de la plataforma**
- El **slogan**, que refuerza la idea de selección de talento y estilo videojuego.

Ejemplo:
> *Elige tu avatar. Elige sus habilidades. Contrata su talento.*

---

## 🎯 Sistema de Categorías (Filtros)

Debajo del título se muestran las **categorías de servicios**:
- Frontend  
- Backend  
- Diseño  
- 3D  
- etc.

Características:
- Se pueden seleccionar **una o varias categorías**.
- Funcionan como **filtros activos**.
- Al marcar categorías, las tarjetas (cards) se actualizan automáticamente.

---

## 🃏 Catálogo de Cards

Se muestran tarjetas con:
- Imagen representativa de cada autónomo
- Nombre o identificador

Las cards:
- Se filtran según:
  - Categorías seleccionadas
  - Texto introducido en el buscador
- Permiten una vista rápida de todos los profesionales disponibles.

---

## 🦸 Vista de Perfil (Al hacer clic en una Card)

Cuando el usuario hace clic en una tarjeta:

1. La tarjeta seleccionada se **expande**.
2. Aparece una vista detallada:
   - A la izquierda:
     - 🕺 **Avatar 3D animado**
     - Botón de **Contacto** debajo
   - A la derecha:
     - 🧠 Lista de **skills**
     - 📍 **Ubicación** (ciudad / provincia)
     - 🌐 Modalidad del servicio:
       - Presencial
       - Online
       - O ambos

3. Debajo:
   - Aparecen las **otras cards relacionadas**, es decir, las que pasaron el filtro inicial.

Esto mantiene el contexto de búsqueda mientras se explora un perfil concreto.

---

## 📩 Sistema de Contacto

Al pulsar el botón **Contacto**:

- El resto de la página se **desenfoca**.
- Solo quedan visibles:
  - El avatar
  - El panel de información

El panel de skills hace un **efecto flip** y se transforma en un **formulario de contacto**:

Campos del formulario:
- 🧑 Nombre
- 📧 Email
- 📝 Descripción del servicio requerido

Botones:
- 📤 **Enviar**
- 🔙 **Atrás** (vuelve a la vista del perfil)

Esto genera una sensación de experiencia inmersiva y cuidada, muy similar a una interfaz de videojuego.

---

## 👣 Flujo completo del usuario

1. Entra en la web.
2. Usa el buscador o las categorías para filtrar.
3. Visualiza el catálogo de autónomos.
4. Selecciona uno como si fuera un personaje.
5. Examina:
   - Skills
   - Ubicación
   - Modalidad de trabajo
6. Pulsa en **Contacto**.
7. Rellena el formulario.
8. Envía la solicitud de servicio.

---

## 🦶 Footer

Al final de la página:

- A la izquierda:
  - 📜 Texto legal
- A la derecha:
  - Iconos de redes sociales:
    - Facebook
    - Instagram
    - X / Twitter

---

## 🎯 Objetivo de la Experiencia

Crear una experiencia:
- Visualmente atractiva
- Intuitiva
- Inspirada en videojuegos
- Que convierta la selección de un autónomo en algo dinámico y divertido
- Manteniendo una funcionalidad realista de contratación profesional

---

## ⭐ Sistema de Valoración de Autónomos

Cada autónomo contará con un sistema de valoración visible dentro del cuadro de información, junto a sus skills.  
Este sistema mostrará de forma clara y visual la reputación del profesional:

Ejemplo:
> ⭐⭐⭐⭐⚪ (5)

Donde:
- Las estrellas representan la valoración media.
- El número entre paréntesis indica cuántas personas han valorado a ese autónomo.
- Se utilizará una escala de 1 a 5 estrellas.

---

## 📍 Ubicación en la Interfaz

Las valoraciones aparecerán:
- En la vista expandida del autónomo.
- Dentro del panel de información, junto a:
  - Skills
  - Ubicación
  - Modalidad de trabajo (online / presencial)

Esto permite que el usuario:
- Evalúe rápidamente la calidad del servicio.
- Compare varios autónomos de forma visual.
- Tenga una referencia de confianza antes de contactar.

---

## 🎮 Experiencia de Usuario

El sistema refuerza la estética de videojuego:
- Las estrellas funcionan como “nivel” o “poder” del personaje.
- Cuantas más estrellas, más “pro” es el avatar.
- Hace la elección más divertida e intuitiva.

---

## 🗄 Funcionamiento Técnico (resumen)

En base de datos se almacenará:
- Valoración total acumulada.
- Número de valoraciones.

Ejemplo de campos:
- `rating_total`
- `rating_count`

La media se calcula así:
- rating_media = rating_total / rating_count


Y se traduce visualmente en estrellas:

| Media | Visual |
|------|-------|
| 5.0  | ⭐⭐⭐⭐⭐ |
| 4.0  | ⭐⭐⭐⭐⚪ |
| 3.0  | ⭐⭐⭐⚪⚪ |
| 2.0  | ⭐⭐⚪⚪⚪ |
| 1.0  | ⭐⚪⚪⚪⚪ |

---

## 🧠 Objetivo

El sistema de estrellas:
- Aporta realismo a la plataforma.
- Motiva a los usuarios a elegir mejor.
- Refuerza la gamificación del proyecto.
- Hace que el catálogo sea más dinámico y creíble.
