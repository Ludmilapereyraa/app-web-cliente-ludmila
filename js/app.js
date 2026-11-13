const nav = document.querySelector('header nav, .barra-navegacion nav');
const links = nav ? nav.querySelectorAll('a') : [];
const formularioNewsletter = document.querySelector('.newsletter-form');

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

if (seccionesProductos.length > 0 && typeof obtenerProductos === 'function') {
    const mensajeCarrito = document.createElement('p');
    mensajeCarrito.classList.add('mensaje-carrito');
    mensajeCarrito.setAttribute('aria-live', 'polite');
    seccionesProductos[0].insertAdjacentElement('beforebegin', mensajeCarrito);

    const agregarAlCarrito = async (evento) => {
        const boton = evento.target.closest('button');

        if (!boton) {
            return;
        }

        const tarjeta = boton.closest('.card, .producto');

        if (!tarjeta) {
            return;
        }

        const id = Number(tarjeta.dataset.id);

        try {
            const productosCargados = await obtenerProductos();
            const producto = productosCargados.find((item) => item.id === id);

            if (!producto) {
                return;
            }

            agregarProductoAlCarrito(producto);
            mensajeCarrito.textContent = `Agregaste ${producto.nombre} al carrito`;
        } catch (error) {
            mensajeCarrito.textContent = 'No pudimos cargar los productos. Intentá de nuevo.';
        }
    };

    seccionesProductos.forEach((seccion) => {
        seccion.addEventListener('click', agregarAlCarrito);
    });
}

const contenedorDestacados = document.querySelector('#destacados');

