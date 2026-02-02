<?php
/**
 * ENVIAR_CONTACTO.PHP - SISTEMA DE CONTACTO MEJORADO
 * Procesa formularios de contacto con 3 métodos de envío:
 * 1. mail() de PHP
 * 2. PHPMailer (si está instalado y configurado)
 * 3. Respaldo en archivos JSON
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

// ========== CARGAR VARIABLES DE ENTORNO ==========
if (file_exists(__DIR__ . '/.env')) {
    $envFile = file_get_contents(__DIR__ . '/.env');
    $lines = explode("\n", trim($envFile));
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            [$key, $value] = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

// ========== CREAR DIRECTORIO DE LOGS ==========
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// ========== FUNCIONES UTILITARIAS ==========

/**
 * Registra un mensaje en el archivo de log
 */
function registrarLog($msg) {
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) mkdir($logDir, 0755, true);
    $f = date('[Y-m-d H:i:s] ') . $msg . "\n";
    @file_put_contents($logDir . '/contactos.log', $f, FILE_APPEND);
}

/**
 * Envía respuesta JSON y termina la ejecución
 */
function enviarRespuesta($ok, $msg, $err = null) {
    echo json_encode(['success' => $ok, 'message' => $msg, 'error' => $err]);
    exit;
}

/**
 * Guarda el contacto en archivo como respaldo
 */
function guardarEnArchivo($email, $nom, $rem, $asunto, $msg) {
    $dir = __DIR__ . '/contactos_pendientes';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $arch = "contacto_" . time() . "_" . md5($email) . ".json";
    $data = [
        'timestamp' => date('Y-m-d H:i:s'),
        'email_destinatario' => $email,
        'nombre_remitente' => $nom,
        'email_remitente' => $rem,
        'asunto' => $asunto,
        'mensaje' => $msg
    ];
    @file_put_contents($dir . '/' . $arch, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    registrarLog("✓ Contacto guardado en respaldo: " . $arch);
}

// ========== VALIDAR MÉTODO POST ==========
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarRespuesta(false, '', 'Método no permitido');
}

// ========== OBTENER Y SANITIZAR DATOS ==========
$emailDestinatario = trim(filter_input(INPUT_POST, 'email_destinatario', FILTER_SANITIZE_EMAIL));
$nombreRemitente = trim(filter_input(INPUT_POST, 'nombre_remitente', FILTER_SANITIZE_STRING));
$emailRemitente = trim(filter_input(INPUT_POST, 'email_remitente', FILTER_SANITIZE_EMAIL));
$asunto = trim(filter_input(INPUT_POST, 'asunto', FILTER_SANITIZE_STRING));
$mensaje = trim(filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING));

// ========== VALIDAR CAMPOS OBLIGATORIOS ==========
if (empty($emailDestinatario) || empty($nombreRemitente) || empty($emailRemitente) || empty($asunto) || empty($mensaje)) {
    registrarLog("ERROR: Campos vacíos");
    enviarRespuesta(false, '', 'Todos los campos son obligatorios');
}

// ========== VALIDAR FORMATO DE EMAILS ==========
if (!filter_var($emailDestinatario, FILTER_VALIDATE_EMAIL)) {
    registrarLog("ERROR: Email destinatario inválido: {$emailDestinatario}");
    enviarRespuesta(false, '', 'Email del destinatario inválido');
}

if (!filter_var($emailRemitente, FILTER_VALIDATE_EMAIL)) {
    registrarLog("ERROR: Email remitente inválido: {$emailRemitente}");
    enviarRespuesta(false, '', 'Tu email es inválido');
}

// ========== PREVENIR INYECCIÓN DE HEADERS ==========
$emailDestinatario = str_replace(["\r", "\n", "%0a", "%0d"], '', $emailDestinatario);
$emailRemitente = str_replace(["\r", "\n", "%0a", "%0d"], '', $emailRemitente);

// ========== MÉTODO 1: Enviar con mail() de PHP ==========
/**
 * Intenta enviar email usando la función nativa mail() de PHP
 */
