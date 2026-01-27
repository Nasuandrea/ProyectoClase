document.querySelector('searchInput').addEventListener('input'),
function(e){
    // funcion añade evento de escucha al input, lo pasa a minuscula, busca dentro de los filtros

    const searchTerm = e.target.value.toLowerCase();
    const allFilters = [
        ...skills, ...catergorias,...localidad,...modalidad,...provicia,...nombre,...ciudad
    ];
    const filtered = allFilters.filter(
        skill =>
            skill.id.toLowerCase().includes(searchTerm)
    );
    // añadir las busquedas y mostrarlas
    if(searchTerm){
        // deja en blanco el mainGrid dentro del html. esto deberia cambiar a verse todos.
        document.querySelector('mainGrid').innerHTML='';
        filtered.forEach(skill => createCard(skill, 'mainGrid'));
    }
    else {
        document.querySelector('mainGrid').innerHTML='';
        skills.forEach(skill => createCard(skill,'mainGrid'));
    }

}

//falta revisar el nombre de las id/clases para que coincidan 