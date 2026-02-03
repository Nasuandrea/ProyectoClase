<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$skills = [];

$sql = "SELECT id, nombre FROM skills ORDER BY nombre";
$resultado = $conn->query($sql);

if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $skills[] = $fila;
    }
    echo json_encode($skills, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "error" => "Error en la consulta",
        "mysql_error" => $conn->error
    ]);
}

$conn->close();