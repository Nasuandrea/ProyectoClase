function crearBarras(containerId, inputId, valorInicial = 0) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);

    container.innerHTML = "";
    input.value = valorInicial;

    for (let i = 1; i <= 5; i++) {
        const bar = document.createElement("span");
        if (i <= valorInicial) bar.classList.add("active");

        bar.addEventListener("click", () => {
            input.value = i;
            actualizarBarras(container, i);
        });

        container.appendChild(bar);
    }
}

function actualizarBarras(container, valor) {
    const bars = container.querySelectorAll("span");
    bars.forEach((bar, index) => {
        if (index < valor) bar.classList.add("active");
        else bar.classList.remove("active");
    });
}

// Avatar preview
function inicializarAvatarUpload() {
    const avatarPreview = document.getElementById("avatarPreview");
    const avatarInput = document.getElementById("avatarInput");

    avatarPreview.addEventListener("click", () => avatarInput.click());

    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            avatarPreview.innerHTML = `<img src="${reader.result}" alt="Avatar">`;
        };
        reader.readAsDataURL(file);
    });
}

// Cargar skills y categorías disponibles
async function cargarSkillsYCategorias() {
    const skillsDiv = document.getElementById("skills-list");
    const catsDiv = document.getElementById("categories-list");

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

// Cargar usuario por id
async function cargarUsuario(id) {
    const res = await fetch(`obtener_usuario.php?id=${id}`);
    const data = await res.json();

    if (!data.success) return;

    const u = data.data;

    document.getElementById("userId").value = u.id;
    document.getElementById("nombre").value = u.nombre;
    document.getElementById("email").value = u.email;
    document.getElementById("ciudad").value = u.ciudad;
    document.getElementById("provincia").value = u.provincia;
    document.getElementById("modalidad").value = u.modalidad;
    document.getElementById("enlaces").value = u.enlaces;
    document.getElementById("descripcion").value = u.descripcion;
    document.getElementById("especializacion").value = u.especializacion || "";

    // Cargar skills y categorías disponibles primero
    await cargarSkillsYCategorias();

    // Marcar como seleccionados los que el usuario tiene
    if (Array.isArray(u.skills)) {
        u.skills.forEach(skill => {
            const checkbox = document.querySelector(`input[name="skills[]"][value="${skill}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    if (Array.isArray(u.categorias)) {
        u.categorias.forEach(cat => {
            const checkbox = document.querySelector(`input[name="categorias[]"][value="${cat}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    crearBarras("backend-bars", "backend", parseInt(u.backend));
    crearBarras("frontend-bars", "frontend", parseInt(u.frontend));

    if (u.avatar2D) {
        document.getElementById("avatarPreview").innerHTML =
            `<img src="${u.avatar2D}" alt="Avatar">`;
    }
}


// Enviar edición
document.getElementById("editarForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Recoger skills y categorías seleccionadas
    const selectedSkills = [
        ...document.querySelectorAll("input[name='skills[]']:checked"),
    ].map((el) => el.value);
    const selectedCats = [
        ...document.querySelectorAll("input[name='categorias[]']:checked"),
    ].map((el) => el.value);

    formData.append("skills", selectedSkills.join(","));
    formData.append("categorias", selectedCats.join(","));

    try {
        const res = await fetch("actualizar_usuario.php", {
            method: "POST",
            body: formData
        });

        const msg = document.getElementById("editarMensaje");

        // Leer el texto completo de la respuesta
        const responseText = await res.text();
        console.log("Respuesta del servidor:", responseText);
        console.log("Status:", res.status);

        if (!res.ok) {
            msg.innerHTML = "❌ Error del servidor (Status: " + res.status + ")";
            console.error("Respuesta completa:", responseText);
            return;
        }

        try {
            const data = JSON.parse(responseText);
            if (data.success) {
                msg.innerHTML = "✅ Usuario actualizado correctamente";
            } else {
                msg.innerHTML = "❌ Error: " + data.error;
            }
        } catch (parseError) {
            msg.innerHTML = "❌ Error al procesar respuesta: " + responseText.substring(0, 100);
        }

    } catch (error) {
        console.error("Error en fetch:", error);
        document.getElementById("editarMensaje").innerHTML = "❌ Error de conexión: " + error.message;
    }
});

// Init
document.addEventListener("DOMContentLoaded", () => {
    inicializarAvatarUpload();

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) cargarUsuario(userId);
});