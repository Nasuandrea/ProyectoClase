<?php
// Preparamos el entorno para asegurar que la salida sea JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 

// Desactivamos la visualización de errores de PHP para evitar que se mezcle con el JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Establecemos un manejador de errores personalizado
// Esto convierte los errores de PHP (notices, warnings) en excepciones que podemos capturar
set_error_handler(function($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        // Este error no está incluido en error_reporting
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    require_once 'conexion.php';

    $sql = "
        SELECT 
            u.id, u.nombre, u.sexo, u.email, u.enlaces, u.descripcion,
            u.ciudad, u.provincia, u.modalidad, u.avatar2D, u.avatar3D,
            GROUP_CONCAT(DISTINCT s.nombre SEPARATOR ',') as skills,
            GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ',') as categorias
        FROM users u
        LEFT JOIN user_skills us ON u.id = us.user_id
        LEFT JOIN skills s ON us.skill_id = s.id
        LEFT JOIN user_categories uc ON u.id = uc.user_id
        LEFT JOIN categories c ON uc.category_id = c.id
        GROUP BY u.id
    ";

    $resultado = $conn->query($sql);

    if ($resultado === false) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $users = [];
    while ($fila = $resultado->fetch_assoc()) {
        // Lógica para el avatar por defecto
        if (empty($fila['avatar2D']) || $fila['avatar2D'] === 'avatar.png') {
            // Usamos el operador de coalescencia nula para evitar errores con valores NULL
            $sexo_limpio = preg_replace('/[\s\p{Cf}]/u', '', strtolower($fila['sexo'] ?? ''));

            // Por defecto, asignamos el de mujer
            $fila['avatar2D'] = 'uploads/avatars/default_avatar_mujer.png';
            
            // Si el sexo es 'hombre' o 'm', asignamos el avatar de hombre
            if (in_array($sexo_limpio, ['hombre', 'm'])) {
                $fila['avatar2D'] = 'uploads/avatars/default_avatar.png';
            }
        }

        // EXCEPCIÓN: Forzar el avatar para Andrea López (se mantiene por si acaso)
        if ($fila['nombre'] === 'Andrea López') {
            $fila['avatar2D'] = 'uploads/avatars/default_avatar_mujer.png';
        }

        // Conversión de strings a arrays
        $fila['skills'] = !empty($fila['skills']) ? explode(',', $fila['skills']) : [];
        $fila['categorias'] = !empty($fila['categorias']) ? explode(',', $fila['categorias']) : [];
        
        $users[] = $fila;
    }

    echo json_encode([
        "success" => true,
        "data" => $users
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    // Capturamos cualquier error o excepción (Throwable es la base para ambos)
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "success" => false,
        "error" => "Se ha producido un error en el servidor.",
        "error_details" => [
            "message" => $e->getMessage(),
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]
    ]);
} finally {
    // Nos aseguramos de cerrar la conexión si existe
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>