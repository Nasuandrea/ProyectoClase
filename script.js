
// 1. CARGA DE HTML

async function includeHTML() {
    try {
        // Cargar Header
        const headerRes = await fetch('header.html');
        document.getElementById('include-header').innerHTML = await headerRes.text();
        // Cargar Main 
        const mainRes = await fetch('main.html');
        document.getElementById('include-main').innerHTML = await mainRes.text();
        // Cargar Footer
        const footerRes = await fetch('footer.html');
        document.getElementById('include-footer').innerHTML = await footerRes.text();
        // Una vez cargado el HTML, iniciamos la lógica de la app
        iniciarApp();
    } catch (err) {
        console.error('Error al cargar los archivos HTML. Asegúrate de usar un servidor local (localhost).', err);
    }
}

// Ejecutar carga inicial
document.addEventListener('DOMContentLoaded', includeHTML);
// 2. LÓGICA DE LA APLICACIÓN

let todosLosUsuarios = [];

function iniciarApp() {
    cargarUsuarios();
    cargarCategorias();
    
    // Buscador
    const inputBusqueda = document.getElementById('searchInput');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => filtrarGlobal(e.target.value));
    }
}

async function cargarUsuarios() {
    try {
        const response = await fetch('obtener_usuarios.php');
        const data = await response.json();
        
        const loading = document.getElementById('loading');
        if(loading) loading.style.display = 'none';
        
        if (data.success) {
            todosLosUsuarios = data.data;
            generarCards(todosLosUsuarios);
        } else {
            console.error('Error backend:', data.error);
        }
    } catch (error) {
        console.error('Error conexión:', error);
    }
}

async function cargarCategorias() {
    try {
        const response = await fetch('obtener_categorias.php');
        const data = await response.json();
        const lista = data.map(cat => cat.nombre || cat);
        generarBotonesCategorias(lista);
    } catch (error) {
        console.error('Error categorías:', error);
    }
}

function generarCards(lista) {
    const container = document.getElementById('cards-container');
    const noResults = document.getElementById('no-results');
    
    if(!container) return; // Si no se cargó el HTML aún

    container.innerHTML = '';

    if (lista.length === 0) {
        if(noResults) noResults.style.display = 'block';
        return;
    }
    if(noResults) noResults.style.display = 'none';

    lista.forEach(user => {
        const card = document.createElement('article');
        card.className = 'character-card';
        // MODAL ELIMINADO

        const img = user.avatar2D ? user.avatar2D : './img/usuario.png';
        const catTexto = (user.categorias && user.categorias.length) ? user.categorias[0] : 'DISPONIBLE';

        card.innerHTML = `
            <header class="card-header">
                <h3>${user.nombre}</h3>
            </header>
            <div class="avatar-container">
                <img src="${img}" alt="${user.nombre}">
            </div>
            <div class="card-footer-info">
                <span>${catTexto}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function generarBotonesCategorias(lista) {
    const nav = document.getElementById('categories-container');
    if(!nav) return;
    
    nav.innerHTML = '';

    // Botón TODOS
    const btnAll = document.createElement('button');
    btnAll.className = 'cat-btn active';
    btnAll.textContent = 'TODOS';
    btnAll.onclick = () => {
        filtrarPorCategoria(null);
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btnAll.classList.add('active');
    };
    nav.appendChild(btnAll);

    // Botones dinámicos
    lista.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.textContent = cat.toUpperCase();
        btn.onclick = () => {
            filtrarPorCategoria(cat);
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        nav.appendChild(btn);
    });
}

function filtrarGlobal(texto) {
    texto = texto.toLowerCase();
    const filtrados = todosLosUsuarios.filter(u => 
        u.nombre.toLowerCase().includes(texto) ||
        (u.ciudad && u.ciudad.toLowerCase().includes(texto)) ||
        (u.categorias && u.categorias.join(' ').toLowerCase().includes(texto))
    );
    generarCards(filtrados);
}

function filtrarPorCategoria(cat) {
    if(!cat) {
        generarCards(todosLosUsuarios);
        return;
    }
    const filtrados = todosLosUsuarios.filter(u => 
        u.categorias && u.categorias.includes(cat)
    );
    generarCards(filtrados);
}