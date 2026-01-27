/// ============================
// VARIABLES GLOBALES
// ============================
let todosLosUsuarios = [];

// ============================
// CARGA DE USUARIOS (CATÁLOGO)
// ============================
async function cargarUsuarios() {
  const container = document.getElementById("cards-container");
  if (!container) return; // No hay catálogo en la página

  const loading = document.getElementById("loading");
  const errorDiv = document.getElementById("error");

  try {
    const response = await fetch("obtener_usuarios.php");
    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const resultado = await response.json();
    if (loading) loading.style.display = "none";

    if (resultado.success) {
      todosLosUsuarios = resultado.data;
      if (todosLosUsuarios.length === 0) {
        mostrarMensaje("no-results");
      } else {
        generarCards(todosLosUsuarios);
      }
    } else {
      throw new Error(resultado.error || "Error desconocido");
    }
  } catch (error) {
    if (loading) loading.style.display = "none";
    if (errorDiv) {
      errorDiv.style.display = "block";
      errorDiv.textContent = "Error al cargar los usuarios: " + error.message;
    }
    console.error("Error:", error);
  }
}

// ============================
// GENERACIÓN DE CARDS
// ============================
function generarCards(usuarios) {
  const container = document.getElementById("cards-container");
  if (!container) return;

  const noResults = document.getElementById("no-results");
  container.innerHTML = "";

  if (usuarios.length === 0) {
    if (noResults) noResults.style.display = "block";
    return;
  }

  if (noResults) noResults.style.display = "none";

  usuarios.forEach((usuario) => {
    const card = crearCard(usuario);
    container.appendChild(card);
  });
}

function crearCard(usuario) {
  const card = document.createElement("div");
  card.className = "card";

  const iniciales = obtenerIniciales(usuario.nombre);

  const skillsHTML =
    usuario.skills.length > 0
      ? usuario.skills
          .map((skill) => `<span class="tag">${skill}</span>`)
          .join("")
      : '<span class="tag">Sin skills</span>';

  const categoriasHTML =
    usuario.categorias.length > 0
      ? usuario.categorias
          .map((cat) => `<span class="tag category">${cat}</span>`)
          .join("")
      : '<span class="tag category">Sin categoría</span>';

  const modalidadClass = `modalidad-${usuario.modalidad}`;

  card.innerHTML = `
        <div class="card-header">
            <div class="card-avatar"><img src= "${usuario.avatar2D}" alt="${iniciales}"></div>
            <div class="card-header-info">
                <h2>${usuario.nombre}</h2>
                <div class="card-location">📍 ${usuario.ciudad}, ${usuario.provincia}</div>
            </div>
        </div>

        <div class="card-body">
            <p class="card-description">${usuario.descripcion || "Desarrollador profesional"}</p>

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
            <button class="btn btn-secondary" onclick="editarUsuario(${usuario.id})">
                Editar
            </button>
            <button class="btn btn-secondary" onclick="verInfoUsuario(${usuario.id})">Ver más</button>
        </div>
    `;

  return card;
}

function obtenerIniciales(nombre) {
  const partes = nombre.split(" ");
  if (partes.length >= 2) {
    return partes[0][0] + partes[1][0];
  }
  return nombre.substring(0, 2).toUpperCase();
}

function contactar(email) {
  alert(`Contactar con: ${email}`);
}

function editarUsuario(id) {
  window.location.href = `editar_usuario.html?id=${id}`;
}

// ============================
// FILTROS
// ============================
function filtrarUsuarios() {
  const searchTermInput = document.getElementById("search");
  const modalidadSelect = document.getElementById("filter-modalidad");

  if (!searchTermInput || !modalidadSelect) return;

  const searchTerm = searchTermInput.value.toLowerCase();
  const modalidadFilter = modalidadSelect.value;

  const usuariosFiltrados = todosLosUsuarios.filter((usuario) => {
    const matchSearch =
      searchTerm === "" ||
      usuario.nombre.toLowerCase().includes(searchTerm) ||
      usuario.ciudad.toLowerCase().includes(searchTerm) ||
      usuario.descripcion.toLowerCase().includes(searchTerm);

    const matchModalidad =
      modalidadFilter === "" || usuario.modalidad === modalidadFilter;

    return matchSearch && matchModalidad;
  });

  generarCards(usuariosFiltrados);
}

function mostrarMensaje(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = "block";
}

// Cargar Avatar 2D
function inicializarAvatarUpload() {
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarInput = document.getElementById("avatarInput");
  const avatarPlus = document.getElementById("avatarPlus");

  if (!avatarPreview || !avatarInput) return;

  // Al hacer click en el círculo, abrir selector
  avatarPreview.addEventListener("click", () => {
    avatarInput.click();
  });

  // Cuando se selecciona una imagen
  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      avatarInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      avatarPreview.innerHTML = `<img src="${reader.result}" alt="Avatar">`;
    };
    reader.readAsDataURL(file);
  });
}

