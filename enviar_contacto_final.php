<?php
/**
 * ENVIAR_CONTACTO.PHP - SISTEMA DE CONTACTO MEJORADO
 * Procesa formularios de contacto con 3 métodos de envío:
 * 1. mail() de PHP
 * 2. PHPMailer (si está instalado)
 * 3. Respaldo en archivos JSON
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// ========== FUNCIONES UTILITARIAS ==========

function registrarLog($msg) {
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) mkdir($logDir, 0755, true);
    $f = date('[Y-m-d H:i:s] ') . $msg . "\n";
    @file_put_contents($logDir . '/contactos.log', $f, FILE_APPEND);
}

function enviarRespuesta($ok, $msg, $err = null) {
    echo json_encode(['success' => $ok, 'message' => $msg, 'error' => $err]);
    exit;
}

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
    registrarLog("✓ Contacto guardado: " . $arch);
}

// ========== MÉTODO 1: mail() de PHP ==========

function enviarMailPHP($dest, $nom, $rem, $asunto, $msg) {
    $contenido = "Nuevo mensaje de contacto:\n\n";
    $contenido .= "De: {$nom}\nEmail: {$rem}\nAsunto: {$asunto}\n\n";
    $contenido .= "Mensaje:\n{$msg}\n\n---\nAutonomix";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: {$rem}\r\nReply-To: {$rem}\r\n";
    
    $ok = @mail($dest, $asunto, $contenido, $headers);
    if ($ok) registrarLog("✓ Email enviado con mail() a: $dest");
    else registrarLog("✗ mail() falló para: $dest");
    return $ok;
}

// ========== MÉTODO 2: PHPMailer ==========

function enviarPHPMailer($dest, $nom, $rem, $asunto, $msg) {
    if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
        registrarLog("✗ PHPMailer no instalado");
        return false;
    }
    
    try {
        require __DIR__ . '/vendor/autoload.php';
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        
        $mail->isSMTP();
        $mail->Host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = getenv('SMTP_USER') ?: 'tu-email@gmail.com';
        $mail->Password = getenv('SMTP_PASSWORD') ?: 'tu-contraseña-app';
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        
        // Evitar rechazo al usar SMTP: el remitente debe ser la cuenta autenticada.
        if (stripos($mail->Username, 'tu-email') !== false || stripos($mail->Password, 'tu-contraseña') !== false) {
            registrarLog("✗ PHPMailer: credenciales SMTP no configuradas (cambia SMTP_USER/SMTP_PASSWORD)");
            return false;
        }

        $mail->setFrom($mail->Username, 'Autonomix');
        $mail->addAddress($dest);
        $mail->addReplyTo($rem, $nom);
        $mail->isHTML(false);
        $mail->Subject = $asunto;
        $mail->Body = "Nuevo mensaje de contacto:\n\nDe: {$nom}\nEmail: {$rem}\nAsunto: {$asunto}\n\nMensaje:\n{$msg}\n\n---\nAutonomix";
        
        $mail->send();
        registrarLog("✓ Email enviado con PHPMailer a: $dest");
        return true;
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        registrarLog("✗ PHPMailer error: " . $e->getMessage());
        return false;
    }
}

// ========== VALIDACIÓN ==========

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarRespuesta(false, '', 'Método no permitido');
}

$dest = trim(filter_input(INPUT_POST, 'email_destinatario', FILTER_SANITIZE_EMAIL));
$nom = trim(filter_input(INPUT_POST, 'nombre_remitente', FILTER_SANITIZE_STRING));
$rem = trim(filter_input(INPUT_POST, 'email_remitente', FILTER_SANITIZE_EMAIL));
$asunto = trim(filter_input(INPUT_POST, 'asunto', FILTER_SANITIZE_STRING));
$msg = trim(filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING));

if (!$dest || !$nom || !$rem || !$asunto || !$msg) {
    registrarLog("✗ Campos vacíos");
    enviarRespuesta(false, '', 'Todos los campos son obligatorios');
}

if (!filter_var($dest, FILTER_VALIDATE_EMAIL) || !filter_var($rem, FILTER_VALIDATE_EMAIL)) {
    registrarLog("✗ Email inválido");
    enviarRespuesta(false, '', 'Email inválido');
}

$dest = str_replace(["\r", "\n"], '', $dest);
$rem = str_replace(["\r", "\n"], '', $rem);

registrarLog("➜ Procesando contacto de $rem a $dest");

// ========== INTENTA ENVÍO ==========

$enviado = enviarMailPHP($dest, $nom, $rem, $asunto, $msg);

if (!$enviado) {
    registrarLog("⤳ Intentando con PHPMailer...");
    $enviado = enviarPHPMailer($dest, $nom, $rem, $asunto, $msg);
}

if (!$enviado) {
    registrarLog("⤳ Guardando en respaldo...");
    guardarEnArchivo($dest, $nom, $rem, $asunto, $msg);
}

if ($enviado) {
    registrarLog("✓✓ Contacto completado correctamente");
    enviarRespuesta(true, 'Mensaje enviado correctamente. El profesional te responderá pronto.', null);
} else {
    registrarLog("✗✗ Error: No se pudo enviar por ningún método");
    enviarRespuesta(false, '', 'No se pudo enviar. Intenta más tarde.');
}
