function crearTarjetasDinamicas(e) {

    let cardContainer = document.createElement("section");
    cardContainer.classList.add("#");//poner nombre de clase 
    cardContainer.innerHTML = `
        <div class="card">
            <h3>${e.nombre}</h3>
            <img src="${e.avatar2D}" alt="Avatar de ${e.nombre}">
            <p>${e.categorias ? e.categorias.join(', ') : 'Sin categoría'}</p>
        </div>
    `;

    

}