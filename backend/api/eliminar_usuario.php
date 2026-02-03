<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

try {
    // Validar que el ID se envíe
    if (!isset($_POST['id']) && !isset($_GET['id'])) {
        throw new Exception("ID de usuario no proporcionado");
    }

    $id = isset($_POST['id']) ? intval($_POST['id']) : intval($_GET['id']);
    
    if ($id <= 0) {
        throw new Exception("ID inválido");
    }

    // Iniciar transacción para eliminar en cascada
    $conn->begin_transaction();

    try {
        // Eliminar skills del usuario
        $sql1 = "DELETE FROM user_skills WHERE user_id = ?";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bind_param("i", $id);
        $stmt1->execute();

        // Eliminar categorías del usuario
        $sql2 = "DELETE FROM user_categories WHERE user_id = ?";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("i", $id);
        $stmt2->execute();

        // Eliminar el usuario
        $sql3 = "DELETE FROM users WHERE id = ?";
        $stmt3 = $conn->prepare($sql3);
        $stmt3->bind_param("i", $id);
        $stmt3->execute();

        if ($stmt3->affected_rows === 0) {
            throw new Exception("Usuario no encontrado");
        }

        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Usuario eliminado correctamente"
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>
