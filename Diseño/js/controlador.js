// --- CONTROLADOR: Lógica de Negocio e Interfaz ---

// Diccionario de Traducciones (ES / EN)
const traducciones = {
    es: {
        inicio: "Inicio", nosotros: "Nosotros", cachorros: "Cachorros y Tienda", contacto: "Contacto", login: "Ingresar",
        titulo_hero: "Excelencia y Majestuosidad Canina", buscar: "Buscar productos o ejemplares...",
        agregar_carrito: "Agregar al carrito", finalizar_compra: "Finalizar Compra", carrito_vacio: "El carrito está vacío"
    },
    en: {
        inicio: "Home", nosotros: "About Us", cachorros: "Puppies & Shop", contacto: "Contact", login: "Login",
        titulo_hero: "Canine Excellence and Majesty", buscar: "Search products or dogs...",
        agregar_carrito: "Add to cart", finalizar_compra: "Checkout", carrito_vacio: "Cart is empty"
    }
};

const Controlador = {
    init: function() {
        this.inicializarIdioma();
        this.renderizarBreadcrumbs();
        this.renderizarCarrito();
        this.verificarSesion();
        
        // Listener para búsqueda dinámica
        const buscador = document.getElementById('buscador-sitio');
        if (buscador) {
            buscador.addEventListener('keyup', (e) => this.buscarContenido(e.target.value));
        }
    },

    // --- IDIOMA ---
    inicializarIdioma: function() {
        const idiomaGuardado = localStorage.getItem('idioma_pref') || 'es';
        this.cambiarIdioma(idiomaGuardado);
        const selector = document.getElementById('selector-idioma');
        if (selector) selector.value = idiomaGuardado;
    },
    cambiarIdioma: function(lang) {
        localStorage.setItem('idioma_pref', lang);
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (traducciones[lang][key]) {
                if (el.tagName === 'INPUT') el.placeholder = traducciones[lang][key];
                else el.innerText = traducciones[lang][key];
            }
        });
    },

    // --- ACCESIBILIDAD ---
    toggleAltoContraste: function() {
        document.body.classList.toggle('alto-contraste');
    },

    // --- BREADCRUMBS ---
    renderizarBreadcrumbs: function() {
        const contenedor = document.getElementById('breadcrumbs');
        if (!contenedor) return;
        let pagina = window.location.pathname.split('/').pop().replace('.html', '') || 'inicio';
        contenedor.innerHTML = `<a href="index.html">Inicio</a> > <span style="text-transform: capitalize;">${pagina}</span>`;
    },

    // --- CARRITO DE COMPRAS ---
    agregarAlCarrito: function(nombre, precio) {
        let carrito = Modelo.obtenerCarrito();
        carrito.push({ nombre, precio });
        Modelo.guardarCarrito(carrito);
        this.renderizarCarrito();
        alert(`Agregado: ${nombre}`);
    },
    eliminarDelCarrito: function(index) {
        let carrito = Modelo.obtenerCarrito();
        carrito.splice(index, 1);
        Modelo.guardarCarrito(carrito);
        this.renderizarCarrito();
    },
    renderizarCarrito: function() {
        const lista = document.getElementById('lista-carrito');
        const totalSpan = document.getElementById('total-carrito');
        if (!lista || !totalSpan) return;

        let carrito = Modelo.obtenerCarrito();
        lista.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            lista.innerHTML = `<li data-i18n="carrito_vacio">El carrito está vacío</li>`;
            this.cambiarIdioma(localStorage.getItem('idioma_pref') || 'es');
        } else {
            carrito.forEach((item, index) => {
                total += item.precio;
                lista.innerHTML += `
                    <li class="cart-item">
                        <span>${item.nombre} - $${item.precio}</span>
                        <button class="btn-eliminar" onclick="Controlador.eliminarDelCarrito(${index})">X</button>
                    </li>`;
            });
        }
        totalSpan.innerText = total.toFixed(2);
    },
    finalizarCompra: function() {
        let carrito = Modelo.obtenerCarrito();
        if (carrito.length === 0) return alert("Agrega productos antes de finalizar.");
        
        // Simulación de compra
        Modelo.vaciarCarrito();
        this.renderizarCarrito();
        alert("¡Compra finalizada con éxito! Gracias por su preferencia.");
    },

    // --- BÚSQUEDA ---
    buscarContenido: function(query) {
        query = query.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const texto = card.innerText.toLowerCase();
            const tags = card.getAttribute('data-tags') || "";
            if (texto.includes(query) || tags.toLowerCase().includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // --- AUTENTICACIÓN ---
    procesarLogin: function(e) {
        e.preventDefault();
        
        // Verificación de reCAPTCHA
        if(typeof grecaptcha !== 'undefined') {
            const response = grecaptcha.getResponse();
            if(response.length === 0) {
                document.getElementById('err-captcha').style.display = 'block';
                return;
            }
        }

        const usuario = document.getElementById('usuario-login').value;
        const rol = usuario.toLowerCase().includes('admin') ? 'Administrador' : 'Cliente';
        
        Modelo.guardarSesionActiva(usuario, rol);
        alert(`Bienvenido ${usuario} (${rol})`);
        window.location.href = "index.html";
    },
    verificarSesion: function() {
        const sesion = Modelo.obtenerSesionActiva();
        const navAuth = document.getElementById('nav-auth');
        if (sesion && navAuth) {
            navAuth.innerHTML = `<span style="color:var(--accent); font-weight:bold;">Hola, ${sesion.usuario}</span> | <a href="#" onclick="Controlador.cerrarSesion()">Salir</a>`;
        }
    },
    cerrarSesion: function() {
        Modelo.cerrarSesion();
        window.location.reload();
    },
    simularRecuperacion: function(e) {
        e.preventDefault();
        const correo = document.getElementById('correo-recuperacion').value;
        const btn = document.getElementById('btn-recuperar');
        btn.innerText = "Enviando...";
        
        setTimeout(() => {
            document.getElementById('msg-recuperacion').innerHTML = `<strong>Éxito:</strong> Se ha enviado un enlace seguro a <em>${correo}</em>.`;
            document.getElementById('msg-recuperacion').style.display = 'block';
            btn.innerText = "Enviar Enlace";
        }, 1500);
    },
    
    procesarContacto: function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre-contacto').value;
        const correo = document.getElementById('correo-contacto').value;
        const mensaje = document.getElementById('mensaje-contacto').value;

        // Guardar en la base de datos (Modelo)
        Modelo.guardarMensajeContacto(nombre, correo, mensaje);
        
        document.getElementById('msg-contacto-exito').style.display = 'block';
        e.target.reset();
        setTimeout(() => {
            document.getElementById('msg-contacto-exito').style.display = 'none';
        }, 3000);
    }
};

// Iniciar controlador al cargar la página
document.addEventListener('DOMContentLoaded', () => Controlador.init());