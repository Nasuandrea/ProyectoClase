<?php
/**
 * TEST_PHPMAILER.PHP - Prueba de envío con PHPMailer
 * Verifica que la configuración SMTP es correcta
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

echo "=== PRUEBA PHPMAILER ===\n\n";

// Verificar que exista Autoload
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    die(json_encode(['error' => 'PHPMailer no instalado. Ejecuta: composer install']));
}

require __DIR__ . '/vendor/autoload.php';

// Verificar variables de entorno
echo "📌 Verificando variables de entorno...\n";
$host = getenv('SMTP_HOST');
$user = getenv('SMTP_USER');
$pass = getenv('SMTP_PASSWORD');
$port = getenv('SMTP_PORT') ?: '587';

echo "SMTP_HOST: " . ($host ? "✓ $host" : "✗ No configurado") . "\n";
echo "SMTP_USER: " . ($user ? "✓ $user" : "✗ No configurado") . "\n";
echo "SMTP_PASSWORD: " . ($pass ? "✓ " . str_repeat("*", strlen($pass)) : "✗ No configurado") . "\n";
echo "SMTP_PORT: $port\n\n";

if (!$host || !$user || !$pass) {
    die("❌ Faltan credenciales SMTP. Configura: \$env:SMTP_HOST, \$env:SMTP_USER, \$env:SMTP_PASSWORD\n");
}

try {
    echo "🔌 Conectando a SMTP...\n";
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $port;
    $mail->CharSet = 'UTF-8';
    $mail->SMTPDebug = 2; // Nivel de debug
    
    echo "✓ Configuración cargada\n\n";
    
    // Datos de prueba
    echo "📧 Preparando correo de prueba...\n";
    $mail->setFrom($user, 'Autonomix Test');
    $mail->addAddress('brea00jorge@gmail.com');
    $mail->addReplyTo($user);
    $mail->isHTML(false);
    $mail->Subject = '[TEST] Prueba de PHPMailer - ' . date('Y-m-d H:i:s');
    $mail->Body = "Hola,\n\nEste es un correo de prueba para verificar que PHPMailer funciona correctamente.\n\nFecha: " . date('Y-m-d H:i:s') . "\n\nSaludos,\nAutonomix";
    
    echo "📤 Enviando correo...\n\n";
    $mail->send();
    
    echo "\n✅ ¡Correo enviado exitosamente!\n";
    echo "Destinatario: brea00jorge@gmail.com\n";
    echo "Asunto: " . $mail->Subject . "\n";
    
} catch (\PHPMailer\PHPMailer\Exception $e) {
    echo "\n❌ Error de PHPMailer:\n";
    echo "Código: " . $e->getCode() . "\n";
    echo "Mensaje: " . $e->getMessage() . "\n";
    echo "\nDebug SMTP:\n";
    echo $mail->ErrorInfo ?? "Sin información adicional";
    
} catch (Exception $e) {
    echo "\n❌ Error general:\n";
    echo $e->getMessage() . "\n";
}
