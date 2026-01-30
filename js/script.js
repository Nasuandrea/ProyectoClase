import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// State & Global Variables
// ==========================================
let allUsers = []; // Almacenará todos los usuarios cargados
let allCategories = []; // Almacenará todas las categorías
let isFeaturedMode = false;
let currentViewer = null; // Guardará la instancia actual del visor 3D
let currentCategory = null; // Guardará la categoría seleccionada

// ==========================================
// UI Elements
// ==========================================
const backBtn = document.getElementById('back-btn');
const registerBtn = document.getElementById('register-btn');
const registerModal = document.getElementById('register-modal');
const closeBtn = document.getElementById('modal-close-btn');
const initialGallery = document.getElementById('initial-gallery');
const featuredLayout = document.getElementById('featured-layout');
const featuredSpot = document.getElementById('featured-spot');
const infoName = document.getElementById('info-name');
const infoRole = document.getElementById('info-role');
const infoDesc = document.getElementById('info-desc');
const loadingDiv = document.getElementById('loading');
const cardsContainer = document.getElementById('cards-container');
const errorDiv = document.getElementById('error');
const searchInput = document.getElementById('search');
// const modalityFilter = document.getElementById('filter-modalidad');

// ==========================================
// Modal Logic
// ==========================================
function openModal() {
    registerModal.classList.remove('hidden');
}

function closeModal() {
    registerModal.classList.add('hidden');
}