function enviarConMailPHP($destino, $nombreRemitente, $emailRemitente, $asunto, $mensaje) {
    try {
        // Preparar el contenido del mensaje
        $contenido = "Has recibido un nuevo mensaje de contacto:\n\n";
        $contenido .= "De: {$nombreRemitente}\n";
        $contenido .= "Email: {$emailRemitente}\n\n";
        $contenido .= "Asunto: {$asunto}\n\n";
        $contenido .= "Mensaje:\n{$mensaje}\n\n";
        $contenido .= "---\n";
        $contenido .= "Este mensaje fue enviado desde la plataforma Autonomix.\n";
        $contenido .= "Fecha: " . date('Y-m-d H:i:s') . "\n";

        // Headers del email
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "From: {$emailRemitente}\r\n";
        $headers .= "Reply-To: {$emailRemitente}\r\n";

        registrarLog("📧 Intentando enviar con mail() a: {$destino}");

        // Enviar email
        $resultado = @mail($destino, $asunto, $contenido, $headers);

        if ($resultado) {
            registrarLog("✓ Email enviado con mail() a {$destino}");
            return true;
        } else {
            registrarLog("✗ mail() falló para {$destino}");
            return false;
        }
    } catch (Exception $e) {
        registrarLog("✗ Exception en mail(): " . $e->getMessage());
        return false;
    }
}

// ========== MÉTODO 2: Enviar con PHPMailer ==========
/**
 * Intenta enviar email usando PHPMailer
 */
function enviarConPHPMailer($destino, $nombreRemitente, $emailRemitente, $asunto, $mensaje) {
    $autoloadPath = __DIR__ . '/vendor/autoload.php';
    
    if (!file_exists($autoloadPath)) {
        registrarLog("✗ PHPMailer no instalado (falta vendor/autoload.php)");
        return false;
    }
    
    try {
        require $autoloadPath;
        
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

        // Obtener credenciales SMTP
        $smtpHost = getenv('SMTP_HOST');
        $smtpUser = getenv('SMTP_USER');
        $smtpPass = getenv('SMTP_PASSWORD');
        $smtpPort = getenv('SMTP_PORT') ?: 587;

        // Validar que existan credenciales
        if (!$smtpHost || !$smtpUser || !$smtpPass) {
            registrarLog("✗ PHPMailer: Credenciales SMTP no configuradas (falta archivo .env)");
            return false;
        }

        // Configuración SMTP
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtpPort;
        $mail->CharSet = 'UTF-8';

        // Configurar remitente y destinatario
        // IMPORTANTE: En SMTP, el remitente DEBE ser la cuenta autenticada
        $mail->setFrom($smtpUser, 'Autonomix');
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

        registrarLog("📧 Intentando enviar con PHPMailer a: {$destino}");
        $mail->send();
        registrarLog("✓ Email enviado con PHPMailer a {$destino}");
        return true;
        
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        registrarLog("✗ PHPMailer Exception: " . $e->getMessage());
        return false;
    } catch (Exception $e) {
        registrarLog("✗ Exception general: " . $e->getMessage());
        return false;
    }
}

// ========== EJECUTAR ENVÍO ==========
registrarLog("══════════════════════════════════════════");
registrarLog("➜ INICIO: Procesando contacto de {$emailRemitente} a {$emailDestinatario}");

try {
    // Intentar enviar con mail() de PHP primero
    $enviado = enviarConMailPHP($emailDestinatario, $nombreRemitente, $emailRemitente, $asunto, $mensaje);

    // Si falla, intentar con PHPMailer
    if (!$enviado) {
        registrarLog("⤳ mail() falló. Intentando con PHPMailer...");
        $enviado = enviarConPHPMailer($emailDestinatario, $nombreRemitente, $emailRemitente, $asunto, $mensaje);
    }

    // Si sigue fallando, guardar en archivo para envío manual
    if (!$enviado) {
        registrarLog("⤳ PHPMailer falló. Guardando en respaldo...");
        guardarEnArchivo($emailDestinatario, $nombreRemitente, $emailRemitente, $asunto, $mensaje);
    }

    // Enviar respuesta al cliente
    if ($enviado) {
        registrarLog("✓✓ ÉXITO: Contacto procesado correctamente");
        registrarLog("══════════════════════════════════════════");
        
        enviarRespuesta(
            true,
            'Tu mensaje ha sido enviado correctamente. El profesional te responderá pronto.',
            null
        );
    } else {
        registrarLog("✗✗ FALLO: No se pudo enviar por ningún método");
        registrarLog("══════════════════════════════════════════");
        
        enviarRespuesta(
            false,
            '',
            'No se pudo enviar el mensaje en este momento. Por favor, intenta más tarde.'
        );
    }
} catch (Exception $e) {
    registrarLog("✗✗ EXCEPTION GENERAL: " . $e->getMessage());
    registrarLog("══════════════════════════════════════════");
    
    enviarRespuesta(
        false,
        '',
        'Error al procesar tu solicitud'
    );
}
?>
