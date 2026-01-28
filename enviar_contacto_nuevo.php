<?php

/**
 * ENVIAR_CONTACTO.PHP
 * Procesa el formulario de contacto y envía emails
 */

// Habilitar errores para desarrollo (comentar en producción)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Configuración de headers para JSON
header('Content-Type: application/json; charset=utf-8');

// Crear directorio de logs si no existe
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}
ini_set('error_log', $logDir . '/php_errors.log');

// ============================
// FUNCIÓN DE LOGGING
// ============================
function registrarLog($mensaje)
{
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/contactos.log';
    $fecha = date('Y-m-d H:i:s');
    $linea = "[{$fecha}] {$mensaje}\n";
    
    @file_put_contents($logFile, $linea, FILE_APPEND);
}

// ============================
// FUNCIÓN PARA ENVIAR RESPUESTA JSON
// ============================
function enviarRespuesta($success, $message, $error = null)
{
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'error' => $error
    ]);
    exit;
}

// ============================
// GUARDAR CONTACTO EN ARCHIVO (FALLBACK)
// ============================
function guardarContactoEnArchivo($emailDest, $nombreRem, $emailRem, $asunto, $mensaje)
{
    try {
        $contactosDir = __DIR__ . '/contactos_pendientes';
        if (!is_dir($contactosDir)) {
            mkdir($contactosDir, 0755, true);
        }
        
        $nombreArchivo = 'contacto_' . time() . '_' . md5($emailDest) . '.json';
        $rutaArchivo = $contactosDir . '/' . $nombreArchivo;
        
        $datos = [
            'timestamp' => date('Y-m-d H:i:s'),
            'email_destinatario' => $emailDest,
            'nombre_remitente' => $nombreRem,
            'email_remitente' => $emailRem,
            'asunto' => $asunto,
            'mensaje' => $mensaje,
            'enviado' => false
        ];
        
        @file_put_contents($rutaArchivo, json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        registrarLog("ARCHIVO: Contacto guardado en {$nombreArchivo}");
        
        return true;
    } catch (Exception $e) {
        registrarLog("ERROR ARCHIVO: " . $e->getMessage());
        return false;
    }
}

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarRespuesta(false, '', 'Método no permitido');
}

// Validar y sanitizar datos recibidos
$emailDestinatario = filter_input(INPUT_POST, 'email_destinatario', FILTER_SANITIZE_EMAIL);
$nombreRemitente = filter_input(INPUT_POST, 'nombre_remitente', FILTER_SANITIZE_STRING);
$emailRemitente = filter_input(INPUT_POST, 'email_remitente', FILTER_SANITIZE_EMAIL);
$asunto = filter_input(INPUT_POST, 'asunto', FILTER_SANITIZE_STRING);
$mensaje = filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING);

// Validar campos obligatorios
if (empty($emailDestinatario) || empty($nombreRemitente) || empty($emailRemitente) || empty($asunto) || empty($mensaje)) {
    registrarLog("ERROR: Campos vacíos");
    enviarRespuesta(false, '', 'Todos los campos son obligatorios');
}

// Validar formato de emails
if (!filter_var($emailDestinatario, FILTER_VALIDATE_EMAIL)) {
    registrarLog("ERROR: Email destinatario inválido: {$emailDestinatario}");
    enviarRespuesta(false, '', 'Email del destinatario inválido');
}

if (!filter_var($emailRemitente, FILTER_VALIDATE_EMAIL)) {
    registrarLog("ERROR: Email remitente inválido: {$emailRemitente}");
    enviarRespuesta(false, '', 'Tu email es inválido');
}

// Prevenir inyección de headers en el email
$emailDestinatario = str_replace(["\r", "\n", "%0a", "%0d"], '', $emailDestinatario);
$emailRemitente = str_replace(["\r", "\n", "%0a", "%0d"], '', $emailRemitente);

