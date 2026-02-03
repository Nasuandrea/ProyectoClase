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

// Skills y categorías
$skills     = array_map('trim', explode(",", $_POST['skills']));
$categorias = array_map('trim', explode(",", $_POST['categorias']));

$conn->begin_transaction();

try {

    /* =========================
       1. SUBIR AVATAR 2D
       ========================= */
    $avatar2D = "avatar.png"; // Avatar por defecto
    
    if (isset($_FILES['avatar2D']) && $_FILES['avatar2D']['error'] === 0) {
        $carpeta = "uploads/avatars/";
        if (!is_dir($carpeta)) {
            mkdir($carpeta, 0777, true);
        }

        $nombreArchivo = uniqid() . "_" . basename($_FILES['avatar2D']['name']);
        $rutaFinal = $carpeta . $nombreArchivo;

        move_uploaded_file($_FILES['avatar2D']['tmp_name'], $rutaFinal);
        $avatar2D = $rutaFinal;
    }

    /* =========================
       2. INSERTAR USUARIO
       ========================= */
    $stmt = $conn->prepare("
        INSERT INTO users 
        (nombre, email, password, enlaces, descripcion, ciudad, provincia, modalidad, avatar2D)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssssssss",
        $nombre,
        $email,
        $fakePassword,
        $enlaces,
        $descripcion,
        $ciudad,
        $provincia,
        $modalidad,
        $avatar2D
    );

    $stmt->execute();
    $user_id = $stmt->insert_id;

    /* =========================
       3. SKILLS
       ========================= */
    foreach ($skills as $skill) {
        if ($skill == "") continue;

        // Buscar si existe
        $stmt = $conn->prepare("SELECT id FROM skills WHERE nombre = ?");
        $stmt->bind_param("s", $skill);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res->num_rows > 0) {
            $skill_id = $res->fetch_assoc()['id'];
        } else {
            // Crear skill nueva
            $stmt = $conn->prepare("INSERT INTO skills(nombre) VALUES(?)");
            $stmt->bind_param("s", $skill);
            $stmt->execute();
            $skill_id = $stmt->insert_id;
        }

        // Relación usuario-skill
        $stmt = $conn->prepare("INSERT INTO user_skills(user_id, skill_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $skill_id);
        $stmt->execute();
    }

    /* =========================
       4. CATEGORÍAS
       ========================= */
    foreach ($categorias as $cat) {
        if ($cat == "") continue;

        // Buscar si existe
        $stmt = $conn->prepare("SELECT id FROM categories WHERE nombre = ?");
        $stmt->bind_param("s", $cat);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res->num_rows > 0) {
            $cat_id = $res->fetch_assoc()['id'];
        } else {
            // Crear categoría nueva
            $stmt = $conn->prepare("INSERT INTO categories(nombre) VALUES(?)");
            $stmt->bind_param("s", $cat);
            $stmt->execute();
            $cat_id = $stmt->insert_id;
        }

        // Relación usuario-categoría
        $stmt = $conn->prepare("INSERT INTO user_categories(user_id, category_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $cat_id);
        $stmt->execute();
    }

    /* =========================
       5. COMMIT
       ========================= */
    $conn->commit();

    echo json_encode([
        "success" => true,
        "user_id" => $user_id,
        "avatar"  => $avatar2D
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
