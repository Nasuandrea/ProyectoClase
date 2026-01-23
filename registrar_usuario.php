<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$nombre      = $_POST['nombre'];
$email       = $_POST['email'];
$ciudad      = $_POST['ciudad'];
$provincia   = $_POST['provincia'];
$modalidad   = $_POST['modalidad'];
$descripcion = $_POST['descripcion'];
$enlaces     = $_POST['enlaces'];

// Password técnico ficticio
$fakePassword = password_hash("autonomix_temp", PASSWORD_BCRYPT);

// Avatares por defecto
$avatar2D = "default2d.png";
$avatar3D = "default3d.glb";

$skills     = array_map('trim', explode(",", $_POST['skills']));
$categorias = array_map('trim', explode(",", $_POST['categorias']));

$conn->begin_transaction();

try {
    // Insertar usuario
    $stmt = $conn->prepare("
        INSERT INTO users 
        (nombre, email, password, enlaces, descripcion, ciudad, provincia, modalidad, avatar2D, avatar3D)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssssssssss",
        $nombre,
        $email,
        $fakePassword,
        $enlaces,
        $descripcion,
        $ciudad,
        $provincia,
        $modalidad,
        $avatar2D,
        $avatar3D
    );

    $stmt->execute();
    $user_id = $stmt->insert_id;

    // Skills
    foreach ($skills as $skill) {
        if ($skill == "") continue;

        $stmt = $conn->prepare("SELECT id FROM skills WHERE nombre = ?");
        $stmt->bind_param("s", $skill);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res->num_rows > 0) {
            $skill_id = $res->fetch_assoc()['id'];
        } else {
            $stmt = $conn->prepare("INSERT INTO skills(nombre) VALUES(?)");
            $stmt->bind_param("s", $skill);
            $stmt->execute();
            $skill_id = $stmt->insert_id;
        }

        $stmt = $conn->prepare("INSERT INTO user_skills(user_id, skill_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $skill_id);
        $stmt->execute();
    }

    // Categorías
    foreach ($categorias as $cat) {
        if ($cat == "") continue;

        $stmt = $conn->prepare("SELECT id FROM categories WHERE nombre = ?");
        $stmt->bind_param("s", $cat);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res->num_rows > 0) {
            $cat_id = $res->fetch_assoc()['id'];
        } else {
            $stmt = $conn->prepare("INSERT INTO categories(nombre) VALUES(?)");
            $stmt->bind_param("s", $cat);
            $stmt->execute();
            $cat_id = $stmt->insert_id;
        }

        $stmt = $conn->prepare("INSERT INTO user_categories(user_id, category_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $cat_id);
        $stmt->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}