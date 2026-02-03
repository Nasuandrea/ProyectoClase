<?php
/*
$host = "localhost";
$user = "root";
$pass = "";
$db   = "autonomix";
$port = 3306;
*/

$host = "sql7.freesqldatabase.com";
$user = "sql7815048";
$pass = "F7k37eg2fG";
$db   = "sql7815048";
$port = 3306;


$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "error" => "Error de conexión"
    ]));
}

$conn->set_charset("utf8mb4");
?>