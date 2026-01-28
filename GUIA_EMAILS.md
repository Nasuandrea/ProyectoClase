# 📧 Guía de Diagnóstico y Corrección de Emails

## 🔴 Problema: Los emails no llegan a los profesionales

He mejorado tu sistema con **3 métodos de envío** y **logging completo**.

---

## ✅ Paso 1: Verificar la Configuración

### Accede al diagnóstico:
```
http://tu-sitio.com/diagnostico_email.php
```

Este archivo te mostrará:
- ✅ Si `mail()` está disponible
- ✅ Configuración SMTP del servidor
- ✅ Extensiones instaladas
- ✅ PHPMailer disponible o no
- ✅ Logs de envios anteriores

---

## 🔧 Paso 2: Elegir el Método de Envío

### Opción A: Usar mail() (Si funciona)
**Ventaja:** Sin dependencias externas  
**Desventaja:** Requiere SMTP configurado en el servidor

```php
// En enviar_contacto.php, se intenta automáticamente
$enviado = enviarConMailPHP(...);
```

### Opción B: Usar PHPMailer (RECOMENDADO) ⭐
**Ventaja:** Funciona con SMTP de cualquier proveedor  
**Desventaja:** Requiere instalar la librería

#### Instalación:
```bash
composer require phpmailer/phpmailer
```

#### Configuración (en enviar_contacto.php):
```php
// Línea ~62: Actualiza las credenciales
$mail->Host = 'smtp.gmail.com';           // Servidor SMTP
$mail->Username = 'tu-email@gmail.com';   // Tu email
$mail->Password = 'tu-contraseña-app';    // Contraseña de aplicación
```

#### Para Gmail:
1. Activa autenticación de 2 factores: https://myaccount.google.com/security
2. Genera contraseña de aplicación: https://myaccount.google.com/apppasswords
3. Usa esa contraseña (16 caracteres) en SMTP_PASSWORD

### Opción C: Guardar en Archivos (Respaldo)
**Ventaja:** Nunca pierdes un contacto  
**Desventaja:** Requiere envío manual o cron job

```
Los contactos fallidos se guardan en: /contactos_pendientes/
Reenvia con: php reenviar_contactos.php
```

---

## 📝 Paso 3: Revisar los Logs

Los logs se guardan en `/logs/contactos.log`

### Ejemplo de log exitoso:
```
[2026-01-28 14:30:15] INICIO: Procesando contacto de user@example.com a prof@example.com
[2026-01-28 14:30:15] DEBUG: Enviando email a prof@example.com
[2026-01-28 14:30:15] SUCCESS: Email enviado a prof@example.com
[2026-01-28 14:30:15] SUCCESS: Contacto procesado correctamente
```

### Ejemplo de log con error:
```
[2026-01-28 14:30:15] INICIO: Procesando contacto...
[2026-01-28 14:30:15] ERROR: mail() retornó false
[2026-01-28 14:30:15] FALLBACK: Intentando con PHPMailer...
[2026-01-28 14:30:15] PHPMailer ERROR: SMTP Error: Could not authenticate
[2026-01-28 14:30:15] RESPALDO: Guardando en archivo...
[2026-01-28 14:30:15] ARCHIVO: Contacto guardado en contacto_1706447415_abc123.json
```

---

## 🚀 Paso 4: Pruebas

### Test desde Web:
1. Accede a: `http://tu-sitio.com/diagnostico_email.php`
2. Ingresa tu email en "Prueba de Envío de Email"
3. Haz clic en "Enviar Email de Prueba"
4. Revisa tu bandeja (incluida spam)

### Test desde CLI:
```bash
php reenviar_contactos.php
```

---

## 🔍 Solución de Problemas

### "Los emails van a spam"
- Problema: SPF, DKIM, DMARC no configurados
- Solución: Configura registros SPF en tu DNS
  ```
  v=spf1 include:smtp.gmail.com ~all
  ```

### "mail() retorna false"
- Problema: SMTP no configurado en el servidor
- Solución: Usa PHPMailer con credenciales SMTP

### "PHPMailer dice: Could not authenticate"
- Problema: Credenciales SMTP incorrectas
- Solución: 
  - Verifica usuario y contraseña
  - Si usas Gmail, usa contraseña de aplicación (16 caracteres)
  - Verifica que el puerto sea correcto (587 para STARTTLS)

### "Contactos no se envían pero no hay logs"
- Problema: Directorios no tienen permisos de escritura
- Solución: 
  ```bash
  chmod 755 /path/to/logs
  chmod 755 /path/to/contactos_pendientes
  ```

---

## 📊 Flujo de Envío Automático

```
Contacto Enviado
    ↓
[1] Intenta mail() de PHP
    ├─ ✅ Si funciona → Éxito
    └─ ❌ Si falla → Continúa
    ↓
[2] Intenta PHPMailer
    ├─ ✅ Si funciona → Éxito
    └─ ❌ Si falla → Continúa
    ↓
[3] Guarda en /contactos_pendientes/
    ├─ ✅ Puede reenviarse manualmente
    └─ Espera a que corijas la configuración
```

---

## 📋 Checklist Final

- [ ] Accedí a `diagnostico_email.php`
- [ ] Verifiqué qué método está disponible (mail() o PHPMailer)
- [ ] Configuré las credenciales SMTP si uso PHPMailer
- [ ] Envié un email de prueba
- [ ] Revisé los logs en `/logs/contactos.log`
- [ ] Los profesionales reciben los emails
- [ ] Configuré reenvío automático de contactos fallidos (opcional)

---

## 🎯 Archivos Principales

| Archivo | Función |
|---------|---------|
| `enviar_contacto.php` | Backend principal de envío |
| `diagnostico_email.php` | Herramienta de diagnóstico |
| `reenviar_contactos.php` | Script para reenviar fallidos |
| `/logs/contactos.log` | Archivo de logs |
| `/contactos_pendientes/` | Contactos que fallaron |

---

## 📞 Soporte

Si aún tienes problemas:

1. **Revisa los logs** en `/logs/contactos.log`
2. **Ejecuta el diagnóstico** en `diagnostico_email.php`
3. **Verifica credenciales SMTP** en `enviar_contacto.php`
4. **Comprueba permisos** de directorios (755)
5. **Prueba con PHPMailer** si mail() no funciona
