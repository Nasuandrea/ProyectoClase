<?php
require_once("../config/db.php");

$sql = "SELECT id, nombre, descripcion, ciudad, modalidad, avatar2D 
        FROM users ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));