// --- MODELO: Gestión de Base de Datos (LocalStorage) ---
const Modelo = {
    // 1. Usuarios e Inicio de Sesión
    guardarSesionActiva: function(usuario, rol) {
        const sesion = { usuario, rol, fecha: new Date().toISOString() };
        localStorage.setItem('bd_sesion_activa', JSON.stringify(sesion));
    },
    obtenerSesionActiva: function() {
        return JSON.parse(localStorage.getItem('bd_sesion_activa')) || null;
    },
    cerrarSesion: function() {
        localStorage.removeItem('bd_sesion_activa');
    },

    // 2. Carrito de Compras
    guardarCarrito: function(carrito) {
        localStorage.setItem('bd_carrito', JSON.stringify(carrito));
    },
    obtenerCarrito: function() {
        return JSON.parse(localStorage.getItem('bd_carrito')) || [];
    },
    vaciarCarrito: function() {
        localStorage.removeItem('bd_carrito');
    },

    // 3. Formulario de Contacto
    guardarMensajeContacto: function(nombre, correo, mensaje) {
        let mensajes = JSON.parse(localStorage.getItem('bd_mensajes_contacto')) || [];
        mensajes.push({ nombre, correo, mensaje, fecha: new Date().toISOString() });
        localStorage.setItem('bd_mensajes_contacto', JSON.stringify(mensajes));
    }
};