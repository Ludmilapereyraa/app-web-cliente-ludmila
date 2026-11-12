const nav = document.querySelector('header nav, .barra-navegacion nav');
const links = nav ? nav.querySelectorAll('a') : [];
const formularioNewsletter = document.querySelector('.newsletter-form');

const CLAVE_CARRITO = 'carrito';

const leerCarrito = () => {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);

        if (!guardado) {
            return [];
        }

        const datos = JSON.parse(guardado);

        if (Array.isArray(datos)) {
            return datos;
        }

        if (datos && typeof datos === 'object') {
            return Object.entries(datos)
                .filter(([, item]) => item && typeof item === 'object')
                .map(([clave, item]) => ({
                    ...item,
                    id: item.id !== undefined ? item.id : clave
                }));
        }

        return [];
    } catch (error) {
        return [];
    }
};

const guardarCarrito = (carrito) => {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        return;
    }
};

const eliminarCarritoGuardado = () => {
    try {
        localStorage.removeItem(CLAVE_CARRITO);
    } catch (error) {
        return;
    }
};

const formatearPrecio = (valor) => '$ ' + valor.toLocaleString('es-AR', { maximumFractionDigits: 0 });

if (nav) {
    const botonMenu = document.createElement('button');
    botonMenu.type = 'button';
    botonMenu.classList.add('boton-menu');
    botonMenu.textContent = '☰';
    botonMenu.setAttribute('aria-label', 'Abrir menú');
    botonMenu.setAttribute('aria-expanded', 'false');

    if (!nav.id) {
        nav.id = 'menu-principal';
    }

    botonMenu.setAttribute('aria-controls', nav.id);
    nav.classList.add('menu-colapsable');
    nav.insertAdjacentElement('beforebegin', botonMenu);

    const cerrarMenu = () => {
        nav.classList.remove('menu-abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
        botonMenu.setAttribute('aria-label', 'Abrir menú');
    };

    botonMenu.addEventListener('click', () => {
        const abierto = nav.classList.toggle('menu-abierto');
        botonMenu.setAttribute('aria-expanded', String(abierto));
        botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    links.forEach((link) => {
        link.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('click', (evento) => {
        if (!nav.classList.contains('menu-abierto')) {
            return;
        }

        if (nav.contains(evento.target) || botonMenu.contains(evento.target)) {
            return;
        }

        cerrarMenu();
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && nav.classList.contains('menu-abierto')) {
            cerrarMenu();
            botonMenu.focus();
        }
    });
}

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

const seccionesProductos = [
    document.querySelector('#destacados'),
    document.querySelector('#productos')
].filter(Boolean);

if (seccionesProductos.length > 0 && typeof productos !== 'undefined') {
    const linkCarrito = document.querySelector('a[href="carrito.html"]');
    const carrito = leerCarrito();
    let cantidadCarrito = carrito.reduce((total, item) => {
        const cantidad = Number(item.cantidad);
        return total + (Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 1);
    }, 0);
    let contadorCarrito = null;

    const mensajeCarrito = document.createElement('p');
    mensajeCarrito.classList.add('mensaje-carrito');
    mensajeCarrito.setAttribute('aria-live', 'polite');
    seccionesProductos[0].insertAdjacentElement('beforebegin', mensajeCarrito);

    if (linkCarrito) {
        contadorCarrito = document.createElement('span');
        contadorCarrito.classList.add('contador-carrito');
        contadorCarrito.textContent = cantidadCarrito;
        linkCarrito.appendChild(contadorCarrito);
    }

    const agregarAlCarrito = (evento) => {
        const boton = evento.target.closest('button');

        if (!boton) {
            return;
        }

        const tarjeta = boton.closest('.card, .producto');

        if (!tarjeta) {
            return;
        }

        const id = Number(tarjeta.dataset.id);
        const producto = productos.find((item) => item.id === id);

        if (!producto) {
            return;
        }

        const itemCarrito = carrito.find((item) => Number(item.id) === producto.id);

        if (itemCarrito) {
            const cantidadActual = Number(itemCarrito.cantidad);
            itemCarrito.cantidad = (Number.isFinite(cantidadActual) ? cantidadActual : 0) + 1;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }

        guardarCarrito(carrito);
        mensajeCarrito.textContent = `Agregaste ${producto.nombre} al carrito`;
        cantidadCarrito += 1;

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidadCarrito;
        }
    };

    seccionesProductos.forEach((seccion) => {
        seccion.addEventListener('click', agregarAlCarrito);
    });
}

const contenedorCarrito = document.querySelector('#vista-productos');

if (contenedorCarrito) {
    const renderizarCarrito = (mensajeConfirmacion) => {
        const items = leerCarrito()
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
                const precioUnitario = Number(item.precio ?? item.price);
                const cantidad = Number(item.cantidad ?? item.quantity ?? item.qty);

                return {
                    id: item.id,
                    nombre: item.nombre || item.name || 'Producto sin nombre',
                    precio: Number.isFinite(precioUnitario) && precioUnitario >= 0 ? precioUnitario : 0,
                    cantidad: Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 1
                };
            });

        contenedorCarrito.textContent = '';

        if (mensajeConfirmacion) {
            const mensaje = document.createElement('p');
            mensaje.classList.add('exito');
            mensaje.setAttribute('role', 'status');
            mensaje.textContent = mensajeConfirmacion;
            contenedorCarrito.append(mensaje);
        }

        if (items.length === 0) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.classList.add('vista-vacia');
            mensajeVacio.textContent = 'No hay productos seleccionados en el carrito.';
            contenedorCarrito.append(mensajeVacio);
            return;
        }

        const tabla = document.createElement('table');

        const caption = document.createElement('caption');
        caption.textContent = 'Detalle de los instrumentos seleccionados';

        const thead = document.createElement('thead');
        const filaEncabezado = document.createElement('tr');

        ['Producto', 'Precio unitario', 'Cantidad', 'Subtotal', 'Acción'].forEach((texto) => {
            const encabezado = document.createElement('th');
            encabezado.scope = 'col';
            encabezado.textContent = texto;
            filaEncabezado.append(encabezado);
        });

        thead.append(filaEncabezado);

        const tbody = document.createElement('tbody');
        let total = 0;

        items.forEach((item) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const fila = document.createElement('tr');

            const nombre = document.createElement('th');
            nombre.scope = 'row';
            nombre.textContent = item.nombre;

            const precioUnitario = document.createElement('td');
            precioUnitario.textContent = formatearPrecio(item.precio);

            const cantidad = document.createElement('td');
            cantidad.textContent = item.cantidad;

            const subtotalElemento = document.createElement('td');
            subtotalElemento.textContent = formatearPrecio(subtotal);

            const acciones = document.createElement('td');
            const botonEliminar = document.createElement('button');
            botonEliminar.type = 'button';
            botonEliminar.classList.add('eliminar-producto');
            botonEliminar.dataset.id = item.id;
            botonEliminar.textContent = 'Eliminar';
            acciones.append(botonEliminar);

            fila.append(nombre, precioUnitario, cantidad, subtotalElemento, acciones);
            tbody.append(fila);
        });

        const tfoot = document.createElement('tfoot');
        const filaTotal = document.createElement('tr');

        const etiquetaTotal = document.createElement('th');
        etiquetaTotal.scope = 'row';
        etiquetaTotal.colSpan = 3;
        etiquetaTotal.textContent = 'Total';

        const valorTotal = document.createElement('td');
        valorTotal.colSpan = 2;
        valorTotal.textContent = formatearPrecio(total);

        filaTotal.append(etiquetaTotal, valorTotal);
        tfoot.append(filaTotal);

        tabla.append(caption, thead, tbody, tfoot);
        contenedorCarrito.append(tabla);

        const accionesCarrito = document.createElement('div');
        accionesCarrito.classList.add('acciones-carrito');

        const botonVaciar = document.createElement('button');
        botonVaciar.type = 'button';
        botonVaciar.classList.add('vaciar-carrito');
        botonVaciar.textContent = 'Vaciar carrito';

        const botonFinalizar = document.createElement('button');
        botonFinalizar.type = 'button';
        botonFinalizar.classList.add('finalizar-compra');
        botonFinalizar.textContent = 'Finalizar compra';

        accionesCarrito.append(botonVaciar, botonFinalizar);

        const volver = document.createElement('p');
        const enlaceVolver = document.createElement('a');
        enlaceVolver.href = 'index.html#productos';
        enlaceVolver.textContent = '← Seguir comprando';
        volver.append(enlaceVolver);

        contenedorCarrito.append(accionesCarrito, volver);
    };

    contenedorCarrito.addEventListener('click', (evento) => {
        const botonEliminar = evento.target.closest('.eliminar-producto');

        if (botonEliminar) {
            const id = botonEliminar.dataset.id;
            const carritoActualizado = leerCarrito().filter((item) => String(item.id) !== id);
            guardarCarrito(carritoActualizado);
            renderizarCarrito();
            return;
        }

        const botonVaciar = evento.target.closest('.vaciar-carrito');

        if (botonVaciar) {
            eliminarCarritoGuardado();
            renderizarCarrito();
            return;
        }

        const botonFinalizar = evento.target.closest('.finalizar-compra');

        if (botonFinalizar) {
            eliminarCarritoGuardado();
            renderizarCarrito('¡Compra realizada con éxito!');
        }
    });

    renderizarCarrito();
}
