const nav = document.querySelector('nav');
const links = nav.querySelectorAll('a');
const formularioNewsletter = document.querySelector('.newsletter-form');

links.forEach((link) => {
    link.addEventListener('click', () => {
        links.forEach((otroLink) => otroLink.classList.remove('activa'));
        link.classList.add('activa');
    });
});

const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

links.forEach((link) => {
    const destino = link.getAttribute('href');

    if (destino === paginaActual) {
        link.classList.add('activa');
    }
});

if (formularioNewsletter) {
    const inputEmail = formularioNewsletter.querySelector('input[type="email"]');

    if (inputEmail) {
        let mensajeError = null;
        let mensajeExito = null;

        formularioNewsletter.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const email = inputEmail.value.trim();
            const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!email || !formatoValido) {
                if (!mensajeError) {
                    mensajeError = document.createElement('span');
                    mensajeError.classList.add('error');
                    inputEmail.insertAdjacentElement('afterend', mensajeError);
                }

                mensajeError.textContent = 'Ingresá un correo electrónico válido.';
                return;
            }

            if (mensajeError) {
                mensajeError.remove();
                mensajeError = null;
            }

            if (!mensajeExito) {
                mensajeExito = document.createElement('p');
                mensajeExito.classList.add('exito');
                formularioNewsletter.appendChild(mensajeExito);
            }

            mensajeExito.textContent = '¡Gracias por suscribirte al newsletter!';
            inputEmail.value = '';
        });
    }
}
