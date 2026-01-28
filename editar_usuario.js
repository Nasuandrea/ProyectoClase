/**
 * GESTIÓN DE BARRAS DE NIVEL (Backend/Frontend)
 */
function crearBarras(containerId, inputId, valorInicial = 0) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    
    container.innerHTML = "";
    input.value = valorInicial;

    for (let i = 1; i <= 5; i++) {
        const bar = document.createElement("span");
        bar.setAttribute("data-nivel", i);
        if (i <= valorInicial) bar.classList.add("active");

        bar.addEventListener("click", (e) => {
            const nivel = e.target.getAttribute("data-nivel");
            input.value = nivel;
            actualizarBarras(container, nivel);
        });
        container.appendChild(bar);
    }
}

function actualizarBarras(container, valor) {
    container.querySelectorAll("span").forEach(bar => {
        bar.classList.toggle("active", bar.getAttribute("data-nivel") <= valor);
    });
}

/**
 * GESTIÓN DE AVATAR (Preview y Click)
 */
function inicializarAvatarUpload() {
    const preview = document.getElementById("avatarPreview");
    const input = document.getElementById("avatarInput");

    if (!preview || !input) return;

    preview.onclick = () => input.click();
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => preview.innerHTML = `<img src="${reader.result}" alt="Avatar">`;
        reader.readAsDataURL(file);
    };
}

/**
 * CARGA DE DATOS MAESTROS (Skills y Categorías)
 */
async function cargarSkillsYCategorias() {
    try {
        const [resS, resC] = await Promise.all([
            fetch("obtener_skills.php"),
            fetch("obtener_categorias.php")
        ]);
        const skills = await resS.json();
        const cats = await resC.json();

        const render = (items, targetId, name) => {
            const container = document.getElementById(targetId);
            if (!container) return;
            container.innerHTML = items.map(i => `
                <label>
                    <input type="checkbox" name="${name}" value="${i.nombre}">
                    <span>${i.nombre}</span>
                </label>
            `).join('');
        };

        render(skills, "skills-list", "skills[]");
        render(cats, "categories-list", "categorias[]");
    } catch (e) {
        console.error("Error al cargar datos maestros:", e);
    }
}

/**
 * AÑADIR NUEVA SKILL DINÁMICAMENTE
 */
function agregarSkill() {
    const input = document.getElementById("nueva-skill");
    const name = input.value.trim();
    if (!name) return;

    const list = document.getElementById("skills-list");
    
    // Verificar si ya existe en la lista visual para no duplicar
    const existe = Array.from(list.querySelectorAll('input')).some(i => i.value.toLowerCase() === name.toLowerCase());
    
    if (!existe) {
        const html = `
            <label>
                <input type="checkbox" name="skills[]" value="${name}" checked>
                <span>${name}</span>
            </label>
        `;
        list.insertAdjacentHTML('afterbegin', html);
    }
    
    input.value = "";
}

/**
 * CARGA DE DATOS DEL USUARIO
 */
async function cargarUsuario(id) {
    try {
        const res = await fetch(`obtener_usuario.php?id=${id}`);
        const data = await res.json();
        if (!data.success) return;

        const u = data.data;

        // Rellenar campos de texto simples
        const fields = ['nombre', 'email', 'ciudad', 'provincia', 'modalidad', 'enlaces', 'descripcion', 'especializacion'];
        fields.forEach(f => {
            const el = document.getElementById(f);
            if (el) el.value = u[f] || "";
        });

        document.getElementById("userId").value = u.id;

        // Cargar listas antes de marcar los seleccionados
        await cargarSkillsYCategorias();

        // Marcar Skills seleccionadas
        u.skills?.forEach(s => {
            const ck = document.querySelector(`input[name="skills[]"][value="${s}"]`);
            if (ck) ck.checked = true;
        });

        // Marcar Categorías seleccionadas
        u.categorias?.forEach(c => {
            const ck = document.querySelector(`input[name="categorias[]"][value="${c}"]`);
            if (ck) ck.checked = true;
        });

        // Inicializar barras de nivel
        crearBarras("backend-bars", "backend", u.backend);
        crearBarras("frontend-bars", "frontend", u.frontend);

        // Mostrar avatar si existe
        if (u.avatar2D) {
            document.getElementById("avatarPreview").innerHTML = `<img src="${u.avatar2D}" alt="Avatar">`;
        }
    } catch (e) {
        console.error("Error al cargar el usuario:", e);
    }
}

/**
 * ENVÍO DEL FORMULARIO
 */
document.getElementById("editarForm").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const msg = document.getElementById("editarMensaje");

    // Recoger manualmente los checkboxes para enviarlos como string separado por comas
    const skills = [...document.querySelectorAll("input[name='skills[]']:checked")].map(el => el.value);
    const cats = [...document.querySelectorAll("input[name='categorias[]']:checked")].map(el => el.value);
    
    formData.append("skills", skills.join(","));
    formData.append("categorias", cats.join(","));

    try {
        const res = await fetch("actualizar_usuario.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            msg.className = "mensaje-exito";
            msg.innerHTML = "✅ Usuario actualizado correctamente";
        } else {
            msg.className = "mensaje-error";
            msg.innerHTML = "❌ Error: " + data.error;
        }
    } catch (err) {
        msg.innerHTML = "❌ Error de conexión con el servidor";
    }
};

/**
 * INICIALIZACIÓN AL CARGAR LA PÁGINA
 */
document.addEventListener("DOMContentLoaded", () => {
    inicializarAvatarUpload();
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (id) {
        cargarUsuario(id);
    } else {
        alert("No se ha proporcionado un ID de usuario.");
    }
});