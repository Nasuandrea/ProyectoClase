# 📧 GUÍA COMPLETA DE CONFIGURACIÓN SMTP

## RESUMEN ACTUAL

Tu sistema está configurado para usar **GMAIL SMTP** con:
- **Host:** smtp.gmail.com
- **Usuario:** brea00jorge@gmail.com  
- **Puerto:** 587
- **Seguridad:** STARTTLS
- **Método:** PHPMailer

---

## ✅ VERIFICACIÓN: ¿Está configurado correctamente?

Abre tu archivo `.env` y verifica:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_USER=brea00jorge@gmail.com
SMTP_PASSWORD=dzxithsrrctowdkjs
SMTP_PORT=587
```

- ✅ Host: `smtp.gmail.com` - Correcto
- ✅ Usuario: `brea00jorge@gmail.com` - Correcto  
- ✅ Contraseña: `dzxithsrrctowdkjs` - **SIN ESPACIOS** ✅
- ✅ Puerto: `587` - Correcto para STARTTLS

---

## 🔐 REQUISITOS PARA QUE FUNCIONE GMAIL:

### Requisito 1: Autenticación de 2 Factores HABILITADA
```
1. Ve a: https://myaccount.google.com
2. Click en "Seguridad" (lado izquierdo)
3. Verifica que "Verificación en 2 pasos" esté ✅ ACTIVADA
4. Si no está, actívalo
```

### Requisito 2: Contraseña de Aplicación CORRECTA
```
1. Ve a: https://myaccount.google.com/apppasswords
2. Si no aparece este opción:
   → Ve a "Seguridad" y activa "Verificación en 2 pasos"
   → Luego vuelve a apppasswords

3. Selecciona:
   - Aplicación: "Correo"
   - Dispositivo: "Windows Computer" (o el tuyo)

4. Google te dará una contraseña de 16 caracteres
5. Cópiala: ej: xxxx xxxx xxxx xxxx (NOTA: tiene espacios)

6. En tu .env, QUITA los espacios:
   Antes: dzxi thsr rctw dkjs
   Después: dzxithsrrctowdkjs
```

### Requisito 3: Permitir acceso de aplicaciones menos seguras (SOLO SI NECESARIO)
```
⚠️ SI la contraseña de aplicación no funciona:

1. Ve a: https://myaccount.google.com/u/0/security/lesssecureapps
2. Activa "Permitir aplicaciones menos seguras"
3. Intenta de nuevo

NOTA: Google recomienda usar contraseña de aplicación en lugar de esto.
```

---

## 🧪 CÓMO PROBAR QUE TODO FUNCIONA:

### Test 1: Diagnóstico Completo
```
1. Ve a: http://tu-sitio.com/diagnostico_email.php
2. Mira la sección "Información del Servidor PHP"
3. Verifica que:
   - ✅ Función mail(): Disponible
   - ✅ OpenSSL: Instalada
   - ✅ PHPMailer: Instalado
   - ✅ Directorios logs/ y contactos_pendientes/: Existen
```

### Test 2: Prueba de mail() nativa
```
En diagnostico_email.php:
1. Desplázate a "Prueba de mail() de PHP"
2. Introduce tu email: brea00jorge@gmail.com
3. Haz clic en "Enviar Email con mail()"
4. Mira el resultado:
   - ✅ Si recibiste un email → mail() funciona
   - ❌ Si no llegó → mail() no funciona en tu servidor
```

### Test 3: Prueba de PHPMailer (IMPORTANTE)
```
En diagnostico_email.php:
1. Desplázate a "Prueba de PHPMailer"
2. Introduce tu email: brea00jorge@gmail.com
3. Haz clic en "Enviar Email con PHPMailer"
4. Mira el resultado:
   - ✅ Verde y dice "Éxito" → PHPMailer funciona correctamente
   - ❌ Rojo y dice "Error" → Hay problema de configuración
```

### Test 4: Prueba el formulario
```
1. En tu sitio web, abre el modal de contacto
2. Completa todos los campos:
   - Tu nombre: Juan Pérez
   - Tu email: testingmail@gmail.com (usa un email real)
   - Asunto: Mensaje de prueba
   - Mensaje: Este es un mensaje de prueba

3. Haz clic en "Enviar"
4. Si ves "✅ Tu mensaje ha sido enviado": ¡FUNCIONA!
5. Revisa la carpeta de entrada del destinatario
```

---

## 🔧 SOLUCIONAR PROBLEMAS:

### Problema 1: "PHPMailer: Credenciales SMTP no configuradas"

**Causa:** El archivo `.env` no se está cargando o tiene formato incorrecto

**Solución:**
```
1. Abre el archivo .env
2. Verifica que NO tenga BOM (Byte Order Mark)
   → En VS Code: Verifica "UTF-8" en la esquina inferior derecha
   
3. Verifica el formato:
   CLAVE=valor
   
   NO:
   CLAVE = valor     (espacios alrededor del =)
   CLAVE: valor      (dos puntos)
   
4. Si tiene espacios alrededor del =, quítalos
5. Guarda y prueba de nuevo
```

### Problema 2: "La contraseña es incorrecta"

**Causa:** La contraseña de aplicación de Gmail no es válida

**Solución:**
```
1. Ve a: https://myaccount.google.com/apppasswords
2. Genera una NUEVA contraseña de aplicación
3. Cópiala COMPLETA
4. En .env, QUITA TODOS los espacios (en Gmail vienen con espacios)
5. Ejemplo:
   Google te da: dzxi thsr rctw dkjs
   En .env pones: dzxithsrrctowdkjs
