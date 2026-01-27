<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
header('Content-Type: application/json; charset=utf-8');

// Iniciar output buffering para evitar enviar contenido antes del JSON
ob_start();

try {
    require_once 'conexion.php';
    
    // Validar que todos los datos necesarios estén presentes
    $required_fields = ['id', 'nombre', 'email', 'ciudad', 'provincia', 'modalidad', 'descripcion', 'especializacion', 'enlaces', 'backend', 'frontend'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field])) {
            throw new Exception("Falta el campo: $field");
        }
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
    $backend = intval($_POST['backend']);
    $frontend = intval($_POST['frontend']);

    if (empty($id) || $id <= 0) {
        throw new Exception("ID de usuario inválido");
    }

    $avatar2D = null;

    // Procesar avatar si existe
    if (isset($_FILES['avatar2D']) && $_FILES['avatar2D']['error'] === 0) {
        $carpeta = "uploads/avatars/";
        if (!is_dir($carpeta)) {
            if (!mkdir($carpeta, 0777, true)) {
                throw new Exception("No se pudo crear la carpeta de avatares");
            }
        }

        $nombreArchivo = uniqid() . "_" . basename($_FILES['avatar2D']['name']);
        $rutaFinal = $carpeta . $nombreArchivo;
        
        if (!move_uploaded_file($_FILES['avatar2D']['tmp_name'], $rutaFinal)) {
            throw new Exception("Error al mover el archivo avatar");
        }
        $avatar2D = $rutaFinal;
    }

    // Preparar SQL
    $sql = "UPDATE users SET
        nombre = ?, email = ?, ciudad = ?, provincia = ?, modalidad = ?, 
        descripcion = ?, especializacion = ?, enlaces = ?, backend = ?, frontend = ?";
    
    if ($avatar2D) {
        $sql .= ", avatar2D = ?";
    }
    
    $sql .= " WHERE id = ?";

    // Ejecutar UPDATE
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error en prepare: " . $conn->error);
    }

    if ($avatar2D) {
        $stmt->bind_param(
            "ssssssssissi",
            $nombre, $email, $ciudad, $provincia, $modalidad,
            $descripcion, $especializacion, $enlaces, $backend, $frontend,
            $avatar2D, $id
        );
    } else {
        $stmt->bind_param(
            "ssssssssiii",
            $nombre, $email, $ciudad, $provincia, $modalidad,
            $descripcion, $especializacion, $enlaces, $backend, $frontend,
            $id
        );
    }

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar usuario: " . $stmt->error);
    }
    
    $stmt->close();

    // Guardar skills y categorías
    if (isset($_POST['skills']) && !empty($_POST['skills'])) {
        // Eliminar skills anteriores
        $deleteSkills = $conn->prepare("DELETE FROM user_skills WHERE user_id = ?");
        if (!$deleteSkills) {
            throw new Exception("Error preparando delete skills: " . $conn->error);
        }
        $deleteSkills->bind_param("i", $id);
        $deleteSkills->execute();
        $deleteSkills->close();
        
        // Insertar nuevos skills
        $skills = explode(',', $_POST['skills']);
        
        foreach ($skills as $skillName) {
            $skillName = trim($skillName);
            if (empty($skillName)) continue;
            
            // Obtener ID del skill
            $getSkillId = $conn->prepare("SELECT id FROM skills WHERE nombre = ?");
            if (!$getSkillId) {
                throw new Exception("Error preparando select skill: " . $conn->error);
            }
            $getSkillId->bind_param("s", $skillName);
            $getSkillId->execute();
            $result = $getSkillId->get_result();
            
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $skillId = $row['id'];
                
                // Insertar relación
                $insertUserSkill = $conn->prepare("INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)");
                if (!$insertUserSkill) {
                    throw new Exception("Error preparando insert user_skill: " . $conn->error);
                }
                $insertUserSkill->bind_param("ii", $id, $skillId);
                $insertUserSkill->execute();
                $insertUserSkill->close();
            }
            $getSkillId->close();
        }
    }
    
    // Guardar categorías
    if (isset($_POST['categorias']) && !empty($_POST['categorias'])) {
        // Eliminar categorías anteriores
        $deleteCategories = $conn->prepare("DELETE FROM user_categories WHERE user_id = ?");
        if (!$deleteCategories) {
            throw new Exception("Error preparando delete categories: " . $conn->error);
        }
        $deleteCategories->bind_param("i", $id);
        $deleteCategories->execute();
        $deleteCategories->close();
        
        // Insertar nuevas categorías
        $cats = explode(',', $_POST['categorias']);
        
        foreach ($cats as $catName) {
            $catName = trim($catName);
            if (empty($catName)) continue;
            
            // Obtener ID de la categoría
            $getCatId = $conn->prepare("SELECT id FROM categories WHERE nombre = ?");
            if (!$getCatId) {
                throw new Exception("Error preparando select category: " . $conn->error);
            }
            $getCatId->bind_param("s", $catName);
            $getCatId->execute();
            $result = $getCatId->get_result();
            
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $catId = $row['id'];
                
                // Insertar relación
                $insertUserCat = $conn->prepare("INSERT INTO user_categories (user_id, category_id) VALUES (?, ?)");
                if (!$insertUserCat) {
                    throw new Exception("Error preparando insert user_category: " . $conn->error);
                }
                $insertUserCat->bind_param("ii", $id, $catId);
                $insertUserCat->execute();
                $insertUserCat->close();
            }
            $getCatId->close();
        }
    }

    ob_end_clean();
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}