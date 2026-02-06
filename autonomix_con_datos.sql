-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 06-02-2026 a las 12:14:03
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `autonomix`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `nombre`) VALUES
(13, 'API\'s & Integraciones'),
(14, 'Backend'),
(15, 'DevOps'),
(16, 'Diseño Web'),
(17, 'E-Comerce'),
(18, 'Frontend'),
(19, 'Fullstack'),
(20, 'HTML/CSS'),
(21, 'Optimización Web'),
(22, 'Seguridad Web'),
(23, 'SEO'),
(24, 'UX/UI'),
(25, 'WordPress');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `nombre_cliente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_cliente` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `skills`
--

DROP TABLE IF EXISTS `skills`;
CREATE TABLE IF NOT EXISTS `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `skills`
--

INSERT INTO `skills` (`id`, `nombre`) VALUES
(33, 'Adobe XD'),
(31, 'Angular'),
(18, 'Bootstrap'),
(27, 'Docker'),
(17, 'Figma'),
(28, 'Git'),
(16, 'Java'),
(19, 'JavaScript'),
(14, 'Laravel'),
(32, 'MongoDB'),
(25, 'MySQL'),
(23, 'Node.js'),
(15, 'PHP'),
(26, 'PostgreSQL'),
(24, 'Python'),
(21, 'React'),
(29, 'Spring Boot'),
(30, 'Tailwind CSS'),
(20, 'TypeScript'),
(22, 'Vue.js');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `enlaces` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ciudad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modalidad` enum('presencial','online','mixto') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'online',
  `backend` enum('0','1','2','3','4','5') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `frontend` enum('0','1','2','3','4','5') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `avatar3D` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar2D` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `especializacion` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `password`, `enlaces`, `descripcion`, `ciudad`, `provincia`, `modalidad`, `backend`, `frontend`, `avatar3D`, `avatar2D`, `created_at`, `especializacion`) VALUES
(2, 'Matias Iparraguirre', 'matias@demo.com', '1234', '', 'Frontend, especializado en JavaScript, UX/UI, CSS, HTML', 'Vigo', 'Pontevedra', 'mixto', '0', '4', NULL, 'https://profeweb.xo.je/avatars/Mati.png', '2026-01-22 12:04:10', 'Frontend, JavaScript, CSS, HTML, Figma'),
(6, 'Vanesa Rodal', 'Vanesa@demo.com', '1234', '', 'Diseño web, Figma', 'Vigo', 'Pontevedra', 'mixto', '0', '4', NULL, 'https://profeweb.xo.je/avatars/Vane.png', '2026-01-22 12:04:10', 'https://profeweb.xo.je/avatars/Isma.png'),
(7, 'Ismail Kirfah', 'Isma@demo.com', '1234', '', 'Frontend, Diseño 3D, JS', 'Vigo', 'Pontevedra', 'online', '1', '4', NULL, 'https://profeweb.xo.je/avatars/Isma_1.png', '2026-01-22 12:04:10', 'Diseño 3D, JavaScript, JS, Frontend'),
(10, 'Marta Fernández', 'marta@demo.com', '1234', '', 'CSS HTML', 'Vigo', 'Pontevedra', 'mixto', '0', '4', NULL, 'https://profeweb.xo.je/avatars/Marta.png', '2026-01-22 12:04:10', 'CSS HTML'),
(17, 'Jorge Brea', 'jorge@demo.com', '$2y$10$jyLjgn9CR93lJ16goMMkZ.FfpZL58mdfUWsyAbMf27IWTn.8vtC.u', 'https://www.linkedin.com/', 'Desarrollador web proactivo', 'Vigo', 'Pontevedra', 'mixto', '4', '1', 'default3d.glb', 'https://profeweb.xo.je/avatars/Jorge.png', '2026-01-26 12:56:01', 'Backend, Bases de datos'),
(18, 'Peter Sepulveda', 'peter@gmail.com', '$2y$10$iP.gTlz2pBc65o.2v/vXn.3In6pHcluI4C8vcj8vwjjMuayc25MpC', 'sfsdfsd', '', 'Villagarcía De Arosa', 'Pontevedra', 'presencial', '3', '1', 'default3d.glb', 'https://profeweb.xo.je/avatars/Peter.png', '2026-01-26 12:57:44', 'Backend, Bases de datos, API'),
(20, 'Andrea Collazo', 'acollazocacho@gmail.com', '$2y$10$ZcRYgDSLseQv1PBfFjG4o.AjltLAnsB9gL/oDvlFpngBNbPDe1BXa', 'https://www.linkedin.com/', 'Programadora Backend, API, Spring, Microservicios', 'Vigo', 'Pontevedra', 'online', '3', '1', NULL, 'https://profeweb.xo.je/avatars/Andrea.png', '2026-01-28 09:43:54', 'Backend, Bases de datos'),
(21, 'Jona Dieguez', 'jona@demo.es', '$2y$10$BnUnAr6ZHN6AfNvFcTqra.GDZZheWhAruIRkCYe1jT6MhqzUbVa1q', 'https://www.linkedin.com/', 'Diseño web, Figma, Frontend', 'Vigo', 'Pontevedra', 'online', '1', '4', NULL, 'https://profeweb.xo.je/avatars/Xona.png', '2026-02-04 10:05:26', 'Diseño, Frontend, HTML, CSS'),
(22, 'Nestor Bamio', 'nestor@demo.es', '$2y$10$naaN5pTN9JOgpA9wu1lweOrClV4c7nM3E.t8sVKPNToT/G72DM7tC', 'https://www.linkedin.com/', 'Frontend, experiencia de usuario (UX/UI), WordPress, HTML, CSS', 'Vigo', 'Pontevedra', 'online', '1', '4', NULL, 'https://profeweb.xo.je/avatars/Nestor.png', '2026-02-04 10:07:00', 'HTML, CSS, WordPress'),
(23, 'Carlos Jácome', 'carlos@demo.com', '$2y$10$vhoguYLDkLATitgRK89RcOaHXTR2x3SdD8l7waUy7viuYqH7Xbwmm', 'https://www.linkedin.com/', 'HTML, CSS, Diseño', 'Vigo', 'Pontevedra', 'mixto', '0', '3', NULL, 'https://profeweb.xo.je/avatars/Carlos.png', '2026-02-04 11:10:40', 'Frontend, CSS, HTML'),
(24, 'Alex Fernandez', 'alex@demo.es', '$2y$10$dQqJDaDHV3ggCdhqbLxJBufpQe2QjRodF6gm3Y/FzaSH4228LMN42', 'https://www.linkedin.com/', 'HTML, CSS, Diseño web, Desarrollo, Frontend', 'Vigo', 'Pontevedra', 'online', '1', '4', NULL, 'https://profeweb.xo.je/avatars/Alex.png', '2026-02-04 11:12:32', 'Frontend, CSS, HTML, UX/UI'),
(25, 'W-Daysi Teacher', 'daysi@demo.es', '$2y$10$dQqJDaDHV3ggCdhqbLxJBufpQe2QjRodF6gm3Y/FzaSH4228LMN42', 'https://www.linkedin.com/', 'Para todo lo demas', 'Celanova', 'Ourense', 'mixto', '4', '4', NULL, 'https://profeweb.xo.je/avatars/Daysi.png', '2026-02-04 11:12:32', 'Frontend, CSS, HTML, UX/UI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_categories`
--

DROP TABLE IF EXISTS `user_categories`;
CREATE TABLE IF NOT EXISTS `user_categories` (
  `user_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_skills`
--

DROP TABLE IF EXISTS `user_skills`;
CREATE TABLE IF NOT EXISTS `user_skills` (
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
