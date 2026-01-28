# COMPARACIÓN: ARCHIVO ROTO vs ARCHIVO CORREGIDO

## ❌ PROBLEMA EN enviar_contacto.php (Original)

```php
<?php
// ... setup ...

// Línea 75: Valida y sanitiza datos
$emailDestinatario = filter_input(INPUT_POST, 'email_destinatario', FILTER_SANITIZE_EMAIL);
$nombreRemitente = filter_input(INPUT_POST, 'nombre_remitente', FILTER_SANITIZE_STRING);
// ... más variables ...

// Línea 85: PRIMER BLOQUE DE VALIDACIÓN
if (empty($emailDestinatario) || empty($nombreRemitente) || empty($emailRemitente) || empty($asunto) || empty($mensaje)) {
    registrarLog("ERROR: Campos vacíos");
    enviarRespuesta(false, '', 'Todos los campos son obligatorios');
}

// ... más validación ...

// Línea 100: INTENTA ENVIAR
try {
    registrarLog("INICIO: Procesando contacto de {$emailRemitente} a {$emailDestinatario}");
    
    // PROBLEMA: Las funciones aún no están definidas!
    $enviado = enviarConMailPHP(...); // ← FUNCIÓN NO EXISTE TODAVÍA
    
} catch (Exception $e) {
    // error handling
}

// ... más código ...

// Línea 247: SEGUNDO BLOQUE DE VALIDACIÓN (DUPLICADO!)
$emailDestinatario = filter_input(INPUT_POST, 'email_destinatario', FILTER_SANITIZE_EMAIL);
$nombreRemitente = filter_input(INPUT_POST, 'nombre_remitente', FILTER_SANITIZE_STRING);
// ... repite validación ...

// Línea 330: AHORA define las funciones
function enviarConMailPHP(...) {
    // ...
}

function enviarConPHPMailer(...) {
    // COMENTADA!
    /*
    // ...
    */
}
?>
```

### 🔴 PROBLEMAS ESPECÍFICOS:
1. **Línea 100:** Llama a `enviarConMailPHP()` que no existe
2. **Línea 247:** Código de validación DUPLICADO
3. **Línea 330:** Las funciones se definen al FINAL
4. **Línea 400:** `enviarConPHPMailer()` está COMENTADA
5. **Lógica:** El try/catch falla porque las funciones no existen al ejecutarse

---

## ✅ SOLUCIÓN EN enviar_contacto_FIXED.php

```php
<?php
// ========== PASO 1: CONFIGURACIÓN ========== 
// Cargar .env
if (file_exists(__DIR__ . '/.env')) {
    // cargar variables de entorno
}

// ========== PASO 2: FUNCIONES AUXILIARES ==========
// ✅ Definidas PRIMERO
function registrarLog($msg) { ... }
function enviarRespuesta($ok, $msg, $err = null) { ... }
function guardarEnArchivo(...) { ... }

// ========== PASO 3: VALIDACIÓN ========== 
// ✅ Una SOLA validación
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { ... }

$emailDestinatario = trim(filter_input(INPUT_POST, 'email_destinatario', FILTER_SANITIZE_EMAIL));
// ... obtener y sanitizar ...

// ✅ Validar campos (UNA SOLA VEZ)
if (empty($emailDestinatario) || empty($nombreRemitente) || ...) {
    registrarLog("ERROR: Campos vacíos");
    enviarRespuesta(false, '', 'Todos los campos son obligatorios');
}

// ========== PASO 4: MÉTODOS DE ENVÍO ========== 
// ✅ Definir métodos ANTES de usarlos
function enviarConMailPHP($destino, ...) {
    // ✅ Implementado correctamente
}

function enviarConPHPMailer($destino, ...) {
    // ✅ Implementado correctamente
}

// ========== PASO 5: EJECUTAR ========== 
// ✅ Ahora sí puedo usar las funciones
try {
    registrarLog("➜ INICIO: Procesando contacto");
    
    $enviado = enviarConMailPHP(...); // ✅ EXISTE
    
    if (!$enviado) {
        registrarLog("⤳ Intentando PHPMailer...");
        $enviado = enviarConPHPMailer(...); // ✅ EXISTE
    }
    
    if (!$enviado) {
        registrarLog("⤳ Guardando respaldo...");
        guardarEnArchivo(...); // ✅ EXISTE
    }
    
    if ($enviado) {
        registrarLog("✓✓ ÉXITO");
        enviarRespuesta(true, 'Mensaje enviado', null);
    } else {
        registrarLog("✗✗ FALLO");
        enviarRespuesta(false, '', 'No se pudo enviar');
    }
} catch (Exception $e) {
    registrarLog("✗✗ EXCEPTION: " . $e->getMessage());
    enviarRespuesta(false, '', 'Error al procesar');
}
?>
```

### ✅ VENTAJAS:
1. **Orden correcto:** Setup → Funciones → Validación → Ejecución
2. **Una sola validación:** No hay código duplicado
3. **Funciones definidas primero:** Existen cuando se usan
4. **Cascada de métodos:** mail() → PHPMailer → Archivo
5. **Logging completo:** Cada paso está documentado
6. **Manejo de errores:** Try/catch envuelve TODO

---

## 🔧 CAMBIOS CLAVE A REALIZAR:

### Cambio 1: REEMPLAZAR enviar_contacto.php
```bash
# Opción 1: Copia directa
Copy: enviar_contacto_FIXED.php → enviar_contacto.php

# Opción 2: Edición manual
1. Abre enviar_contacto.php
2. Selecciona TODO (Ctrl+A)
3. Copia el contenido de enviar_contacto_FIXED.php
4. Pega y guarda
```

### Cambio 2: CORREGIR .env
```bash
# Antes:
SMTP_PASSWORD=dzxi thsr rctw dkjs  ← ESPACIOS ❌

# Después:
SMTP_PASSWORD=dzxithsrrctowdkjs    ← SIN ESPACIOS ✅
```

✅ ESTO YA ESTÁ HECHO

---

## 📝 VERIFICACIÓN:

Después de hacer los cambios, tu sistema enviará emails en este orden:

```
1️⃣  Intenta mail() de PHP
    ├─ ✅ Éxito → Envía respuesta positiva
    └─ ❌ Falla → Intenta siguiente

2️⃣  Intenta PHPMailer con SMTP
    ├─ ✅ Éxito → Envía respuesta positiva
    └─ ❌ Falla → Intenta siguiente

3️⃣  Guarda en archivo de respaldo
    ├─ ✅ Guardado → Envía respuesta positiva
    └─ ❌ Error crítico → Envía error
```

Con credenciales SMTP correctas, **debería funcionar en paso 2 (PHPMailer)**.

