<?php
/**
 * @var mixed
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Solo para desarrollo

// Incluir la conexión
require_once 'conexion.php';

// Consulta a tu tabla (cambia "tu_tabla" por el nombre real)
$sql = "SELECT * FROM tu_tabla";
$resultado = $conn->query($sql);

$datos = array(); 

if ($resultado) {
    if ($resultado->num_rows > 0) {
        while($fila = $resultado->fetch_assoc()) {
            $datos[] = $fila;
        }
        
        echo json_encode([
            "success" => true,
            "data" => $datos,
            "total" => count($datos)
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "data" => [],
            "mensaje" => "No hay datos disponibles"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "error" => "Error en la consulta: " . $conn->error
    ]);
}

$conn->close();
?>