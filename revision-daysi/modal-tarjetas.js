function setupModalButtons() {
    console.log('Configurando botones del modal...');
    const botonesAbrirModal = document.querySelectorAll('.abrir-modal');
    console.log('Botones .abrir-modal encontrados:', botonesAbrirModal.length);
    
    botonesAbrirModal.forEach((boton, index) => {
        // Remover event listeners anteriores para evitar duplicados
        boton.replaceWith(boton.cloneNode(true));
    });
    
    // Re-seleccionar los botones después de clonar
    const nuevosBotones = document.querySelectorAll('.abrir-modal');
    nuevosBotones.forEach((boton, index) => {
        console.log(`Configurando botón ${index}:`, boton);
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log('Botón Ver más clickeado');
            const usuarioData = boton.getAttribute('data-usuario');
            if (usuarioData) {
                try {
                    const usuario = JSON.parse(usuarioData);
                    console.log('Usuario parseado:', usuario);
                    mostrarInfoUsuario(usuario);
                } catch (error) {
                    console.error('Error al parsear datos del usuario:', error);
                }
            } else {
                console.error('No se encontró data-usuario en el botón');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones para abrir modal
    const botonCerrar = document.querySelector("#botonCerrar");
    const modal = document.querySelector("#modal-usuario");

    console.log('Modal setup - modal encontrado:', !!modal);
    console.log('Modal setup - boton cerrar encontrado:', !!botonCerrar);

    // Intentar configurar botones iniciales (puede que no existan aún)
    setupModalButtons();

    // Botón para cerrar modal
    if (botonCerrar) {
        botonCerrar.addEventListener("click", () => {
            cerrarModal();
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }

    // Configurar animaciones para contenedores
    const contenedores = document.querySelectorAll('.contenedor1');
    if (contenedores.length > 0) {
        contenedores.forEach((elemento, index) => {
            elemento.style.animationDelay = `${(index + 1) * 0.3}s`;
        });
    }
});

function abrirModal() {
    console.log('Abriendo modal...');
    const modal = document.querySelector("#modal-usuario");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevenir scroll del fondo
        console.log("Modal abierto exitosamente");
    } else {
        console.log('Modal no encontrado');
    }
}

function cerrarModal() {
    console.log('Cerrando modal...');
    const modal = document.querySelector("#modal-usuario");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Restaurar scroll
        console.log("Modal cerrado exitosamente");
    } else {
        console.log('Modal no encontrado');
    }
}

// Función para mostrar información de usuario en el modal
function mostrarInfoUsuario(usuario) {
    console.log('mostrarInfoUsuario llamado con:', usuario);
    const modalContenido = document.querySelector("#modal-contenido");
    if (!modalContenido) {
        console.error('No se encontró #modal-contenido');
        return;
    }

    console.log('Generando HTML para el modal...');

    const skillsHTML = usuario.skills && usuario.skills.length > 0
        ? usuario.skills.map(skill => `<span class="tag">${skill}</span>`).join("")
        : '<span class="tag">Sin skills</span>';

    const categoriasHTML = usuario.categorias && usuario.categorias.length > 0
        ? usuario.categorias.map(cat => `<span class="tag category">${cat}</span>`).join("")
        : '<span class="tag category">Sin categoría</span>';

    modalContenido.innerHTML = `
        <div class="modal-header">
            <h2>${usuario.nombre}</h2>
            <button id="botonCerrar" class="btn-cerrar">&times;</button>
        </div>
        <div class="modal-body">
            <div class="avatar-section">
                <img src="${usuario.avatar2D || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijc1IiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K'}" 
                     alt="Avatar de ${usuario.nombre}"
                     style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%;"
                     onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijc1IiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K';">
            </div>
            <div class="info-section">
                <p><strong>Especialización:</strong> ${usuario.especializacion || 'No especificada'}</p>
                <p><strong>Ubicación:</strong> ${usuario.ciudad || 'No especificada'}, ${usuario.provincia || 'No especificada'}</p>
                <p><strong>Modalidad:</strong> ${usuario.modalidad || 'No especificada'}</p>
                
                <div class="nivel-section">
                    <div class="nivel-item">
                        <span>Backend:</span>
                        ${renderBarras(Number(usuario.backend) || 0)}
                    </div>
                    <div class="nivel-item">
                        <span>Frontend:</span>
                        ${renderBarras(Number(usuario.frontend) || 0)}
                    </div>
                </div>
                
                <div class="skills-section">
                    <h3>Skills</h3>
                    <div class="tags-container">${skillsHTML}</div>
                </div>
                
                <div class="categorias-section">
                    <h3>Categorías</h3>
                    <div class="tags-container">${categoriasHTML}</div>
                </div>
                
                ${usuario.descripcion ? `<div class="descripcion-section"><h3>Descripción</h3><p>${usuario.descripcion}</p></div>` : ''}
                
                ${usuario.enlaces ? `<div class="enlaces-section"><h3>Enlaces</h3><p>${usuario.enlaces}</p></div>` : ''}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-contacto">Contactar</button>
        </div>
    `;

    // Re-agregar event listener al botón cerrar (porque se recrea el HTML)
    const nuevoBotonCerrar = document.querySelector("#botonCerrar");
    if (nuevoBotonCerrar) {
        nuevoBotonCerrar.addEventListener("click", cerrarModal);
    }

    abrirModal();
}

function renderBarras(nivel) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<span class="barra ${i <= nivel ? "rellena" : ""}"></span>`;
    }
    return `<div class="barras-container">${html}</div>`;
}