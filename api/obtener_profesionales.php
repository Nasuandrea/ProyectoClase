<?php
/**
 * OBTENER_PROFESIONALES.PHP
 * Lista todos los profesionales registrados en la base de datos
 */

header('Content-Type: application/json; charset=utf8');
require_once 'conexion.php';

$sql = "SELECT 
    u.id,
    u.nombre,
    u.email,
    u.ciudad,
    u.provincia,
    u.especializacion,
    u.avatar2D,
    u.avatar3D
FROM users u
ORDER BY u.nombre ASC
LIMIT 100";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $profesionales = [];
    
    while ($fila = $result->fetch_assoc()) {
        $profesionales[] = [
            'id' => (int)$fila['id'],
            'nombre' => $fila['nombre'],
            'email' => $fila['email'],
            'ciudad' => $fila['ciudad'],
            'provincia' => $fila['provincia'],
            'especializacion' => $fila['especializacion'],
            'avatar2D' => $fila['avatar2D'],
            'avatar3D' => $fila['avatar3D']
        ];
    }
    
    echo json_encode([
        "success" => true,
        "data" => $profesionales,
        "total" => count($profesionales)
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "success" => false,
        "error" => "No hay profesionales registrados",
        "data" => []
    ]);
}

$conn->close();
?>
