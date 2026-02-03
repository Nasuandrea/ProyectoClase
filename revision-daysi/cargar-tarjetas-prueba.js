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
        console.log('Iniciando cargarUsuarios...');
        const loading = document.getElementById("loading");
        const container = document.getElementById("cards-container");
        const errorDiv = document.getElementById("error");

        try {
          console.log('Haciendo fetch a obtener_usuarios.php...');
          const response = await fetch("obtener_usuarios.php");

          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }

          const resultado = await response.json();
          console.log('Respuesta recibida:', resultado);

          loading.style.display = "none";

          if (resultado.success) {
            usuarios = resultado.data;
            console.log('Usuarios cargados:', usuarios.length);

            if (usuarios.length === 0) {
              mostrarMensaje("no-results");
            } else {
              generarCards(usuarios);
              // Configurar botones del modal después de crear las cards
              if (typeof setupModalButtons === 'function') {
                setupModalButtons();
              }
            }
          } else {
            throw new Error(resultado.error || "Error desconocido");
          }
        } catch (error) {
          console.error("Error en cargarUsuarios:", error);
          // estos estilos se generan dinamicamente y se tienen que mantener como esta aca
          loading.style.display = "none";
          errorDiv.style.display = "block";
          errorDiv.textContent =
            "Error al cargar los usuarios: " + error.message;
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
        .catch((error) =>
          console.error("Error al cargar las categorías:", error),
        );

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
          
          // Validar que existan los datos necesarios
          const nombre = usuario.nombre || 'Sin nombre';
          const avatar = usuario.avatar2D || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijc1IiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K';
          const especializacion = usuario.especializacion || 'Sin especialización';
          
          card.innerHTML = `
            <h3>${nombre}</h3>
            <img src="${avatar}" alt="Avatar de ${nombre}" 
                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;"
                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjQ0NDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijc1IiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K'; console.log('Imagen no encontrada:', '${avatar}');">
            <p>Profesión: ${especializacion}</p>
            <button class="abrir-modal btn-ver-mas" data-usuario='${JSON.stringify(usuario).replace(/'/g, "&apos;")}'>Ver más</button>
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
        let contenerdorBoton = document.querySelector(
          ".contenedor-boton-categorias",
        );
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
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded ejecutado - cargando usuarios...');
        cargarUsuarios();
        // Las categorías ya se cargan automáticamente con el fetch de arriba
      });

      function filtrarCategorias(categoriaSeleccionada) {
        if (!categoriaSeleccionada) {
          generarCards(usuarios);
        } else {
          const usuariosFiltrados = usuarios.filter(
            (usuario) =>
              usuario.categorias &&
              usuario.categorias.includes(categoriaSeleccionada),
          );
          generarCards(usuariosFiltrados);
        }
        // Re-configurar botones del modal después de generar cards
        setTimeout(() => {
          if (typeof setupModalButtons === 'function') {
            setupModalButtons();
          }
        }, 100);
      }