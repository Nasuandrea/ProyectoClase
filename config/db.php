<?php
$host = "fdb1034.awardspace.net";
$user = "4728012_jorge";
$pass = "5_'5gK$V--?*'qy";
$db   = "4728012_jorge";
$port = 3306;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// echo "Conexión exitosa";
?>