if (contenedorDestacados && typeof obtenerProductos === 'function' && typeof crearCard === 'function') {
    const iniciarCarrusel = (productosCargados) => {
        const destacados = productosCargados.filter((producto) => producto.destacado);

        if (destacados.length === 0) {
            return;
        }

        const carrusel = document.createElement('div');
        carrusel.classList.add('carrusel');
        carrusel.setAttribute('role', 'region');
        carrusel.setAttribute('aria-label', 'Carrusel de guitarras destacadas');

        const botonAnterior = document.createElement('button');
        botonAnterior.type = 'button';
        botonAnterior.classList.add('carrusel-flecha', 'carrusel-flecha-anterior');
        botonAnterior.textContent = '‹';
        botonAnterior.setAttribute('aria-label', 'Anterior');

        const viewport = document.createElement('div');
        viewport.classList.add('carrusel-viewport');
        viewport.tabIndex = 0;
        viewport.setAttribute('aria-label', 'Fila de guitarras destacadas');

        const pista = document.createElement('div');
        pista.classList.add('carrusel-pista');

        destacados.forEach((producto) => {
            pista.append(crearCard(producto, true));
        });

        viewport.append(pista);

        const botonSiguiente = document.createElement('button');
        botonSiguiente.type = 'button';
        botonSiguiente.classList.add('carrusel-flecha', 'carrusel-flecha-siguiente');
        botonSiguiente.textContent = '›';
        botonSiguiente.setAttribute('aria-label', 'Siguiente');

        carrusel.append(botonAnterior, viewport, botonSiguiente);
        contenedorDestacados.append(carrusel);

        const preferenciaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
        let pausadoPorPreferencia = preferenciaMovimiento.matches;
        let pausaMouse = false;
        let pausaToque = false;
        let pausaTeclado = false;
        let temporizador = null;

        const comportamiento = () => preferenciaMovimiento.matches ? 'auto' : 'smooth';

        const calcularPaso = () => {
            const primeraCard = pista.querySelector('.card');

            if (!primeraCard) {
                return 0;
            }

            const estilosPista = window.getComputedStyle(pista);
            const separacion = parseFloat(estilosPista.columnGap || estilosPista.gap) || 0;

            return primeraCard.getBoundingClientRect().width + separacion;
        };

        const maximoIndice = () => {
            const paso = calcularPaso();

            if (paso === 0) {
                return 0;
            }

            const desplazamientoMaximo = viewport.scrollWidth - viewport.clientWidth;

            return Math.max(0, Math.round(desplazamientoMaximo / paso));
        };

        const indiceActual = () => {
            const paso = calcularPaso();

            return paso === 0 ? 0 : Math.round(viewport.scrollLeft / paso);
        };

        const irAIndice = (indice) => {
            viewport.scrollTo({
                left: indice * calcularPaso(),
                behavior: comportamiento()
            });
        };

        const siguiente = () => {
            const maximo = maximoIndice();
            const actual = indiceActual();

            irAIndice(actual >= maximo ? 0 : actual + 1);
        };

        const anterior = () => {
            const maximo = maximoIndice();
            const actual = indiceActual();

            irAIndice(actual <= 0 ? maximo : actual - 1);
        };

        const detenerAuto = () => {
            if (temporizador !== null) {
                window.clearInterval(temporizador);
                temporizador = null;
            }
        };

        const iniciarAuto = () => {
            const hayPausaTemporal = pausaMouse || pausaToque || pausaTeclado;

            if (temporizador !== null || pausadoPorPreferencia || hayPausaTemporal) {
                return;
            }

            temporizador = window.setInterval(siguiente, 3000);
        };

        botonAnterior.addEventListener('click', () => {
            anterior();
            detenerAuto();
            iniciarAuto();
        });

        botonSiguiente.addEventListener('click', () => {
            siguiente();
            detenerAuto();
            iniciarAuto();
        });

        carrusel.addEventListener('mouseenter', () => {
            pausaMouse = true;
            detenerAuto();
        });
        carrusel.addEventListener('mouseleave', () => {
            pausaMouse = false;
            iniciarAuto();
        });
        carrusel.addEventListener('touchstart', () => {
            pausaToque = true;
            detenerAuto();
        }, { passive: true });
        carrusel.addEventListener('touchend', () => {
            pausaToque = false;
            iniciarAuto();
        });
        carrusel.addEventListener('touchcancel', () => {
            pausaToque = false;
            iniciarAuto();
        });
        carrusel.addEventListener('focusin', () => {
            pausaTeclado = true;
            detenerAuto();
        });
        carrusel.addEventListener('focusout', (evento) => {
            if (!carrusel.contains(evento.relatedTarget)) {
                pausaTeclado = false;
                iniciarAuto();
            }
        });

        const aplicarPreferenciaMovimiento = (evento) => {
            if (evento.matches) {
                pausadoPorPreferencia = true;
                detenerAuto();
            }
        };

        if (typeof preferenciaMovimiento.addEventListener === 'function') {
            preferenciaMovimiento.addEventListener('change', aplicarPreferenciaMovimiento);
        }

        iniciarAuto();
    };

    obtenerProductos()
        .then(iniciarCarrusel)
        .catch((error) => {
            if (document.querySelector('#productos')) {
                return;
            }

            const detalle = error instanceof Error ? error.message : 'Intentá de nuevo más tarde.';
            const mensaje = document.createElement('p');
            mensaje.classList.add('error-carga');
            mensaje.setAttribute('role', 'alert');
            mensaje.textContent = `No pudimos cargar las guitarras destacadas. ${detalle}`;
            contenedorDestacados.append(mensaje);
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

            const enlaceNombre = document.createElement('a');
            enlaceNombre.href = `producto.html?id=${item.id}`;
            enlaceNombre.textContent = item.nombre;
            nombre.append(enlaceNombre);

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
            actualizarContadorCarrito();
            renderizarCarrito();
            return;
        }

        const botonVaciar = evento.target.closest('.vaciar-carrito');

        if (botonVaciar) {
            eliminarCarritoGuardado();
            actualizarContadorCarrito();
            renderizarCarrito();
            return;
        }

        const botonFinalizar = evento.target.closest('.finalizar-compra');

        if (botonFinalizar) {
            eliminarCarritoGuardado();
            actualizarContadorCarrito();
            renderizarCarrito('¡Compra realizada con éxito!');
        }
    });

    renderizarCarrito();
}

const detalleProducto = document.querySelector('#detalle-producto');

