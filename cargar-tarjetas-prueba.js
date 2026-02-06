// Variables globales
let usuarios = [];

// Función para mostrar mensajes
function mostrarMensaje(tipo) {
  const noResults = document.getElementById("no-results");
  if (tipo === "no-results") {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
}
// funcion para informacion de usuarios
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

      // Reemplaza la tarjeta anterior
      container.innerHTML = "";
      container.appendChild(card);
    })
    .catch((error) => console.error("Error al obtener info:", error));
}

// Función principal para cargar usuarios
async function cargarUsuarios() {
  const loading = document.getElementById("loading");
  const container = document.getElementById("cards-container");
  const errorDiv = document.getElementById("error");

  try {
    const response = await fetch("obtener_usuarios.php");

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const resultado = await response.json();

    loading.style.display = "none";

    if (resultado.success) {
      usuarios = resultado.data;

      if (usuarios.length === 0) {
        mostrarMensaje("no-results");
      } else {
        generarCards(usuarios);
      }
    } else {
      throw new Error(resultado.error || "Error desconocido");
    }
  } catch (error) {
    // estos estilos se generan dinamicamente y se tienen que mantener como esta aca
    loading.style.display = "none";
    errorDiv.style.display = "block";
    errorDiv.textContent = "Error al cargar los usuarios: " + error.message;
    console.error("Error:", error);
  }
}

//recogida de datos desde un archivo json
// let obtenerDatos ;
// fetch(obtenerDatos)
// .then(response => response.json())
let obtenerCategorias = "obtener_categorias.php";
let categorias = [];
fetch(obtenerCategorias)
  .then((response) => response.json())
  .then((data) => {
    categorias = data.map((cat) => cat.nombre);
    generarCategorias(categorias);
  })
  .catch((error) => console.error("Error al cargar las categorías:", error));

// const contenedorBoton = document.getElementById('contenedorBoton');

//function generar cards automaticas

//falta recoger el id desde el backend
function generarCards(usuarios) {
  let contenedorCard = document.querySelector(".contenedor-card");
  contenedorCard.innerHTML = "";
  //recorrido del array usuarios
  usuarios.forEach((usuario) => {
    let card = document.createElement("div");
    card.classList.add("card");
    // contenedor de lo que tiene dentro la card
    // faltaria incluile las clases de css que necesiten
    //incluir el contenido de modal-tarjetas.html dentro.
    card.innerHTML = `
          <!-- contenedor general de la card -->
        <div id="mainGrid" data-user-id="${usuario.id}" class="roster-grid"
          <!-- contenedor avatar 2d -->
          <div class="avatar-container character-card">
          <article class="character-card">
          <header class="card-header">
            <h3>${usuario.nombre}</h3>
          </header>
          <div class="player-badge">
            <img class="img avatar-silhoutte" src="${usuario.avatar2D}" alt="Avatar de ${usuario.nombre}">
          </div>
          <div class="card-footer-info">
            <span>Profesión: ${usuario.especializacion}</span>
            <!--<button class="btn-open" data-id="${usuario.id}">Ver más</button>-->
          </div>
          </article>
          </div>
        
        <!-- contenedor avatar 3d y skills (contenedor por tarjeta) -->
            <div class="containerAvatar3d con" style="display:none;">
                <div class="contenedorAvatar">
                    <h3>${usuario.nombre}</h3>
                    <img class="img" src="${usuario.avatar3D}" alt="Avatar 3D de ${usuario.nombre}">
                    <p>Especialización: ${usuario.especializacion}</p>
                    <button class="btn-close">X</button>
                </div>
                <!-- contenedor flip card (probar si lo puedo sacar) -->
            <div class="flip-card-front">
            <div class="contenedorAvatar">
              <div class="contenedor1">
                        <div class="card-section-title">Nivel Backend</div>
                        ${renderBarras(Number(usuario.backend))}
              </div>

                <div class="contenedor1">
                        <div class="card-section-title">Nivel Frontend</div>
                        ${renderBarras(Number(usuario.frontend))}
                </div>

                <div class="contenedor1">
                  <h2>Info</h2>
                  <div>${usuario.descripcion}</div>
                  <div>${usuario.enlaces}</div>
                </div>

                <div class="contenedor1">
                  <div class="card-location">📍 ${usuario.ciudad}, ${usuario.provincia}
                    <button id="flipFormulario" onclick="flip()">contacto</button>
                  </div>
                </div>
                </div>
                <div class="flip-card-back">
                
                <!-- Aquí va el contenido del formulario de contacto -->
                   <div id="modal-contacto" class="modal-overlay">
    <div class="modal-container">
        <!-- Botón de cerrar -->
        <button class="modal-close" onclick="cerrarModalContacto()">&times;</button>
        
        <!-- Encabezado del modal -->
        <div class="modal-header">
            <h2>Contactar Profesional</h2>
            <p id="modal-destinatario">Enviando mensaje a: <strong id="nombre-destinatario"></strong></p>
        </div>

        <!-- Formulario de contacto -->
        <form id="form-contacto" class="modal-form">
            <!-- Email destinatario (oculto) -->
            <input type="hidden" id="email-destinatario" name="email_destinatario">
            
            <!-- Nombre del interesado -->
            <div class="form-group">
                <label for="nombre-remitente">Tu nombre *</label>
                <input 
                    type="text" 
                    id="nombre-remitente" 
                    name="nombre_remitente" 
                    required
                    placeholder="Ej: Juan Pérez">
            </div>

            <!-- Email del interesado -->
            <div class="form-group">
                <label for="email-remitente">Tu correo electrónico *</label>
                <input 
                    type="email" 
                    id="email-remitente" 
                    name="email_remitente" 
                    required
                    placeholder="tu@email.com">
            </div>

            <!-- Asunto -->
            <div class="form-group">
                <label for="asunto">Asunto *</label>
                <input 
                    type="text" 
                    id="asunto" 
                    name="asunto" 
                    required
                    placeholder="Ej: Propuesta de colaboración">
            </div>

            <!-- Mensaje -->
            <div class="form-group">
                <label for="mensaje">Mensaje *</label>
                <textarea 
                    id="mensaje" 
                    name="mensaje" 
                    required
                    rows="6"
                    placeholder="Escribe tu mensaje aquí..."></textarea>
            </div>

            <!-- Mensaje de respuesta -->
            <div id="mensaje-respuesta" class="mensaje-respuesta"></div>

            <!-- Botones de acción -->
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="cerrarModalContacto()">
                    Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btn-enviar">
                    <svg id="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 24H18V22H20V24ZM22 18H24V20H22V22H20V20H14V18H20V16H22V18ZM22 12H20V6H4V18H12V20H2V4H22V12ZM20 16H18V14H20V16ZM14 14H10V12H14V14ZM10 12H8V10H10V12ZM16 12H14V10H16V12ZM8 10H6V8H8V10ZM18 10H16V8H18V10Z" fill="#1F2933"/>
                    </svg>
                </button>
            </div>
        </form>
    </div>
</div>
                  </div>
            </div>
        </div>
        `;
    contenedorCard.appendChild(card);
  });
}

