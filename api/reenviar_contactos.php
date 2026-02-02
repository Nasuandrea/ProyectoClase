<?php
/**
 * REENVIAR_CONTACTOS.PHP
 * Reenvía los contactos que no se enviaron correctamente
 * Ejecutar: php reenviar_contactos.php
 * O acceder a: http://tu-sitio.com/reenviar_contactos.php
 */

// Permitir ejecución desde web y CLI
if (php_sapi_name() !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}

echo "=== REENVIANDO CONTACTOS PENDIENTES ===\n\n";

$contactosDir = __DIR__ . '/contactos_pendientes';
$logsDir = __DIR__ . '/logs';

// Crear directorios si no existen
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0755, true);
}

// Función para registrar
function registrarReenvio($mensaje) {
    global $logsDir;
    $logFile = $logsDir . '/reenvios.log';
    $fecha = date('Y-m-d H:i:s');
    $linea = "[{$fecha}] {$mensaje}\n";
    file_put_contents($logFile, $linea, FILE_APPEND);
    echo $linea;
}

if (!is_dir($contactosDir)) {
    registrarReenvio("❌ No hay directorio de contactos pendientes");
    exit;
}

// Buscar archivos JSON pendientes
$archivos = glob($contactosDir . '/*.json');

if (empty($archivos)) {
    registrarReenvio("✅ No hay contactos pendientes");
    exit;
}

registrarReenvio("Encontrados " . count($archivos) . " contactos pendientes");

$reenviados = 0;
$fallidos = 0;

foreach ($archivos as $archivo) {
    $contenido = file_get_contents($archivo);
    $datos = json_decode($contenido, true);
    
    if (!$datos) {
        registrarReenvio("❌ Error al decodificar: " . basename($archivo));
        continue;
    }
    
    extract($datos);
    
    registrarReenvio("Procesando: {$email_destinatario}");
    
    // Preparar email
    $mensaje = "Has recibido un nuevo mensaje de contacto:\n\n";
    $mensaje .= "De: {$nombre_remitente}\n";
    $mensaje .= "Email: {$email_remitente}\n\n";
    $mensaje .= "Asunto: {$asunto}\n\n";
    $mensaje .= "Mensaje:\n{$mensaje}\n\n";
    $mensaje .= "---\n";
    $mensaje .= "Este mensaje fue enviado desde la plataforma Autonomix.";
    
    // Headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: Autonomix <{$email_remitente}>\r\n";
    $headers .= "Reply-To: {$email_remitente}\r\n";
    
    // Intentar envío
    if (@mail($email_destinatario, $asunto, $mensaje, $headers)) {
        registrarReenvio("✅ Reenviado exitosamente a {$email_destinatario}");
        unlink($archivo); // Eliminar archivo
        $reenviados++;
    } else {
        registrarReenvio("❌ Error al reenviar a {$email_destinatario}");
        $fallidos++;
    }
}

echo "\n=== RESUMEN ===\n";
registrarReenvio("Reenviados: {$reenviados}, Fallidos: {$fallidos}");
