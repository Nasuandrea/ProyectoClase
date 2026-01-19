CREATE DATABASE skillarena;
USE skillarena;

-- =========================
-- USUARIOS (AUTÓNOMOS)
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    modalidad ENUM('presencial', 'online', 'mixto') DEFAULT 'online',
    avatar VARCHAR(255), -- ruta o nombre del avatar 3D asignado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORÍAS (Backend, Frontend, Diseño, etc.)
-- =========================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- =========================
-- SKILLS
-- =========================
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- =========================
-- RELACIÓN USUARIOS - CATEGORÍAS (Muchos a Muchos)
-- =========================
CREATE TABLE user_categories (
    user_id INT,
    category_id INT,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =========================
-- RELACIÓN USUARIOS - SKILLS (Muchos a Muchos)
-- =========================
CREATE TABLE user_skills (
    user_id INT,
    skill_id INT,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- =========================
-- SISTEMA DE VALORACIÓN
-- =========================
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- FORMULARIO DE CONTACTO
-- =========================
CREATE TABLE contact_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- autónomo contactado
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
Y conceptualmente tu base queda así:

USERS
 ├── USER_CATEGORIES ── CATEGORIES
 ├── USER_SKILLS ────── SKILLS
 ├── RATINGS
 └── CONTACT_REQUESTS
Con esto ya puedes:

Mostrar el catálogo de autónomos.

Filtrar por categorías.

Filtrar por skills.

Buscar por nombre o localización.

Mostrar estrellas:

Media = AVG(rating)

Total valoraciones = COUNT(*)

Gestionar login.

Gestionar contacto.

Asociar avatares 3D fijos.