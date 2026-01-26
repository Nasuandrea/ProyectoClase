<?php
/**
 * @var mixed
 */
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$categorias = [];

$sql = "SELECT id, nombre FROM categories ORDER BY nombre";
$resultado = $conn->query($sql);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $categorias[] = $fila;
    }
    echo json_encode($categorias, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "error" => "Error en la consulta",
        "mysql_error" => $conn->error
    ]);
}

$conn->close();