function renderBarras(nivel) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="barra ${i <= nivel ? "rellena" : ""}"></span>`;
  }
  return `<div class="barras-container">${html}</div>`;
}

function setupCardModalHandlers() {
  const container = document.querySelector(".contenedor-card");
  if (!container) return;
  container.addEventListener("click", (e) => {
    const openBtn = e.target.closest(".btn-open");
    if (openBtn) {
      const card = openBtn.closest(".card");
      const modal = card.querySelector(".containerAvatar3d");
      if (modal) {
        modal.style.display = "flex";
        const avatar = card.querySelector(".avatar-container");
        if (avatar) avatar.style.display = "none";
      }
      return;
    }
    const closeBtn = e.target.closest(".btn-close");
    if (closeBtn) {
      const card = closeBtn.closest(".card");
      const modal = card.querySelector(".containerAvatar3d");
      if (modal) modal.style.display = "none";
      const avatar = card.querySelector(".avatar-container");
      if (avatar) avatar.style.display = "block";
    }
  });
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

//funcion de categorias y filtro por categorias

//añado contenido dinamico que variaria segun la estructura del boton

function generarCategorias(categorias) {
  let contenerdorBoton = document.querySelector(".contenedor-boton-categorias");
  contenerdorBoton.innerHTML = "";
  // Botón para mostrar todas
  let botonTodas = document.createElement("button");
  botonTodas.classList.add("boton-categoria");
  botonTodas.onclick = () => filtrarCategorias(null);
  botonTodas.innerHTML = `<span class="nombre-categoria">Todas</span>`;
  contenerdorBoton.appendChild(botonTodas);
  //recorrer el array categorias y crear un boton por cada categoria
  categorias.forEach((categoria) => {
    let boton = document.createElement("button");
    boton.classList.add("boton-categoria");
    boton.onclick = () => filtrarCategorias(categoria);
    boton.innerHTML = `<span class="nombre-categoria">${categoria}</span>`;
    contenerdorBoton.appendChild(boton);
  });
}
window.onload = function () {
  cargarUsuarios();
  setupCardModalHandlers();
};

function filtrarCategorias(categoriaSeleccionada) {
  if (!categoriaSeleccionada) {
    generarCards(usuarios);
    return;
  }
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.categorias && usuario.categorias.includes(categoriaSeleccionada),
  );
  generarCards(usuariosFiltrados);
}
