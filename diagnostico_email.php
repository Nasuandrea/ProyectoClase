<?php
/**
 * DIAGNOSTICO_EMAIL.PHP
 * Verifica la configuración de envío de emails en el servidor
 * Acceder a: http://tu-sitio.com/diagnostico_email.php
 */

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

// Estilos para mejor visualización
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #007bff; }
    .section h2 { margin-top: 0; color: #007bff; }
    .success { border-left-color: #28a745; }
    .success h2 { color: #28a745; }
    .warning { border-left-color: #ffc107; }
    .warning h2 { color: #ffc107; }
    .error { border-left-color: #dc3545; }
    .error h2 { color: #dc3545; }
    .info { border-left-color: #17a2b8; }
    .info h2 { color: #17a2b8; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 8px 0; }
    .log { background: #000; color: #0f0; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto; max-height: 300px; margin-top: 10px; }
    .test-button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .test-button:hover { background: #0056b3; }
</style>";

echo "<div class='container'>";
echo "<h1>🔍 Diagnóstico de Configuración de Email</h1>";

// ========== SECCIÓN 1: INFORMACIÓN PHP ==========
echo "<div class='section info'>";
echo "<h2>1. Información del Servidor PHP</h2>";
echo "<ul>";
echo "<li><strong>Versión PHP:</strong> " . phpversion() . "</li>";
echo "<li><strong>Sistema Operativo:</strong> " . php_uname() . "</li>";
echo "<li><strong>SAPI:</strong> " . php_sapi_name() . "</li>";
echo "</ul>";
echo "</div>";

// ========== SECCIÓN 2: FUNCIÓN mail() ==========
echo "<div class='section " . (function_exists('mail') ? 'success' : 'error') . "'>";
echo "<h2>2. Función mail()</h2>";
if (function_exists('mail')) {
    echo "<p>✅ <strong>Disponible:</strong> La función mail() está disponible en el servidor.</p>";
} else {
    echo "<p>❌ <strong>NO disponible:</strong> La función mail() no está disponible. Se usará PHPMailer como alternativa.</p>";
}
echo "</div>";

// ========== SECCIÓN 3: CONFIGURACIÓN php.ini ==========
echo "<div class='section info'>";
echo "<h2>3. Configuración php.ini para Mail</h2>";
echo "<ul>";

$sendmailPath = ini_get('sendmail_path');
$SMTP = ini_get('SMTP');
$SMTPPort = ini_get('smtp_port');

echo "<li><strong>sendmail_path:</strong> <code>" . ($sendmailPath ?: 'No configurado') . "</code></li>";
echo "<li><strong>SMTP:</strong> <code>" . ($SMTP ?: 'No configurado') . "</code></li>";
echo "<li><strong>smtp_port:</strong> <code>" . ($SMTPPort ?: 'No configurado') . "</code></li>";

echo "</ul>";

if (!$sendmailPath && !$SMTP) {
    echo "<div class='warning' style='margin-top: 10px;'>";
    echo "<p>⚠️ <strong>Advertencia:</strong> No hay sendmail_path ni SMTP configurados. Los emails pueden no funcionar con mail().</p>";
    echo "</div>";
}

echo "</div>";

// ========== SECCIÓN 4: EXTENSIONES ==========
echo "<div class='section " . (extension_loaded('sockets') ? 'success' : 'warning') . "'>";
echo "<h2>4. Extensiones Requeridas</h2>";
echo "<ul>";
echo "<li>OpenSSL: " . (extension_loaded('openssl') ? "✅ Instalada" : "❌ NO instalada") . "</li>";
echo "<li>Sockets: " . (extension_loaded('sockets') ? "✅ Instalada" : "❌ NO instalada") . "</li>";
echo "<li>cURL: " . (extension_loaded('curl') ? "✅ Instalada" : "❌ NO instalada") . "</li>";
echo "</ul>";
echo "</div>";

// ========== SECCIÓN 5: PHPMailer ==========
$phpmailerAvailable = file_exists(__DIR__ . '/vendor/autoload.php');
echo "<div class='section " . ($phpmailerAvailable ? 'success' : 'warning') . "'>";
echo "<h2>5. PHPMailer (Alternativa Recomendada)</h2>";
if ($phpmailerAvailable) {
    echo "<p>✅ <strong>Instalado:</strong> PHPMailer está disponible para usar como alternativa a mail().</p>";
} else {
    echo "<p>❌ <strong>NO instalado:</strong> PHPMailer no está disponible.</p>";
    echo "<p style='margin-top: 10px;'><strong>Instalación:</strong></p>";
    echo "<code style='display: block; padding: 10px; background: #f4f4f4; margin: 10px 0;'>composer require phpmailer/phpmailer</code>";
}
echo "</div>";

// ========== SECCIÓN 6: DIRECTORIOS ==========
echo "<div class='section info'>";
echo "<h2>6. Directorios de Logs y Contactos</h2>";

$logsDir = __DIR__ . '/logs';
$contactosDir = __DIR__ . '/contactos_pendientes';

echo "<ul>";
echo "<li><strong>Logs:</strong> " . ($logsDir) . " - " . (is_dir($logsDir) ? "✅ Existe" : "📁 Se creará automáticamente") . "</li>";
echo "<li><strong>Contactos Pendientes:</strong> " . ($contactosDir) . " - " . (is_dir($contactosDir) ? "✅ Existe" : "📁 Se creará automáticamente") . "</li>";
echo "</ul>";

// Mostrar log de contactos si existe
if (is_dir($logsDir) && file_exists($logsDir . '/contactos.log')) {
    echo "<p style='margin-top: 15px;'><strong>Últimos logs de contactos:</strong></p>";
    $logContent = file_get_contents($logsDir . '/contactos.log');
    $logLines = array_slice(explode("\n", trim($logContent)), -15);
    echo "<div class='log'>" . htmlspecialchars(implode("\n", $logLines)) . "</div>";
}

echo "</div>";

// ========== SECCIÓN 7: PRUEBA mail() ==========
echo "<div class='section warning'>";
echo "<h2>7. Prueba de mail() de PHP</h2>";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['test_email'])) {
    $testEmail = filter_var($_POST['test_email'], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($testEmail, FILTER_VALIDATE_EMAIL)) {
        echo "<p><strong>Enviando email de prueba a: {$testEmail}</strong></p>";
        
        $subject = "Prueba de Email - Autonomix";
        $message = "Este es un email de prueba desde la plataforma Autonomix.\n\n";
        $message .= "Si recibiste este mensaje, tu servidor está configurado correctamente.\n\n";
        $message .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
        $message .= "IP del servidor: " . ($_SERVER['SERVER_ADDR'] ?? 'N/A') . "\n";
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "From: Autonomix <noreply@autonomix.local>\r\n";
        
        $resultado = @mail($testEmail, $subject, $message, $headers);
        
        if ($resultado) {
            echo "<div style='background: #d4edda; padding: 10px; border: 1px solid #28a745; border-radius: 4px; color: #155724;'>";
            echo "✅ <strong>Email enviado con mail()!</strong> Revisa tu bandeja de entrada (incluyendo spam).";
            echo "</div>";
        } else {
            echo "<div style='background: #f8d7da; padding: 10px; border: 1px solid #dc3545; border-radius: 4px; color: #721c24;'>";
            echo "❌ <strong>Error:</strong> No se pudo enviar el email con mail(). Se usará PHPMailer.";
            echo "</div>";
        }
    } else {
        echo "<p style='color: #dc3545;'>❌ Email inválido</p>";
    }
}

echo "<form method='POST' style='margin-top: 10px;'>";
echo "<input type='email' name='test_email' placeholder='tu@email.com' required>";
echo "<button type='submit' class='test-button'>Enviar Email con mail()</button>";
echo "</form>";
echo "</div>";

// ========== SECCIÓN 8: PRUEBA PHPMailer ==========
echo "<div class='section warning'>";
echo "<h2>8. Prueba de PHPMailer</h2>";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['test_phpmailer'])) {
    $testEmail = filter_var($_POST['test_phpmailer'], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($testEmail, FILTER_VALIDATE_EMAIL)) {
        echo "<p><strong>Enviando email con PHPMailer a: {$testEmail}</strong></p>";
        
        if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
            echo "<div style='background: #f8d7da; padding: 10px; border: 1px solid #dc3545; border-radius: 4px; color: #721c24;'>";
            echo "❌ <strong>Error:</strong> PHPMailer no está instalado. Ejecuta: composer require phpmailer/phpmailer";
            echo "</div>";
        } else {
            require __DIR__ . '/vendor/autoload.php';
            
            try {
                $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
                
                $smtpHost = getenv('SMTP_HOST');
                $smtpUser = getenv('SMTP_USER');
                $smtpPass = getenv('SMTP_PASSWORD');
                $smtpPort = getenv('SMTP_PORT') ?: '587';
                
                if (!$smtpHost || !$smtpUser || !$smtpPass) {
                    echo "<div style='background: #fff3cd; padding: 10px; border: 1px solid #ffc107; border-radius: 4px; color: #856404;'>";
                    echo "⚠️ <strong>Advertencia:</strong> Variables de entorno SMTP no configuradas. ";
                    echo "Configura: SMTP_HOST, SMTP_USER, SMTP_PASSWORD en tu sistema.";
                    echo "</div>";
                } else {
                    $mail->isSMTP();
                    $mail->Host = $smtpHost;
                    $mail->SMTPAuth = true;
                    $mail->Username = $smtpUser;
                    $mail->Password = $smtpPass;
                    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port = $smtpPort;
                    $mail->CharSet = 'UTF-8';
                    $mail->Debugoutput = 'html';
                    
                    $mail->setFrom($smtpUser, 'Autonomix');
                    $mail->addAddress($testEmail);
                    $mail->addReplyTo($smtpUser);
                    $mail->isHTML(false);
                    $mail->Subject = '[TEST PHPMailer] Prueba - ' . date('Y-m-d H:i:s');
                    $mail->Body = "Hola,\n\nEste es un email de prueba enviado con PHPMailer.\n\nFecha: " . date('Y-m-d H:i:s') . "\nDestino: {$testEmail}\n\nSi recibiste este mensaje, ¡PHPMailer funciona correctamente!\n\nSaludos,\nAutonomix";
                    
                    $mail->send();
                    
                    echo "<div style='background: #d4edda; padding: 10px; border: 1px solid #28a745; border-radius: 4px; color: #155724;'>";
                    echo "✅ <strong>¡Email enviado con PHPMailer!</strong><br>";
                    echo "Servidor: {$smtpHost}:{$smtpPort}<br>";
                    echo "Usuario: {$smtpUser}<br>";
                    echo "Destino: {$testEmail}<br>";
                    echo "Revisa tu bandeja de entrada (incluyendo spam).";
                    echo "</div>";
                }
                
            } catch (\PHPMailer\PHPMailer\Exception $e) {
                echo "<div style='background: #f8d7da; padding: 10px; border: 1px solid #dc3545; border-radius: 4px; color: #721c24;'>";
                echo "❌ <strong>Error PHPMailer:</strong><br>";
                echo htmlspecialchars($e->getMessage());
                echo "</div>";
            } catch (Exception $e) {
                echo "<div style='background: #f8d7da; padding: 10px; border: 1px solid #dc3545; border-radius: 4px; color: #721c24;'>";
                echo "❌ <strong>Error general:</strong><br>";
                echo htmlspecialchars($e->getMessage());
                echo "</div>";
            }
        }
    } else {
        echo "<p style='color: #dc3545;'>❌ Email inválido</p>";
    }
}

echo "<form method='POST' style='margin-top: 10px;'>";
echo "<input type='email' name='test_phpmailer' placeholder='tu@email.com' required>";
echo "<button type='submit' class='test-button'>Enviar Email con PHPMailer</button>";
echo "</form>";
echo "</div>";

// ========== SECCIÓN 9: RECOMENDACIONES ==========
echo "<div class='section info'>";
echo "<h2>9. Recomendaciones</h2>";
echo "<ul>";
echo "<li>Si <strong>mail() no funciona</strong>: Usa PHPMailer con credenciales SMTP</li>";
echo "<li><strong>Contactos pendientes</strong> se guardan en <code>/contactos_pendientes/</code></li>";
echo "<li>Los <strong>logs</strong> se guardan en <code>/logs/contactos.log</code></li>";
echo "<li>Revisa los logs para <strong>debuggear</strong> problemas</li>";
echo "<li>Para <strong>PHPMailer</strong>: Configura variables de entorno SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_PORT</li>";
echo "<li>Para <strong>Gmail</strong>: Usa contraseña de aplicación, no tu contraseña normal</li>";
echo "<li><strong>Variables de entorno recomendadas</strong>:<br>";
echo "<code style='display: block; padding: 10px; background: #f4f4f4; margin: 5px 0;'>";
echo "SMTP_HOST=smtp.gmail.com<br>";
echo "SMTP_USER=tu-email@gmail.com<br>";
echo "SMTP_PASSWORD=tu-contraseña-de-aplicación<br>";
echo "SMTP_PORT=587";
echo "</code>";
echo "</li>";
echo "</ul>";
echo "</div>";

echo "</div>";
?>
