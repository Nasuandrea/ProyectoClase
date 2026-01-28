

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
            
            // Filtrar usuarios por nombre o categorías
            const busquedaFiltrada = todosLosUsuarios.filter(usuario => 
                usuario.nombre.toLowerCase().includes(texto) ||
                (usuario.categorias && usuario.categorias.toString().toLowerCase().includes(texto))
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
            <img src="${usuario.avatar2D}" alt="Avatar de ${usuario.nombre}">
            <p>${usuario.categorias ? usuario.categorias.join(', ') : 'Sin categoría'}</p>
        `;
        resultado.appendChild(div);
    });
}



//falta revisar el nombre de las id/clases para que coincidan 
// crear una funcion que cree contenedor de skills dentro de cards