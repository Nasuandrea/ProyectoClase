// Variables globales
let todosLosUsuarios = [];

// Función principal para cargar usuarios
async function cargarUsuarios() {
    const loading = document.getElementById('loading');
    const container = document.getElementById('cards-container');
    const errorDiv = document.getElementById('error');
    
    try {
        const response = await fetch('obtener_usuarios.php');
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const resultado = await response.json();
        
        loading.style.display = 'none';
        
        if (resultado.success) {
            todosLosUsuarios = resultado.data;
            
            if (todosLosUsuarios.length === 0) {
                mostrarMensaje('no-results');
            } else {
                generarCards(todosLosUsuarios);
            }
        } else {
            throw new Error(resultado.error || 'Error desconocido');
        }
        
    } catch (error) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Error al cargar los usuarios: ' + error.message;
        console.error('Error:', error);
    }
}

// Función para generar las cards
function generarCards(usuarios) {
    const container = document.getElementById('cards-container');
    const noResults = document.getElementById('no-results');
    
    container.innerHTML = '';
    
    if (usuarios.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    usuarios.forEach(usuario => {
        const card = crearCard(usuario);
        container.appendChild(card);
    });
}

// Función para crear una card individual
function crearCard(usuario) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Obtener iniciales para el avatar
    const iniciales = obtenerIniciales(usuario.nombre);
    
    // Generar HTML de skills
    const skillsHTML = usuario.skills.length > 0 
        ? usuario.skills.map(skill => `<span class="tag">${skill}</span>`).join('')
        : '<span class="tag">Sin skills</span>';
    
    // Generar HTML de categorías
    const categoriasHTML = usuario.categorias.length > 0
        ? usuario.categorias.map(cat => `<span class="tag category">${cat}</span>`).join('')
        : '<span class="tag category">Sin categoría</span>';
    
    // Determinar clase de modalidad
    const modalidadClass = `modalidad-${usuario.modalidad}`;
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-avatar">${iniciales}</div>
            <div class="card-header-info">
                <h2>${usuario.nombre}</h2>
                <div class="card-location">📍 ${usuario.ciudad}, ${usuario.provincia}</div>
            </div>
        </div>
        
        <div class="card-body">
            <p class="card-description">${usuario.descripcion || 'Desarrollador profesional'}</p>
            
            <div class="card-section">
                <div class="card-section-title">Modalidad</div>
                <span class="modalidad-badge ${modalidadClass}">${usuario.modalidad}</span>
            </div>
            
            <div class="card-section">
                <div class="card-section-title">Habilidades</div>
                <div class="tags">
                    ${skillsHTML}
                </div>
            </div>
            
            <div class="card-section">
                <div class="card-section-title">Especialización</div>
                <div class="tags">
                    ${categoriasHTML}
                </div>
            </div>
        </div>
        
        <div class="card-footer">
            <a href="${usuario.enlaces}" target="_blank" class="btn btn-primary">
                Ver Portfolio
            </a>
            <button class="btn btn-secondary" onclick="contactar('${usuario.email}')">
                Contactar
            </button>
        </div>
    `;
    
    return card;
}

// Función para obtener iniciales
function obtenerIniciales(nombre) {
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
        return partes[0][0] + partes[1][0];
    }
    return nombre.substring(0, 2).toUpperCase();
}

// Función para contactar (placeholder)
function contactar(email) {
    alert(`Contactar con: ${email}`);
    // Aquí puedes implementar un modal o redireccionar a un formulario
}

// Función para filtrar usuarios
function filtrarUsuarios() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const modalidadFilter = document.getElementById('filter-modalidad').value;
    
    let usuariosFiltrados = todosLosUsuarios.filter(usuario => {
        const matchSearch = searchTerm === '' || 
            usuario.nombre.toLowerCase().includes(searchTerm) ||
            usuario.ciudad.toLowerCase().includes(searchTerm) ||
            usuario.descripcion.toLowerCase().includes(searchTerm);
        
        const matchModalidad = modalidadFilter === '' || 
            usuario.modalidad === modalidadFilter;
        
        return matchSearch && matchModalidad;
    });
    
    generarCards(usuariosFiltrados);
}

// Función para mostrar mensaje
function mostrarMensaje(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    
    // Agregar event listeners para filtros
    document.getElementById('search').addEventListener('input', filtrarUsuarios);
    document.getElementById('filter-modalidad').addEventListener('change', filtrarUsuarios);
});
```

## 5. **Estructura de archivos en tu servidor**
```

/*
tu-proyecto/
│
├── conexion.php          (tu archivo de conexión existente)
├── obtener_usuarios.php  (nuevo archivo)
├── index.html            (nuevo archivo)
├── styles.css            (nuevo archivo)
└── script.js             (nuevo archivo) */