 // Mostrar/Ocultar contraseña
        function togglePassword(id, el) {
            const input = document.getElementById(id);
            if (input.type === "password") {
                input.type = "text";
                el.innerHTML = '<i class="fa fa-eye-slash"></i>';
            } else {
                input.type = "password";
                el.innerHTML = '<i class="fa fa-eye"></i>';
            }
        }

        // Animación de cambio de formulario
        function mostrarLogin() {
            const login = document.getElementById('form-login');
            const registro = document.getElementById('form-registro');
            login.style.display = 'block';
            registro.style.display = 'none';
            document.getElementById('titulo-form').textContent = 'Login';
            login.classList.remove('form-anim');
            setTimeout(() => login.classList.add('form-anim'), 10);
        }
        function mostrarRegistro() {
            const login = document.getElementById('form-login');
            const registro = document.getElementById('form-registro');
            login.style.display = 'none';
            registro.style.display = 'block';
            document.getElementById('titulo-form').textContent = 'Registro';
            registro.classList.remove('form-anim');
            setTimeout(() => registro.classList.add('form-anim'), 10);
        }

        // Vibración si el formulario está vacío
        function shakeForm(form) {
            form.classList.remove('shake');
            setTimeout(() => form.classList.add('shake'), 10);
        }

        // Botón de carga animado y validación
        function recargarYRedirigir(event) {
        event.preventDefault();
        const correo = document.getElementById('correo-login').value.trim();
        const pass = document.getElementById('contrasena').value.trim();
        const btn = document.getElementById('btn-login');

        const correoGuardado = localStorage.getItem('correo');
        const passGuardada = localStorage.getItem('nueva-contrasena');
        const usuario = localStorage.getItem('usuario');

        if (!correo || !pass) {
            shakeForm(event.target);
            return;
        }

        if (correo === correoGuardado && pass === passGuardada) {
            // GUARDAR SESIÓN ACTIVA COMO OBJETO
            const usuarioActivo = {
                nombre: usuario,
                correo: correo
            };
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

            btn.classList.add('btn-loading');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1200);
        } else {
            shakeForm(event.target);
            alert('Correo o contraseña incorrectos.');
        }
    }
        function registrarUsuario(event) {
            event.preventDefault();
            const usuario = document.getElementById('nuevo-usuario').value.trim();
            const correo = document.getElementById('email').value.trim();
            const pass = document.getElementById('nueva-contrasena').value.trim();
            const btn = document.getElementById('btn-registro');
            if (!usuario || !correo || !pass) {
                shakeForm(event.target);
                return;
            }
            btn.classList.add('btn-loading');
            setTimeout(() => {
                localStorage.setItem('usuario', usuario);
                localStorage.setItem('correo', correo);
                localStorage.setItem('nueva-contrasena', pass); // Guardar contraseña de registro
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                btn.classList.remove('btn-loading');
                mostrarLogin();
            }, 1200);
        }
        window.onload = function() {
            mostrarLogin();
        }