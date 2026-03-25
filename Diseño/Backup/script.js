// --- FUNCIONALIDAD DE LA RULETA (Inicio) ---
let currentIdx = 0;
const images = document.querySelectorAll('.carousel-img');

function showNextImage() {
    if (images.length > 0) {
        images[currentIdx].classList.remove('active');
        currentIdx = (currentIdx + 1) % images.length;
        images[currentIdx].classList.add('active');
    }
}

// Cambiar cada 5 segundos
if (images.length > 0) {
    setInterval(showNextImage, 5000);
}

// --- FILTRO DINÁMICO (Cachorros) ---
document.getElementById('filtro-categoria')?.addEventListener('change', function() {
    const val = this.value;
    document.querySelectorAll('.card').forEach(c => {
        c.style.display = (val === 'todos' || c.dataset.categoria === val) ? 'block' : 'none';
    });
});

// --- AGREGAR ELEMENTO (Cachorros) ---
function agregarFavorito(nombre) {
    const li = document.createElement('li');
    li.innerHTML = `${nombre} <button onclick="this.remove()">[Quitar]</button>`;
    document.getElementById('lista-favoritos').appendChild(li);
}

// --- VALIDACIÓN DE FORMULARIO (Contacto) ---
function validarFormulario(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    let valido = true;

    if (nombre.trim() === "") { document.getElementById('error-nombre').style.display = 'block'; valido = false; }
    if (!correo.includes('@')) { document.getElementById('error-correo').style.display = 'block'; valido = false; }

    if (valido) { document.getElementById('msg-exito').style.display = 'block'; }
}

// --- SISTEMA DE IDIOMAS (ES, EN, JA) ---
const traducciones = {
    es: {
        inicio: "Inicio", nosotros: "Nosotros", cachorros: "Cachorros y Tienda", contacto: "Contacto",
        login: "Iniciar Sesión", carrito: "Carrito", buscar: "Buscar productos o ejemplares...",
        mision: "Nuestra Misión", vision: "Nuestra Visión", foda: "Análisis FODA"
    },
    en: {
        inicio: "Home", nosotros: "About Us", cachorros: "Puppies & Shop", contacto: "Contact",
        login: "Login", carrito: "Cart", buscar: "Search products or dogs...",
        mision: "Our Mission", vision: "Our Vision", foda: "SWOT Analysis"
    },
    ja: {
        inicio: "ホーム", nosotros: "私たちについて", cachorros: "子犬とショップ", contacto: "連絡先",
        login: "ログイン", carrito: "カート", buscar: "製品や犬を検索...",
        mision: "私たちの使命", vision: "私たちのビジョン", foda: "SWOT分析"
    }
};

function inicializarIdioma() {
    // Detectar idioma guardado o el del navegador
    let idioma = localStorage.getItem('idiomaPreferido');
    if (!idioma) {
        const navLang = navigator.language.slice(0, 2);
        idioma = ['es', 'en', 'ja'].includes(navLang) ? navLang : 'es';
    }
    cambiarIdioma(idioma);
    if(document.getElementById('selector-idioma')) {
        document.getElementById('selector-idioma').value = idioma;
    }
}

function cambiarIdioma(lang) {
    localStorage.setItem('idiomaPreferido', lang);
    document.querySelectorAll('[data-i18n]').forEach(elemento => {
        const clave = elemento.getAttribute('data-i18n');
        if (traducciones[lang][clave]) {
            if (elemento.tagName === 'INPUT') elemento.placeholder = traducciones[lang][clave];
            else elemento.innerText = traducciones[lang][clave];
        }
    });
}

// --- ACCESIBILIDAD: MODO ALTO CONTRASTE ---
function toggleAltoContraste() {
    document.body.classList.toggle('alto-contraste');
    const activo = document.body.classList.contains('alto-contraste');
    localStorage.setItem('altoContraste', activo);
}

// --- BREADCRUMBS DINÁMICOS ---
function generarBreadcrumbs() {
    const path = window.location.pathname.split('/').pop().split('.')[0] || 'inicio';
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (breadcrumbContainer) {
        breadcrumbContainer.innerHTML = `Inicio > <span style="text-transform: capitalize;">${path}</span>`;
    }
}

// Inicializaciones globales al cargar la página
window.onload = () => {
    inicializarIdioma();
    generarBreadcrumbs();
    if (localStorage.getItem('altoContraste') === 'true') document.body.classList.add('alto-contraste');
};