// ==========================================
// Cache Busting Helper
// ==========================================
function addCacheBuster(url) {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${new Date().getTime()}`;
}

// ==========================================
// Data Loading Functions
// ==========================================
async function loadUsers() {
    loadingDiv.style.display = 'block';
    try {
        const response = await fetch('php/obtener_usuarios.php?_t=' + new Date().getTime());
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Error desconocido');
        
        allUsers = result.data;

        console.log(allUsers); // DEBUG: Imprimir los datos de usuario en la consola

        if (allUsers.length === 0) {
             document.getElementById('no-results').style.display = 'block';
        } else {
            applyFilters();
        }

    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Error al cargar los usuarios: ' + error.message;
        console.error('Error:', error);
    } finally {
        loadingDiv.style.display = 'none';
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('php/obtener_categorias.php');
        const data = await response.json();
        allCategories = data.map(cat => cat.nombre);
        generateCategoryButtons(allCategories);
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// ==========================================
// UI Generation and Filtering
// ==========================================
function generateCards(usersToDisplay) {
    cardsContainer.innerHTML = '';
    usersToDisplay.forEach(user => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.cursor = 'pointer';

        // Agregar cache buster a la URL del avatar
        let avatarUrl = addCacheBuster(user.avatar2D);

        card.innerHTML = `
            <h3>${user.nombre}</h3>
            <img src="${avatarUrl}" alt="Avatar de ${user.nombre}" onerror="console.log('Error loading image:', this.src); this.src='uploads/avatars/default_avatar_mujer.png?_t=' + new Date().getTime();">
            <div class="card-footer-new"></div>
        `;
        card.addEventListener('click', () => activateFeatured(user));
        cardsContainer.appendChild(card);
    });
     document.getElementById('no-results').style.display = usersToDisplay.length === 0 ? 'block' : 'none';
}

function generateCategoryButtons(categories) {
    const container = document.getElementById('contenedorBotonCategorias');
    container.innerHTML = '';
    
    const allButton = document.createElement('button');
    allButton.classList.add('boton-categoria');
    allButton.innerHTML = `<span class="nombre-categoria">Todas</span>`;
    allButton.onclick = () => filterByCategory(null);
    container.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('boton-categoria');
        button.innerHTML = `<span class="nombre-categoria">${category}</span>`;
        button.onclick = () => filterByCategory(category);
        container.appendChild(button);
    });
}

function filterByCategory(selectedCategory) {
    currentCategory = selectedCategory;
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();

    let filteredUsers = allUsers;

    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
            user.nombre.toLowerCase().includes(searchTerm) ||
            user.ciudad.toLowerCase().includes(searchTerm)
        );
    }

    if (currentCategory) {
        filteredUsers = filteredUsers.filter(user => user.categorias && user.categorias.includes(currentCategory));
    }

    generateCards(filteredUsers);
}

// ==========================================
// Registration Form Logic
// ==========================================
function inicializarAvatarUpload() {
    const avatarPreview = document.getElementById("avatarPreview");
    const avatarInput = document.getElementById("avatarInput");
    
    if (!avatarPreview || !avatarInput) return;

    avatarPreview.addEventListener("click", () => avatarInput.click());

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

async function cargarSkillsYCategorias() {
    const skillsDiv = document.getElementById("skills-list");
    const catsDiv = document.getElementById("categories-list");
    if (!skillsDiv || !catsDiv) return;

    try {
        const [skillsRes, catsRes] = await Promise.all([
            fetch("php/obtener_skills.php"),
            fetch("php/obtener_categorias.php")
        ]);
        const skills = await skillsRes.json();
        const cats = await catsRes.json();

        skillsDiv.innerHTML = skills.map(s => `
            <label>
                <input type="checkbox" name="skills[]" value="${s.nombre}">
                <span>${s.nombre}</span>
            </label>`).join('');

        catsDiv.innerHTML = cats.map(c => `
            <label>
                <input type="checkbox" name="categorias[]" value="${c.nombre}">
                <span>${c.nombre}</span>
            </label>`).join('');

    } catch (error) {
        console.error("Error cargando skills o categorías:", error);
    }
}

function inicializarFormulario() {
    const form = document.getElementById("registroForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const mensaje = document.getElementById("registroMensaje");

        try {
            const response = await fetch("php/registrar_usuario.php", {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                mensaje.innerHTML = "✅ Usuario registrado correctamente. La galería se refrescará.";
                mensaje.style.color = 'green';
                form.reset();
                document.getElementById('avatarPreview').innerHTML = '<span id="avatarPlus">+</span>';
                setTimeout(() => {
                    closeModal();
                    loadUsers(); // Recargar usuarios para mostrar el nuevo
                }, 2000);
            } else {
                mensaje.innerHTML = "❌ Error: " + data.error;
                 mensaje.style.color = 'red';
            }
        } catch (error) {
            console.error(error);
            mensaje.innerHTML = "❌ Error al enviar formulario.";
            mensaje.style.color = 'red';
        }
    });
}


// ==========================================
// View Switching and 3D Rendering
// ==========================================
function activateFeatured(user) {
    isFeaturedMode = true;
    initialGallery.classList.add('hidden');
    featuredLayout.classList.remove('hidden');
    // backBtn.classList.remove('hidden');

    if (currentViewer) {
        currentViewer.destroy();
    }
    featuredSpot.innerHTML = '';

    if (user.avatar3D) {
        currentViewer = new AvatarViewer('featured-spot', user.avatar3D);
    }
    
    infoName.textContent = user.nombre;
    infoRole.textContent = user.modalidad;
    infoDesc.textContent = user.descripcion;
}

function restoreGallery() {
    isFeaturedMode = false;
    initialGallery.classList.remove('hidden');
    featuredLayout.classList.add('hidden');
    // backBtn.classList.add('hidden');

    if (currentViewer) {
        currentViewer.destroy();
        currentViewer = null;
    }
    featuredSpot.innerHTML = '';
}

// ==========================================
// Three.js AvatarViewer Class
// ==========================================
const config = {
    backgroundColor: 0xf0f0f0,
    ambientIntensity: 0.5,
    cameraPosition: new THREE.Vector3(0, 1.4, 2.5),
};

class AvatarViewer {
    constructor(containerId, modelPath) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id ${containerId} not found.`);
            return;
        }
        this.modelPath = modelPath;
        this.animationFrameId = null;
        
        this.animate = this.animate.bind(this);
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        const aspect = this.container.clientWidth / this.container.clientHeight || 1;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.copy(config.cameraPosition);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.setupLights();
        this.loadModel();
        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, config.ambientIntensity);
        this.scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(2, 5, 5);
        this.scene.add(mainLight);
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
            const box = new THREE.Box3().setFromObject(this.model);
            const size = box.getSize(new THREE.Vector3());
            this.controls.target.set(0, size.y * 0.6, 0);
            this.controls.update();
        }, undefined, (error) => {
            console.error(`Error loading model ${this.modelPath}:`, error);
            featuredSpot.innerHTML = `<p style="color: red; text-align: center;">Error al cargar el modelo 3D. Asegúrate de que el archivo '${this.modelPath}' existe.</p>`;
        });
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        cancelAnimationFrame(this.animationFrameId);
        if (this.renderer) {
            this.renderer.dispose();
             if (this.renderer.domElement.parentElement) {
                this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
            }
        }
    }
}

// ==========================================
// Initial Setup
// ==========================================
backBtn.addEventListener('click', restoreGallery);
searchInput.addEventListener('input', applyFilters);
// modalityFilter.addEventListener('change', applyFilters);
registerBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Iniciar la carga de datos
loadUsers();
fetchCategories();

// Inicializar lógica del formulario de registro
cargarSkillsYCategorias();
inicializarAvatarUpload();
inicializarFormulario();
