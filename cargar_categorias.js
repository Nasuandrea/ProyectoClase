// ==========================================
// INTEGRACIÓN DE BOTONES DE CATEGORÍAS
// ==========================================
let categoriaSeleccionada = "all";

/**
 * Carga los botones en el nav superior y añade los eventos
 */
async function cargarBotonesCategorias() {
  const container = document.getElementById("categories-container");
  if (!container) return;

  try {
    const response = await fetch("obtener_categorias.php");
    const categorias = await response.json();

    // El botón "Todos" ya existe en el HTML, le asignamos el evento
    const btnAll = container.querySelector('[data-id="all"]');
    if (btnAll) {
      btnAll.onclick = () => manejarSeleccionCategoria("all", btnAll);
    }

    // Generamos el resto de botones desde la DB
    categorias.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "cat-btn";
      btn.textContent = cat.nombre;
      btn.dataset.id = cat.nombre; // O cat.id, según prefieras comparar

      btn.onclick = () => manejarSeleccionCategoria(cat.nombre, btn);
      container.appendChild(btn);
    });
  } catch (error) {
    console.error("Error cargando botones de categorías:", error);
  }
}

/**
 * Maneja el cambio visual de los botones y dispara el filtro
 */
function manejarSeleccionCategoria(id, elemento) {
  // UI: Quitar clase active de todos y ponerla al actual
  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
  elemento.classList.add("active");

  // Estado: Actualizamos la categoría y filtramos
  categoriaSeleccionada = id;
  filtrarUsuarios(); // Llamamos a tu función de filtrado existente
}

// ==========================================
// ACTUALIZACIÓN DE TU FUNCIÓN filtrarUsuarios
// ==========================================
function filtrarUsuarios() {
  const searchTermInput = document.getElementById("search");
  const modalidadSelect = document.getElementById("filter-modalidad");

  if (!searchTermInput || !modalidadSelect) return;

  const searchTerm = searchTermInput.value.toLowerCase();
  const modalidadFilter = modalidadSelect.value;

  const usuariosFiltrados = todosLosUsuarios.filter((usuario) => {
    // 1. Filtro de Texto
    const matchSearch =
      searchTerm === "" ||
      usuario.nombre.toLowerCase().includes(searchTerm) ||
      usuario.ciudad.toLowerCase().includes(searchTerm) ||
      (usuario.descripcion && usuario.descripcion.toLowerCase().includes(searchTerm));

    // 2. Filtro de Modalidad
    const matchModalidad =
      modalidadFilter === "" || usuario.modalidad === modalidadFilter;

    // 3. NUEVO: Filtro de Categoría
    // Comprueba si la categoría seleccionada está incluida en el array usuario.categorias
    const matchCategoria =
      categoriaSeleccionada === "all" ||
      (usuario.categorias && usuario.categorias.includes(categoriaSeleccionada));

    return matchSearch && matchModalidad && matchCategoria;
  });

  generarCards(usuariosFiltrados);
}