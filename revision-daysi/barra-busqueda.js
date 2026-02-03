

// Variables globales
let todosLosUsuarios = [];

// Cargar usuarios desde el servidor
fetch('obtener_usuarios.php')
.then(response => response.json())
.then(data => {
    if (data.success) {
        todosLosUsuarios = data.data;
        console.log('Usuarios cargados:', todosLosUsuarios);
    }
})
.catch(error => console.error('Error al cargar usuarios:', error));

// Event listener para el input de búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const inputBusqueda = document.querySelector('.search-input');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function() {
            const texto = this.value.toLowerCase();
            
            // Si está vacío, limpiar resultados
            if (texto === '') {
                document.querySelector('#resultado').innerHTML = '';
                return;
            }
            
            // Filtrar usuarios por nombre, categoría o skills
            const busquedaFiltrada = todosLosUsuarios.filter(usuario => 
                usuario.nombre.toLowerCase().includes(texto) ||
                (usuario.categorias && usuario.categorias.toString().toLowerCase().includes(texto)) ||
                (usuario.skills && usuario.skills.toString().toLowerCase().includes(texto))
            );
            
            mostrarBusqueda(busquedaFiltrada);
        });
    }
});
function mostrarBusqueda(usuarios) { 
    const resultado = document.querySelector('#resultado');
    resultado.innerHTML = '';
    
    if (usuarios.length === 0) {
        resultado.innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }
    
    usuarios.forEach(usuario => {
        const div = document.createElement('div');
        div.classList.add('card');  
        div.innerHTML = `
            <h3>${usuario.nombre}</h3>
            <img src="${usuario.avatar2D || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijc1IiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K'}" 
                 alt="Avatar de ${usuario.nombre}"
                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;"
                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijc1IiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K'; console.log('Imagen no encontrada en búsqueda:', '${usuario.avatar2D}');">
            <p>${usuario.categorias ? usuario.categorias.join(', ') : 'Sin categoría'}</p>
        `;
        resultado.appendChild(div);
    });
}



//falta revisar el nombre de las id/clases para que coincidan 