if (detalleProducto) {
    const parametros = new URLSearchParams(window.location.search);
    const idBuscado = Number(parametros.get('id'));
    const migaProducto = document.querySelector('main nav[aria-label="Miga de pan"] li[aria-current="page"]');

    const mostrarMensajeDetalle = (texto, esError = false) => {
        detalleProducto.textContent = '';

        const mensaje = document.createElement('p');
        mensaje.classList.add(esError ? 'error-carga' : 'cargando-productos');
        mensaje.setAttribute('role', esError ? 'alert' : 'status');
        mensaje.textContent = texto;
        detalleProducto.append(mensaje);
    };

    const cargarDetalleProducto = async () => {
        mostrarMensajeDetalle('Cargando guitarras...');

        if (typeof obtenerProductos !== 'function') {
            mostrarMensajeDetalle('No pudimos cargar las guitarras.', true);
            return;
        }

        try {
            const productosCargados = await obtenerProductos();
            const producto = productosCargados.find((item) => item.id === idBuscado);

            detalleProducto.textContent = '';

            if (!producto) {
                if (migaProducto) {
                    migaProducto.textContent = 'Guitarra no encontrada';
                }

                document.title = 'No encontramos esa guitarra';

                const mensaje = document.createElement('p');
                mensaje.classList.add('vista-vacia');
                mensaje.textContent = 'No encontramos esa guitarra';

                const volver = document.createElement('p');
                const enlaceVolver = document.createElement('a');
                enlaceVolver.href = 'index.html#productos';
                enlaceVolver.textContent = 'Volver a la tienda';
                volver.append(enlaceVolver);

                detalleProducto.append(mensaje, volver);
                return;
            }

            if (migaProducto) {
                migaProducto.textContent = producto.nombre;
            }

            document.title = producto.nombre;

            const metaDescripcion = document.querySelector('meta[name="description"]');

            if (metaDescripcion) {
                metaDescripcion.setAttribute('content', producto.descripcion);
            }

            const encabezado = document.createElement('header');

            const categoria = document.createElement('p');
            categoria.textContent = `Categoría: ${producto.categoria}`;

            const marca = document.createElement('p');
            marca.textContent = `Marca: ${producto.marca}`;

            const imagen = document.createElement('img');
            imagen.src = producto.imagen;
            imagen.alt = producto.alt;

            const titulo = document.createElement('h1');
            titulo.textContent = producto.nombre;

            encabezado.append(categoria, marca, imagen, titulo);

            const precioElemento = document.createElement('p');
            precioElemento.classList.add('precio');
            precioElemento.textContent = `Precio: ${precio(producto.precio)}`;

            const descripcion = document.createElement('section');
            const tituloDescripcion = document.createElement('h2');
            tituloDescripcion.textContent = 'Descripción';
            const textoDescripcion = document.createElement('p');
            textoDescripcion.textContent = producto.descripcion;
            descripcion.append(tituloDescripcion, textoDescripcion);

            const acciones = document.createElement('div');
            acciones.classList.add('acciones-producto');

            const botonAgregar = document.createElement('button');
            botonAgregar.type = 'button';

            if (producto.stock === 0) {
                botonAgregar.textContent = 'SIN STOCK';
                botonAgregar.disabled = true;
            } else {
                botonAgregar.textContent = 'Añadir al carrito';
            }

            const mensaje = document.createElement('p');
            mensaje.classList.add('mensaje-carrito');
            mensaje.setAttribute('aria-live', 'polite');

            botonAgregar.addEventListener('click', () => {
                agregarProductoAlCarrito(producto);
                mensaje.textContent = `Agregaste ${producto.nombre} al carrito`;
            });

            acciones.append(botonAgregar, mensaje);

            const volver = document.createElement('p');
            const enlaceVolver = document.createElement('a');
            enlaceVolver.href = 'index.html#productos';
            enlaceVolver.textContent = '← Volver al listado de productos';
            volver.append(enlaceVolver);

            detalleProducto.append(encabezado, precioElemento, descripcion, acciones, volver);
        } catch (error) {
            if (migaProducto) {
                migaProducto.textContent = 'Error al cargar';
            }

            document.title = 'Error al cargar las guitarras';

            const detalle = error instanceof Error ? error.message : 'Intentá de nuevo más tarde.';
            mostrarMensajeDetalle(`No pudimos cargar las guitarras. ${detalle}`, true);
        }
    };

    cargarDetalleProducto();
}
