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