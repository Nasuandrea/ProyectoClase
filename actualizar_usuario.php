<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
header('Content-Type: application/json; charset=utf-8');

ob_start();

try {
    require_once 'conexion.php';
    
    $required_fields = ['id', 'nombre', 'email', 'ciudad', 'provincia', 'modalidad', 'descripcion', 'especializacion', 'enlaces', 'backend', 'frontend'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field])) throw new Exception("Falta el campo: $field");
    }

    $id = intval($_POST['id']);
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $ciudad = trim($_POST['ciudad']);
    $provincia = trim($_POST['provincia']);
    $modalidad = trim($_POST['modalidad']);
    $descripcion = trim($_POST['descripcion']);
    $especializacion = trim($_POST['especializacion']);
    $enlaces = trim($_POST['enlaces']);
    // Tratamos niveles como string por el tipo ENUM de la BD
    $backend = strval($_POST['backend']);
    $frontend = strval($_POST['frontend']);

    if ($id <= 0) throw new Exception("ID de usuario inválido");

    $avatar2D = null;
    if (isset($_FILES['avatar2D']) && $_FILES['avatar2D']['error'] === 0) {
        $carpeta = "uploads/avatars/";
        if (!is_dir($carpeta)) mkdir($carpeta, 0777, true);

        $nombreArchivo = uniqid() . "_" . basename($_FILES['avatar2D']['name']);
        $rutaFinal = $carpeta . $nombreArchivo;
        
        if (move_uploaded_file($_FILES['avatar2D']['tmp_name'], $rutaFinal)) {
            $avatar2D = $rutaFinal;
        }
    }

    // Construcción dinámica de la SQL
    $sql = "UPDATE users SET nombre=?, email=?, ciudad=?, provincia=?, modalidad=?, descripcion=?, especializacion=?, enlaces=?, backend=?, frontend=?";
    if ($avatar2D) $sql .= ", avatar2D=?";
    $sql .= " WHERE id=?";

    $stmt = $conn->prepare($sql);
    
    if ($avatar2D) {
        $stmt->bind_param("sssssssssssi", $nombre, $email, $ciudad, $provincia, $modalidad, $descripcion, $especializacion, $enlaces, $backend, $frontend, $avatar2D, $id);
    } else {
        $stmt->bind_param("ssssssssssi", $nombre, $email, $ciudad, $provincia, $modalidad, $descripcion, $especializacion, $enlaces, $backend, $frontend, $id);
    }

    if (!$stmt->execute()) throw new Exception("Error al actualizar: " . $stmt->error);
    $stmt->close();

    // Actualizar Relaciones (Skills y Categorías)
    actualizarRelaciones($conn, $id, 'user_skills', 'skill_id', 'skills', $_POST['skills'] ?? '');
    actualizarRelaciones($conn, $id, 'user_categories', 'category_id', 'categories', $_POST['categorias'] ?? '');

    ob_end_clean();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

// Función auxiliar para evitar repetir código de borrado/inserción
function actualizarRelaciones($conn, $userId, $tablaRel, $colId, $tablaMaestra, $datosCsv) {
    $conn->query("DELETE FROM $tablaRel WHERE user_id = $userId");
    if (empty($datosCsv)) return;

    $items = explode(',', $datosCsv);
    foreach ($items as $nombre) {
        $nombre = trim($nombre);
        $stmt = $conn->prepare("SELECT id FROM $tablaMaestra WHERE nombre = ?");
        $stmt->bind_param("s", $nombre);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($row = $res->fetch_assoc()) {
            $itemId = $row['id'];
            $ins = $conn->prepare("INSERT INTO $tablaRel (user_id, $colId) VALUES (?, ?)");
            $ins->bind_param("ii", $userId, $itemId);
            $ins->execute();
            $ins->close();
        }
        $stmt->close();
    }
}
?>