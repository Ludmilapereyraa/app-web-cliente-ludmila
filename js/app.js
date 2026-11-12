const nav = document.querySelector('nav');
const links = nav.querySelectorAll('a');
const botonNewsletter = document.querySelector('.newsletter-form button');

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

if (botonNewsletter) {
    botonNewsletter.addEventListener('click', (evento) => {
        evento.preventDefault();
        console.log('Gracias por suscribirte al newsletter');
    });
}
