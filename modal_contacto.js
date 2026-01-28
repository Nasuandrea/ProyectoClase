// ============================
// LÓGICA DEL MODAL DE CONTACTO
// ============================

/**
 * Abre el modal de contacto y obtiene los datos del profesional
 * @param {number} userId - ID del usuario/profesional a contactar
 */
async function contactar(userId) {
    const modal = document.getElementById('modal-contacto');
    const emailDestinatario = document.getElementById('email-destinatario');
    const nombreDestinatario = document.getElementById('nombre-destinatario');
    
    if (!modal || !emailDestinatario) {
        console.error('Modal de contacto no encontrado en el DOM');
        return;
    }

    try {
        // Mostrar modal con estado de carga
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        if (nombreDestinatario) {
            nombreDestinatario.textContent = 'Cargando...';
        }
        
        // Limpiar formulario y mensajes previos
        limpiarFormularioContacto();
        
        // Obtener datos del profesional desde el endpoint
        const response = await fetch(`obtener_info.php?id=${userId}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener datos del profesional');
        }
        
        const resultado = await response.json();
        
        if (!resultado.success) {
            throw new Error(resultado.error || 'No se pudo cargar la información del profesional');
        }
        
        const usuario = resultado.data;
        
        // Configurar el email y nombre del destinatario
        emailDestinatario.value = usuario.email;
        
        if (nombreDestinatario) {
            nombreDestinatario.textContent = usuario.nombre;
        }
        
    } catch (error) {
        console.error('Error al cargar datos del profesional:', error);
        
        // Mostrar error en el modal
        if (nombreDestinatario) {
            nombreDestinatario.textContent = 'Error al cargar datos';
        }
        
        mostrarMensajeModal(
            '❌ No se pudo cargar la información del profesional. Por favor, intenta de nuevo.',
            'error'
        );
        
        // Cerrar el modal después de 3 segundos
        setTimeout(() => {
            cerrarModalContacto();
        }, 3000);
    }
}

/**
 * Cierra el modal de contacto
 */
function cerrarModalContacto() {
    const modal = document.getElementById('modal-contacto');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.classList.remove('modal-open');

    // Limpiar el formulario después de cerrar
    setTimeout(() => {
        limpiarFormularioContacto();
    }, 300); // Esperar a que termine la animación
}

/**
 * Limpia el formulario y los mensajes
 */
function limpiarFormularioContacto() {
    const form = document.getElementById('form-contacto');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');
    
    if (form) {
        form.reset();
    }
    
    if (mensajeRespuesta) {
        mensajeRespuesta.textContent = '';
        mensajeRespuesta.className = 'mensaje-respuesta';
    }
}

/**
 * Muestra un mensaje de respuesta en el modal
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - 'success' o 'error'
 */
function mostrarMensajeModal(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje-respuesta');
    if (!mensajeDiv) return;

    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = `mensaje-respuesta ${tipo}`;
    
    // Auto-ocultar mensaje de éxito después de 5 segundos
    if (tipo === 'success') {
        setTimeout(() => {
            mensajeDiv.className = 'mensaje-respuesta';
        }, 5000);
    }
}

/**
 * Maneja el envío del formulario de contacto
 */
async function enviarFormularioContacto(event) {
    event.preventDefault();

    const form = document.getElementById('form-contacto');
    const btnEnviar = document.getElementById('btn-enviar');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    // Deshabilitar botón y mostrar spinner
    btnEnviar.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    // Recoger datos del formulario
    const formData = new FormData(form);

    try {
        // Enviar datos al backend
        const response = await fetch('enviar_contacto.php', {
            method: 'POST',
            body: formData
        });

        // Verificar si la respuesta es válida
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // Mostrar mensaje de éxito
            mostrarMensajeModal('✅ ' + data.message, 'success');
            
            // Limpiar formulario
            form.reset();
            
            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                cerrarModalContacto();
            }, 2000);
        } else {
            // Mostrar error del servidor
            mostrarMensajeModal('❌ ' + (data.error || 'Error al enviar el mensaje'), 'error');
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        mostrarMensajeModal('❌ Error de conexión. Por favor, intenta de nuevo.', 'error');
    } finally {
        // Rehabilitar botón y ocultar spinner
        btnEnviar.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
    }
}

/**
 * Cerrar modal al hacer clic fuera del contenedor
 */
function configurarCierreExterior() {
    const modal = document.getElementById('modal-contacto');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        // Si el clic fue en el overlay (no en el contenedor)
        if (e.target === modal) {
            cerrarModalContacto();
        }
    });
}

/**
 * Cerrar modal con la tecla ESC
 */
function configurarCierreConTecla() {
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('modal-contacto');
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            cerrarModalContacto();
        }
    });
}

/**
 * Inicializar el sistema de contacto
 * Llamar esta función cuando el DOM esté listo
 */
function inicializarModalContacto() {
    const form = document.getElementById('form-contacto');
    
    if (form) {
        form.addEventListener('submit', enviarFormularioContacto);
    }

    // Configurar cierre con clic exterior y tecla ESC
    configurarCierreExterior();
    configurarCierreConTecla();
}