const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");

openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
})

closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
})
  document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const loginItem = document.getElementById('login-item');
    const logoutItem = document.getElementById('logout-item');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    const nombreUsuario = document.getElementById('nombre-usuario');

    if (usuarioActivo) {
        loginItem.style.display = 'none';
        logoutItem.style.display = 'block';

        if (nombreUsuario) {
            nombreUsuario.style.display = 'block';
            nombreUsuario.textContent = `¡Hola, ${usuarioActivo.nombre}!`;
        }
    }

    cerrarSesionBtn.addEventListener('click', () => {
        localStorage.removeItem('usuarioActivo');
        window.location.href = './login/login.html';
    });
});
