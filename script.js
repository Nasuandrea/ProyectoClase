// ============================
// VARIABLES GLOBALES
// ============================
let todosLosUsuarios = [];

// ============================
// CARGA DE USUARIOS (CATÁLOGO)
// ============================
async function cargarUsuarios() {
    const loading = document.getElementById('loading');
    const container = document.getElementById('cards-container');
    const errorDiv = document.getElementById('error');

    try {
        const response = await fetch('obtener_usuarios.php');
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

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

// ============================
// GENERACIÓN DE CARDS
// ============================
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

function crearCard(usuario) {
    const card = document.createElement('div');
    card.className = 'card';

    const iniciales = obtenerIniciales(usuario.nombre);

    const skillsHTML = usuario.skills.length > 0
        ? usuario.skills.map(skill => `<span class="tag">${skill}</span>`).join('')
        : '<span class="tag">Sin skills</span>';

    const categoriasHTML = usuario.categorias.length > 0
        ? usuario.categorias.map(cat => `<span class="tag category">${cat}</span>`).join('')
        : '<span class="tag category">Sin categoría</span>';

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

function obtenerIniciales(nombre) {
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
        return partes[0][0] + partes[1][0];
    }
    return nombre.substring(0, 2).toUpperCase();
}

function contactar(email) {
    alert(`Contactar con: ${email}`);
}

// ============================
// FILTROS
// ============================
function filtrarUsuarios() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const modalidadFilter = document.getElementById('filter-modalidad').value;

    let usuariosFiltrados = todosLosUsuarios.filter(usuario => {
        const matchSearch =
            searchTerm === '' ||
            usuario.nombre.toLowerCase().includes(searchTerm) ||
            usuario.ciudad.toLowerCase().includes(searchTerm) ||
            usuario.descripcion.toLowerCase().includes(searchTerm);

        const matchModalidad =
            modalidadFilter === '' ||
            usuario.modalidad === modalidadFilter;

        return matchSearch && matchModalidad;
    });

    generarCards(usuariosFiltrados);
}

function mostrarMensaje(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

// ============================
// CARGA DE SKILLS Y CATEGORÍAS PARA EL FORMULARIO
// ============================
async function cargarSkillsYCategorias() {
    try {
        // Fetch skills
        const skillsRes = await fetch("obtener_skills.php");
        const skills = await skillsRes.json();
        console.log("Skills:", skills);

        // Fetch categories
        const catsRes = await fetch("obtener_categorias.php");
        const cats = await catsRes.json();
        console.log("Categorías:", cats);

        const skillsDiv = document.getElementById("skills-list");
        const catsDiv = document.getElementById("categories-list");

        if (!skillsDiv || !catsDiv) {
            console.error("No existen los contenedores skills-list o categories-list en el HTML");
            return;
        }

        skillsDiv.innerHTML = "";
        catsDiv.innerHTML = "";

        // Pintar skills
        skills.forEach(s => {
            skillsDiv.innerHTML += `
                <label>
                    <input type="checkbox" name="skills[]" value="${s.nombre}">
                    <span>${s.nombre}</span>
                </label>
            `;
        });

        // Pintar categorías
        cats.forEach(c => {
            catsDiv.innerHTML += `
                <label>
                    <input type="checkbox" name="categorias[]" value="${c.nombre}">
                    <span>${c.nombre}</span>
                </label>
            `;
        });

    } catch (error) {
        console.error("Error cargando skills o categorías:", error);
    }
}

// ============================
// ENVÍO DEL FORMULARIO DE REGISTRO
// ============================
document.addEventListener("DOMContentLoaded", () => {
    // Cargar datos
    cargarUsuarios();
    cargarSkillsYCategorias();

    // Filtros del catálogo
    document.getElementById('search').addEventListener('input', filtrarUsuarios);
    document.getElementById('filter-modalidad').addEventListener('change', filtrarUsuarios);

    // Registro nuevo usuario
    document.getElementById("registroForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Recoger skills seleccionadas
        const selectedSkills = [...document.querySelectorAll("input[name='skills[]']:checked")]
            .map(el => el.value);

        // Recoger categorías seleccionadas
        const selectedCats = [...document.querySelectorAll("input[name='categorias[]']:checked")]
            .map(el => el.value);

        // Añadir nuevas si se escribieron
        const newSkill = document.getElementById("new-skill").value.trim();
        const newCat = document.getElementById("new-category").value.trim();

        if (newSkill) selectedSkills.push(newSkill);
        if (newCat) selectedCats.push(newCat);

        formData.append("skills", selectedSkills.join(","));
        formData.append("categorias", selectedCats.join(","));

        // Enviar al PHP
        try {
            const response = await fetch("registrar_usuario.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            const mensaje = document.getElementById("registroMensaje");

            if (data.success) {
                mensaje.innerHTML = "✅ Usuario registrado correctamente";
                form.reset();
                cargarUsuarios();          // Refrescar catálogo
                cargarSkillsYCategorias(); // Recargar listas por si hay nuevas
            } else {
                mensaje.innerHTML = "❌ Error: " + data.error;
            }

        } catch (error) {
            console.error(error);
            document.getElementById("registroMensaje").innerHTML = "❌ Error al enviar formulario";
        }
    });
});
