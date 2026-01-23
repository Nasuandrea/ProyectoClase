CREATE DATABASE autonomix;
USE autonomix;

-- =========================
-- USUARIOS (AUTÓNOMOS)
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enlaces VARCHAR(500) NOT NULL,
    descripcion TEXT,
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    modalidad ENUM('presencial', 'online', 'mixto') DEFAULT 'online',
    avatar3D VARCHAR(255), -- ruta o nombre del avatar 3D asignado
    avatar2D VARCHAR(255), 
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