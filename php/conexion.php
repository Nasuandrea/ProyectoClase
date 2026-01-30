<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "isma_avatar";
$port = 3306;

/**Host: sql7.freesqldatabase.com
Database name: sql7815048
Database user: sql7815048
Database password: F7k37eg2fG
Port number: 3306*/

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "error" => "Error de conexión"
    ]));
}

$conn->set_charset("utf8mb4");
?>