6. Guarda
7. Prueba en diagnostico_email.php
```

### Problema 3: "Autenticación rechazada"

**Causa:** 2FA no está habilitado O la contraseña de aplicación no se ha generado

**Solución:**
```
1. Ve a: https://myaccount.google.com/security
2. Verifica "Verificación en 2 pasos" → ✅ ACTIVADA
3. Una vez activado, ve a:
   https://myaccount.google.com/apppasswords
4. Genera una contraseña de aplicación
5. Úsala en .env (sin espacios)
6. Prueba de nuevo
```

### Problema 4: "Email enviado pero no llegó"

**Causa:** El email está en SPAM o hay un problema de configuración del remitente

**Solución:**
```
1. Revisa la carpeta de SPAM del destinatario
2. Si está ahí, marca como "No es SPAM"
3. Si no está, revisa los logs:
   → Abre logs/contactos.log
   → Busca "✓ Email enviado" para confirmar que se envió
   
4. Si dice "enviado" pero no llega:
   → Es un problema de Gmail (probablemente SPAM)
   → Configura el email como "De confianza"
```

### Problema 5: "Permiso denegado en logs/ o contactos_pendientes/"

**Causa:** Los directorios no tienen permisos de escritura

**Solución:**
```
PHP intenta crearlos automáticamente con mkdir()
Si no puede:

1. Crea manualmente estos directorios:
   - logs/
   - contactos_pendientes/

2. Asigna permisos:
   chmod 755 logs
   chmod 755 contactos_pendientes

3. Si usas Windows y tienes FTP:
   - Crea las carpetas manualmente
   - No es necesario permisos especiales
```

---

## 📊 FLUJO DE ENVÍO ESPERADO:

```
Usuario envía formulario
         ↓
enviar_contacto.php recibe datos
         ↓
VALIDACIÓN:
  ✅ Método POST?
  ✅ Campos no vacíos?
  ✅ Emails válidos?
         ↓
INTENTO 1: mail() de PHP
  ├─ ✅ Éxito → RESPUESTA: Mensaje enviado
  └─ ❌ Falla → Intenta siguiente
         ↓
INTENTO 2: PHPMailer + SMTP Gmail
  ├─ ✅ Éxito → RESPUESTA: Mensaje enviado
  └─ ❌ Falla → Intenta siguiente
         ↓
INTENTO 3: Guardar en archivo de respaldo
  ├─ ✅ Guardado → RESPUESTA: Mensaje enviado
  └─ ❌ Error crítico → RESPUESTA: Error
         ↓
Se registra TODO en: logs/contactos.log
```

---

## 🎯 EXPECTED BEHAVIOR (Comportamiento esperado)

### Cuando funciona correctamente:
```
1. Usuario completa formulario
2. Hace clic en "Enviar"
3. Botón se desactiva (muestra spinner)
4. Servidor intenta enviar por mail()
5. Falla, intenta PHPMailer
6. ✅ Éxito con PHPMailer (Gmail)
7. Usuario ve: "✅ Tu mensaje ha sido enviado correctamente"
8. Modal se cierra después de 2 segundos
9. Usuario recibe confirmación en logs
```

### En los logs verás:
```
[2024-01-28 15:30:45] ══════════════════════════════════════════
[2024-01-28 15:30:45] ➜ INICIO: Procesando contacto de testuser@gmail.com a profesional@gmail.com
[2024-01-28 15:30:45] 📧 Intentando enviar con mail() a: profesional@gmail.com
[2024-01-28 15:30:45] ✗ mail() falló para profesional@gmail.com
[2024-01-28 15:30:45] ⤳ mail() falló. Intentando con PHPMailer...
[2024-01-28 15:30:46] 📧 Intentando enviar con PHPMailer a: profesional@gmail.com
[2024-01-28 15:30:48] ✓ Email enviado con PHPMailer a profesional@gmail.com
[2024-01-28 15:30:48] ✓✓ ÉXITO: Contacto procesado correctamente
[2024-01-28 15:30:48] ══════════════════════════════════════════
```

---

## 📚 REFERENCIA RÁPIDA:

| Aspecto | Valor |
|--------|-------|
| **Host SMTP** | smtp.gmail.com |
| **Puerto** | 587 |
| **Seguridad** | STARTTLS |
| **Usuario** | brea00jorge@gmail.com |
| **Contraseña** | [Tu contraseña de aplicación sin espacios] |
| **2FA Requerido** | ✅ SÍ |
| **Método PHP** | PHPMailer |
| **Archivo Config** | .env |
| **Archivos Relacionados** | enviar_contacto.php, modal_contacto.js |
| **Logs** | logs/contactos.log |
| **Respaldo** | contactos_pendientes/ |

---

## 🆘 CONTACTO PARA SOPORTE:

Si algo no funciona:
1. Revisa los **logs** en `logs/contactos.log`
2. Ejecuta `diagnostico_email.php`
3. Verifica que `.env` esté correctamente formateado
4. Comprueba que la **contraseña de aplicación** sea correcta

¡Debería funcionar! 🚀