//Funcion para que las tarjetas cambien a info
function verInfoUsuario(id) {
  const container = document.getElementById("cards-container");
  if (!container) return;

  fetch(`obtener_info.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) throw new Error(data.error || "Error desconocido");

      const usuario = data.data;

      // Generamos una "tarjeta detallada"
      const card = document.createElement("div");
      card.className = "card";

      const skillsHTML =
        usuario.skills.length > 0
          ? usuario.skills
              .map((skill) => `<span class="tag">${skill}</span>`)
              .join("")
          : '<span class="tag">Sin skills</span>';

      const categoriasHTML =
        usuario.categorias.length > 0
          ? usuario.categorias
              .map((cat) => `<span class="tag category">${cat}</span>`)
              .join("")
          : '<span class="tag category">Sin categoría</span>';

      card.innerHTML = `
                <div class="card-header">
                    <div class="card-avatar"><img src="${usuario.avatar2D}"></div>
                    <div class="card-header-info">
                        <h2>${usuario.nombre}</h2>
                        <div class="card-location">📍 ${usuario.ciudad}, ${usuario.provincia}</div>
                    </div>
                </div>

                <div class="card-body">
                    <p class="card-description">${usuario.descripcion || "Desarrollador profesional"}</p>

                    <div class="card-section">
                        <div class="card-section-title">Especialización</div>
                        <span>${usuario.especializacion || "No definida"}</span>
                    </div>

                    <div class="card-section">
                        <div class="card-section-title">Skills</div>
                        <div class="tags">${skillsHTML}</div>
                    </div>

                    <div class="card-section">
                        <div class="card-section-title">Categorías</div>
                        <div class="tags">${categoriasHTML}</div>
                    </div>

                    <div class="card-section">
                        <div class="card-section-title">Modalidad</div>
                        <span class="modalidad-badge modalidad-${usuario.modalidad}">${usuario.modalidad}</span>
                    </div>

                    <div class="card-section">
                        <div class="card-section-title">Nivel Backend</div>
                        ${renderBarras(Number(usuario.backend))}
                    </div>

                    <div class="card-section">
                        <div class="card-section-title">Nivel Frontend</div>
                        ${renderBarras(Number(usuario.frontend))}
                    </div>
                </div>

                <div class="card-footer">
                    <a href="${usuario.enlaces}" target="_blank" class="btn btn-primary">Ver Portfolio</a>
                </div>
            `;

      // Reemplaza la tarjeta anterior
      container.innerHTML = "";
      container.appendChild(card);
    })
    .catch((error) => console.error("Error al obtener info:", error));
}

// Función auxiliar para renderizar barras (backend/frontend)
function renderBarras(nivel) {
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += `<span class="barra ${i < nivel ? 'rellena' : ''}"></span>`;
    }
    return `<div class="barras-container">${html}</div>`;
}

// ============================
// CARGA DE SKILLS Y CATEGORÍAS PARA EL FORMULARIO
// ============================
async function cargarSkillsYCategorias() {
  const skillsDiv = document.getElementById("skills-list");
  const catsDiv = document.getElementById("categories-list");
  if (!skillsDiv || !catsDiv) return;

  try {
    const skillsRes = await fetch("obtener_skills.php");
    const skills = await skillsRes.json();

    const catsRes = await fetch("obtener_categorias.php");
    const cats = await catsRes.json();

    skillsDiv.innerHTML = "";
    catsDiv.innerHTML = "";

    skills.forEach((s) => {
      skillsDiv.innerHTML += `
                <label>
                    <input type="checkbox" name="skills[]" value="${s.nombre}">
                    <span>${s.nombre}</span>
                </label>
            `;
    });

    cats.forEach((c) => {
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
function inicializarFormulario() {
  const form = document.getElementById("registroForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Recoger skills y categorías seleccionadas
    const selectedSkills = [
      ...document.querySelectorAll("input[name='skills[]']:checked"),
    ].map((el) => el.value);
    const selectedCats = [
      ...document.querySelectorAll("input[name='categorias[]']:checked"),
    ].map((el) => el.value);

    // Añadir nuevas si se escribieron
    const newSkill = document.getElementById("new-skill")?.value.trim();
    const newCat = document.getElementById("new-category")?.value.trim();

    if (newSkill) selectedSkills.push(newSkill);
    if (newCat) selectedCats.push(newCat);

    formData.append("skills", selectedSkills.join(","));
    formData.append("categorias", selectedCats.join(","));

    try {
      const response = await fetch("registrar_usuario.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const mensaje = document.getElementById("registroMensaje");

      if (data.success) {
        mensaje.innerHTML = "✅ Usuario registrado correctamente";
        form.reset();
        cargarSkillsYCategorias(); // recargar listas
      } else {
        mensaje.innerHTML = "❌ Error: " + data.error;
      }
    } catch (error) {
      console.error(error);
      document.getElementById("registroMensaje").innerHTML =
        "❌ Error al enviar formulario";
    }
  });
}

// ============================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
  cargarSkillsYCategorias();
  inicializarFormulario();
  inicializarAvatarUpload();

  // Filtros del catálogo
  document.getElementById("search")?.addEventListener("input", filtrarUsuarios);
  document
    .getElementById("filter-modalidad")
    ?.addEventListener("change", filtrarUsuarios);
});
