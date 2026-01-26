<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Incluir la conexión
require_once 'conexion.php';

// Consulta para obtener usuarios con sus skills y categorías
$sql = "SELECT 
    u.id,
    u.nombre,
    u.email,
    u.enlaces,
    u.descripcion,
    u.ciudad,
    u.provincia,
    u.modalidad,
    u.backend,
    u.frontend,
    u.avatar2D,
    GROUP_CONCAT(DISTINCT s.nombre ORDER BY s.nombre SEPARATOR '|') as skills,
    GROUP_CONCAT(DISTINCT c.nombre ORDER BY c.nombre SEPARATOR '|') as categorias
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.id
LEFT JOIN user_categories uc ON u.id = uc.user_id
LEFT JOIN categories c ON uc.category_id = c.id
GROUP BY u.id
ORDER BY u.nombre";

$resultado = $conn->query($sql);

$usuarios = array();

if ($resultado) {
    if ($resultado->num_rows > 0) {
        while($fila = $resultado->fetch_assoc()) {
            // Convertir los strings separados por | en arrays
            $fila['skills'] = $fila['skills'] ? explode('|', $fila['skills']) : [];
            $fila['categorias'] = $fila['categorias'] ? explode('|', $fila['categorias']) : [];
            
            $usuarios[] = $fila;
        }
        
        echo json_encode([
            "success" => true,
            "data" => $usuarios,
            "total" => count($usuarios)
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "success" => true,
            "data" => [],
            "mensaje" => "No hay usuarios disponibles"
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode([
        "success" => false,
        "error" => "Error en la consulta: " . $conn->error
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>