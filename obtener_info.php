<?php
header('Content-Type: application/json; charset=utf8');
require_once 'conexion.php';

if (!isset($_GET['id'])) {
    echo json_encode([
        "success" => false,
        "error" => "Falta el parámetro id"
    ]);
    exit;
}

$userId = intval($_GET['id']); // seguridad contra inyecciones

$sql = "SELECT 
    u.nombre,
    u.enlaces,
    u.descripcion,
    u.ciudad,
    u.provincia,
    u.modalidad,
    u.backend,
    u.frontend,
    u.avatar3D,
    u.avatar2D,
    u.especializacion,
    GROUP_CONCAT(DISTINCT s.nombre ORDER BY s.nombre SEPARATOR '|') as skills,
    GROUP_CONCAT(DISTINCT c.nombre ORDER BY c.nombre SEPARATOR '|') as categorias
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.id
LEFT JOIN user_categories uc ON u.id = uc.user_id
LEFT JOIN categories c ON uc.category_id = c.id
WHERE u.id = ?
GROUP BY u.id";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $fila = $result->fetch_assoc();
    $fila['skills'] = $fila['skills'] ? explode('|', $fila['skills']) : [];
    $fila['categorias'] = $fila['categorias'] ? explode('|', $fila['categorias']) : [];

    echo json_encode([
        "success" => true,
        "data" => $fila
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Usuario no encontrado"
    ]);
}

$conn->close();
?>