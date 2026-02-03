<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
header('Content-Type: application/json; charset=utf-8');

ob_start();

try {
    require_once 'conexion.php';
    
    $id = intval($_POST['id'] ?? 0);
    if ($id <= 0) throw new Exception("ID de usuario inválido");

    // 1. Obtener el avatar actual para borrarlo después si se cambia
    $stmtOld = $conn->prepare("SELECT avatar2D FROM users WHERE id = ?");
    $stmtOld->bind_param("i", $id);
    $stmtOld->execute();
    $resOld = $stmtOld->get_result();
    $userOld = $resOld->fetch_assoc();
    $stmtOld->close();

    // 2. Procesar el nuevo avatar
    $avatar2D = null;
    if (isset($_FILES['avatar2D']) && $_FILES['avatar2D']['error'] === 0) {
        $carpeta = "uploads/avatars/";
        if (!is_dir($carpeta)) mkdir($carpeta, 0777, true);

        $ext = pathinfo($_FILES['avatar2D']['name'], PATHINFO_EXTENSION);
        $nombreArchivo = uniqid() . "_avatar." . $ext;
        $rutaFinal = $carpeta . $nombreArchivo;
        
        if (move_uploaded_file($_FILES['avatar2D']['tmp_name'], $rutaFinal)) {
            $avatar2D = $rutaFinal;
            
            // BORRADO DEL ARCHIVO ANTIGUO: si existe y no es el mismo, se elimina del disco
            if (!empty($userOld['avatar2D']) && file_exists($userOld['avatar2D'])) {
                unlink($userOld['avatar2D']);
            }
        }
    }

    // 3. Preparar datos y SQL
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $ciudad = trim($_POST['ciudad']);
    $provincia = trim($_POST['provincia']);
    $modalidad = trim($_POST['modalidad']);
    $descripcion = trim($_POST['descripcion']);
    $especializacion = trim($_POST['especializacion']);
    $enlaces = trim($_POST['enlaces']);
    $backend = strval($_POST['backend']);
    $frontend = strval($_POST['frontend']);

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

    // 4. Actualizar Relaciones
    actualizarRelaciones($conn, $id, 'user_skills', 'skill_id', 'skills', $_POST['skills'] ?? '');
    actualizarRelaciones($conn, $id, 'user_categories', 'category_id', 'categories', $_POST['categorias'] ?? '');

    ob_end_clean();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

function actualizarRelaciones($conn, $userId, $tablaRel, $colId, $tablaMaestra, $datosCsv) {
    // 1. Limpiar relaciones anteriores
    $stmtDel = $conn->prepare("DELETE FROM $tablaRel WHERE user_id = ?");
    $stmtDel->bind_param("i", $userId);
    $stmtDel->execute();
    $stmtDel->close();

    if (empty($datosCsv)) return;

    $items = explode(',', $datosCsv);
    foreach ($items as $nombre) {
        $nombre = trim($nombre);
        if (empty($nombre)) continue;

        // 2. Buscar si el item existe en la tabla maestra
        $stmt = $conn->prepare("SELECT id FROM $tablaMaestra WHERE nombre = ?");
        $stmt->bind_param("s", $nombre);
        $stmt->execute();
        $res = $stmt->get_result();
        
        if ($row = $res->fetch_assoc()) {
            $itemId = $row['id'];
        } else {
            // 3. Si NO existe y es la tabla de SKILLS, la creamos dinámicamente
            if ($tablaMaestra === 'skills') {
                $stmtInsMaster = $conn->prepare("INSERT INTO skills (nombre) VALUES (?)");
                $stmtInsMaster->bind_param("s", $nombre);
                $stmtInsMaster->execute();
                $itemId = $stmtInsMaster->insert_id;
                $stmtInsMaster->close();
            } else {
                $stmt->close();
                continue; // Si es categoría inexistente, saltar
            }
        }
        $stmt->close();

        // 4. Insertar la relación con el usuario
        $ins = $conn->prepare("INSERT INTO $tablaRel (user_id, $colId) VALUES (?, ?)");
        $ins->bind_param("ii", $userId, $itemId);
        $ins->execute();
        $ins->close();
    }
}