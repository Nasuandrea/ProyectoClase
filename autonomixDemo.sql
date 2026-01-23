-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 22-01-2026 a las 11:28:32
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
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `nombre`) VALUES
(1, 'Frontend'),
(2, 'Backend'),
(3, 'Fullstack'),
(4, 'Diseño Web'),
(5, 'UX/UI'),
(6, 'E-commerce'),
(7, 'WordPress'),
(8, 'SEO'),
(9, 'APIs & Integraciones'),
(10, 'Optimización Web'),
(11, 'Seguridad Web'),
(12, 'DevOps');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nombre_cliente` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_cliente` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `skills`
--

DROP TABLE IF EXISTS `skills`;
CREATE TABLE IF NOT EXISTS `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `skills`
--

INSERT INTO `skills` (`id`, `nombre`) VALUES
(1, 'HTML'),
(2, 'CSS'),
(3, 'JavaScript'),
(4, 'PHP'),
(5, 'MySQL'),
(6, 'Laravel'),
(7, 'React'),
(8, 'Vue.js'),
(9, 'WordPress'),
(10, 'Node.js');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enlaces` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `ciudad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modalidad` enum('presencial','online','mixto') COLLATE utf8mb4_unicode_ci DEFAULT 'online',
  `avatar3D` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar2D` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `password`, `enlaces`, `descripcion`, `ciudad`, `provincia`, `modalidad`, `avatar3D`, `avatar2D`, `created_at`) VALUES
(1, 'Ana López', 'ana@demo.com', '1234', 'https://portfolio-ana.com', 'Frontend especializada en React', 'Madrid', 'Madrid', 'online', NULL, 'avatar1.png', '2026-01-22 11:27:15'),
(2, 'Carlos Ruiz', 'carlos@demo.com', '1234', 'https://carlosdev.com', 'Backend PHP y MySQL', 'Barcelona', 'Barcelona', 'mixto', NULL, 'avatar2.png', '2026-01-22 11:27:15'),
(3, 'Lucía Gómez', 'lucia@demo.com', '1234', 'https://luciaweb.com', 'Diseño web y UX', 'Valencia', 'Valencia', 'online', NULL, 'avatar3.png', '2026-01-22 11:27:15'),
(4, 'Miguel Torres', 'miguel@demo.com', '1234', 'https://migueldev.com', 'Fullstack JS', 'Sevilla', 'Sevilla', 'presencial', NULL, 'avatar4.png', '2026-01-22 11:27:15'),
(5, 'Sofía Martín', 'sofia@demo.com', '1234', 'https://sofiamartin.dev', 'WordPress profesional', 'Bilbao', 'Vizcaya', 'online', NULL, 'avatar5.png', '2026-01-22 11:27:15'),
(6, 'Javier Pérez', 'javier@demo.com', '1234', 'https://javier.dev', 'Laravel avanzado', 'Madrid', 'Madrid', 'mixto', NULL, 'avatar6.png', '2026-01-22 11:27:15'),
(7, 'Laura Sánchez', 'laura@demo.com', '1234', 'https://lauraui.com', 'UI Frontend', 'Zaragoza', 'Zaragoza', 'online', NULL, 'avatar7.png', '2026-01-22 11:27:15'),
(8, 'Daniel Romero', 'daniel@demo.com', '1234', 'https://danielbackend.com', 'APIs REST', 'Málaga', 'Málaga', 'online', NULL, 'avatar8.png', '2026-01-22 11:27:15'),
(9, 'Paula Navarro', 'paula@demo.com', '1234', 'https://pauladesign.com', 'Diseño y maquetación', 'Murcia', 'Murcia', 'online', NULL, 'avatar9.png', '2026-01-22 11:27:15'),
(10, 'Iván Molina', 'ivan@demo.com', '1234', 'https://ivanjs.dev', 'React y Node', 'Alicante', 'Alicante', 'mixto', NULL, 'avatar10.png', '2026-01-22 11:27:15'),
(11, 'Elena Cruz', 'elena@demo.com', '1234', 'https://elenacode.com', 'Fullstack PHP', 'Salamanca', 'Salamanca', 'online', NULL, 'avatar11.png', '2026-01-22 11:27:15'),
(12, 'Sergio Vega', 'sergio@demo.com', '1234', 'https://sergioweb.dev', 'SEO técnico', 'Granada', 'Granada', 'online', NULL, 'avatar12.png', '2026-01-22 11:27:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_categories`
--

DROP TABLE IF EXISTS `user_categories`;
CREATE TABLE IF NOT EXISTS `user_categories` (
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`category_id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_categories`
--

INSERT INTO `user_categories` (`user_id`, `category_id`) VALUES
(1, 1),
(2, 2),
(3, 4),
(4, 3),
(5, 4),
(6, 2),
(7, 1),
(8, 2),
(9, 4),
(10, 3),
(11, 3),
(12, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_skills`
--

DROP TABLE IF EXISTS `user_skills`;
CREATE TABLE IF NOT EXISTS `user_skills` (
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`skill_id`),
  KEY `skill_id` (`skill_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_skills`
--

INSERT INTO `user_skills` (`user_id`, `skill_id`) VALUES
(1, 1),
(1, 3),
(1, 7),
(2, 4),
(2, 5),
(3, 1),
(3, 2),
(4, 3),
(4, 10),
(5, 9),
(6, 6),
(7, 1),
(7, 2),
(8, 4),
(8, 5),
(9, 1),
(9, 2),
(10, 3),
(10, 10),
(11, 4),
(11, 5),
(12, 6);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