// ============================
// OPCIÓN 1: Usando mail() de PHP
// ============================
function enviarConMailPHP($destino, $nombreRemitente, $emailRemitente, $asunto, $mensaje)
{
    try {
        // Preparar el mensaje
        $mensajeCompleto = "Has recibido un nuevo mensaje de contacto:\n\n";
        $mensajeCompleto .= "De: {$nombreRemitente}\n";
        $mensajeCompleto .= "Email: {$emailRemitente}\n\n";
        $mensajeCompleto .= "Asunto: {$asunto}\n\n";
        $mensajeCompleto .= "Mensaje:\n{$mensaje}\n\n";
        $mensajeCompleto .= "---\n";
        $mensajeCompleto .= "Este mensaje fue enviado desde la plataforma Autonomix.\n";
        $mensajeCompleto .= "Fecha: " . date('Y-m-d H:i:s') . "\n";

        // Headers del email - MEJORADOS
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: 8bit\r\n";
        $headers .= "From: Autonomix <{$emailRemitente}>\r\n";
        $headers .= "Reply-To: {$emailRemitente}\r\n";
        $headers .= "X-Mailer: Autonomix Platform\r\n";
        $headers .= "X-Priority: 3\r\n";
        
        registrarLog("DEBUG: Enviando email a {$destino}");
        
        // Validar que mail() esté disponible
        if (!function_exists('mail')) {
            throw new Exception('Función mail() no disponible en el servidor');
        }

        // Enviar email
        $enviado = @mail($destino, $asunto, $mensajeCompleto, $headers);

        if ($enviado) {
            registrarLog("SUCCESS: Email enviado con mail() a {$destino}");
        } else {
            registrarLog("ERROR: mail() retornó false para {$destino}");
        }

        return $enviado;
    } catch (Exception $e) {
        registrarLog("EXCEPTION en mail(): " . $e->getMessage());
        return false;
    }
}

// ============================
// OPCIÓN 2: Usando PHPMailer
// ============================
function enviarConPHPMailer($destino, $nombreRemitente, $emailRemitente, $asunto, $mensaje)
{
    $composerAutoload = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($composerAutoload)) {
        registrarLog("ERROR: PHPMailer no instalado (falta vendor/autoload.php)");
        return false;
    }
    
    try {
        require $composerAutoload;
        
        use PHPMailer\PHPMailer\PHPMailer;
        use PHPMailer\PHPMailer\Exception;

        $mail = new PHPMailer(true);

        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = getenv('SMTP_USER') ?: 'tu-email@gmail.com';
        $mail->Password = getenv('SMTP_PASSWORD') ?: 'tu-contraseña-app';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        // Remitente y destinatario
        $mail->setFrom($emailRemitente, $nombreRemitente);
        $mail->addAddress($destino);
        $mail->addReplyTo($emailRemitente, $nombreRemitente);

        // Contenido del email
        $mail->isHTML(false);
        $mail->Subject = $asunto;
        $mail->Body = "Has recibido un nuevo mensaje de contacto:\n\n" .
                      "De: {$nombreRemitente}\n" .
                      "Email: {$emailRemitente}\n\n" .
                      "Asunto: {$asunto}\n\n" .
                      "Mensaje:\n{$mensaje}\n\n" .
                      "---\n" .
                      "Este mensaje fue enviado desde la plataforma Autonomix.";

        $mail->send();
        registrarLog("SUCCESS: Email enviado con PHPMailer a {$destino}");
        return true;
    } catch (Exception $e) {
        registrarLog("ERROR PHPMailer: " . $e->getMessage());
        return false;
    }
}

// ============================
// EJECUTAR ENVÍO
// ============================

try {
    registrarLog("INICIO: Procesando contacto de {$emailRemitente} a {$emailDestinatario}");
    
    // Intentar enviar con mail() de PHP primero
    $enviado = enviarConMailPHP(
        $emailDestinatario,
        $nombreRemitente,
        $emailRemitente,
        $asunto,
        $mensaje
    );

    // Si falla, intentar con PHPMailer
    if (!$enviado) {
        registrarLog("FALLBACK: Intentando con PHPMailer...");
        $enviado = enviarConPHPMailer(
            $emailDestinatario,
            $nombreRemitente,
            $emailRemitente,
            $asunto,
            $mensaje
        );
    }

    // Si sigue fallando, guardar en archivo para envío manual
    if (!$enviado) {
        registrarLog("RESPALDO: Guardando en archivo para envío manual...");
        guardarContactoEnArchivo(
            $emailDestinatario,
            $nombreRemitente,
            $emailRemitente,
            $asunto,
            $mensaje
        );
    }

    // IMPORTANTE: Para testing sin SMTP, descomenta:
    // $enviado = true;

    if ($enviado) {
        registrarLog("SUCCESS: Contacto procesado correctamente");

        enviarRespuesta(
            true,
            'Tu mensaje ha sido enviado correctamente. El profesional te responderá pronto.',
            null
        );
    } else {
        registrarLog("FINAL_ERROR: No se pudo enviar por ningún método");
        
        enviarRespuesta(
            false,
            '',
            'No se pudo enviar el mensaje en este momento. Por favor, intenta más tarde o contacta directamente.'
        );
    }
} catch (Exception $e) {
    registrarLog("EXCEPTION GENERAL: " . $e->getMessage());
    enviarRespuesta(
        false,
        '',
        'Error al procesar tu solicitud'
    );
}
