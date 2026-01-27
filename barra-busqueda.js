document.querySelector('searchInput').addEventListener('input',

// let obtenerSkills => Response.json
function(e){
    // funcion añade evento de escucha al input, lo pasa a minuscula, busca dentro de los filtros

    const searchTerm = e.target.value.toLowerCase();
    const allFilters = [
        // ...s.nombre, ...u.nombre
    ];
    const filtered = allFilters.filter(
        skills =>
            skills.nombre.toLowerCase().includes(searchTerm)
    );
    // añadir las busquedas y mostrarlas
    if(searchTerm){
        // deja en blanco el mainGrid dentro del html. esto deberia cambiar a verse todos.
        document.querySelector('mainGrid').innerHTML='';

        filtered.forEach(skills => createCard(skills,'mainGrid'));
    }
    else {
        document.querySelector('mainGrid').innerHTML='';

        skills.forEach(skills => createCard(skills,'mainGrid'));
        
    }

});

//falta revisar el nombre de las id/clases para que coincidan 
// crear una funcion que cree contenedor de skills dentro de cards