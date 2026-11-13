const SUPABASE_URL = 'https://mqtbqukaylhvgbopujya.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qWYdccfQ0FoazFvcRtyWCQ_2S9r5vBc';

let productos = [];
let promesaProductos = null;

const normalizarProducto = (producto) => {
    const id = Number(producto.id);
    const precioNumero = Number(producto.precio);
    const stock = Number(producto.stock);
    const destacado = producto.destacado === true
        || producto.destacado === 'true'
        || Number(producto.destacado) === 1;

    return {
        ...producto,
        id: Number.isFinite(id) ? id : producto.id,
        nombre: String(producto.nombre ?? ''),
        precio: Number.isFinite(precioNumero) ? precioNumero : 0,
        stock: Number.isFinite(stock) ? stock : 0,
        destacado,
        categoria: String(producto.categoria ?? ''),
        marca: String(producto.marca ?? ''),
        descripcion: String(producto.descripcion ?? ''),
        imagen: String(producto.imagen ?? ''),
        alt: String(producto.alt ?? '')
    };
};

const precio = (n) => '$ ' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });

const separarPorStock = (lista) => {
    const disponibles = [];
    const agotados = [];

    lista.forEach((producto) => {
        if (producto.stock > 0) {
            disponibles.push(producto);
        } else {
            agotados.push(producto);
        }
    });

    return { disponibles, agotados };
};

const mostrarGrupo = (titulo, grupo) => {
    console.group(titulo);
    console.table(grupo);
    console.groupEnd();
};

const nombresMayoresA100 = (lista) => lista
    .filter((producto) => producto.precio > 100)
    .map((producto) => producto.nombre.toUpperCase());

const calcularTotalConIva = (lista) => {
    const subtotal = lista.reduce(
        (acumulador, producto) => acumulador + producto.precio * producto.stock,
        0
    );
    const iva = subtotal * 0.21;

    return {
        subtotal,
        iva,
        total: subtotal + iva
    };
};

const mostrarResumenProductos = () => {
    const { disponibles, agotados } = separarPorStock(productos);
    mostrarGrupo('Disponibles', disponibles);
    mostrarGrupo('Agotados', agotados);

    const nombres = nombresMayoresA100(productos);
    const totales = calcularTotalConIva(productos);

    console.group('Nombres con precio mayor a 100');
    console.table(nombres);
    console.groupEnd();

    console.group('Totales');
    console.log('Subtotal:', precio(totales.subtotal));
    console.log('IVA 21%:', precio(totales.iva));
    console.log('Total con IVA:', precio(totales.total));
    console.groupEnd();
};

const obtenerProductos = async () => {
    if (promesaProductos) {
        return promesaProductos;
    }

    promesaProductos = (async () => {
        try {
            const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/productos?select=*&order=id.asc`, {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status} al cargar los productos`);
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error('Supabase no devolvió una lista de productos');
            }

            productos = datos
                .filter((producto) => producto && typeof producto === 'object')
                .map(normalizarProducto);

            mostrarResumenProductos();
            return productos;
        } catch (error) {
            if (error instanceof TypeError) {
                throw new Error('Error de conexión con Supabase');
            }

            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error desconocido al cargar los productos');
        }
    })();

    return promesaProductos;
};

const crearCard = (producto, mostrarDescripcion = false) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = producto.id;

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('card-img-container');

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.alt;
    imgContainer.append(img);

    const titulo = document.createElement('h3');
    const enlaceTitulo = document.createElement('a');
    enlaceTitulo.href = `producto.html?id=${producto.id}`;
    enlaceTitulo.textContent = producto.nombre;
    titulo.append(enlaceTitulo);

    const precioElemento = document.createElement('span');
    precioElemento.classList.add('precio');
    precioElemento.textContent = precio(producto.precio);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = producto.stock === 0 ? 'SIN STOCK' : 'AÑADIR AL CARRITO';
    boton.disabled = producto.stock === 0;

    card.append(imgContainer, titulo);

    if (mostrarDescripcion) {
        const descripcion = document.createElement('p');
        descripcion.classList.add('card-descripcion');
        descripcion.textContent = producto.descripcion;
        card.append(descripcion);
    }

    card.append(precioElemento, boton);

    return card;
};

const contenedorProductos = document.querySelector('#productos');

if (contenedorProductos) {
    const tituloProductos = contenedorProductos.querySelector('h2');
    const barraOrden = contenedorProductos.querySelector('.barra-orden');
    const inputBusqueda = document.querySelector('#busqueda');
    const formularioBusqueda = document.querySelector('form[role="search"]');
    const formularioFiltros = document.querySelector('#filtros form');
    const botonLimpiar = formularioFiltros ? formularioFiltros.querySelector('button[type="reset"]') : null;
    const inputPrecioMin = document.querySelector('#precio-min');
    const inputPrecioMax = document.querySelector('#precio-max');
    const selectorOrden = document.querySelector('#ordenar');
    let catalogoListo = false;

    const mostrarEstadoCatalogo = (texto, esError = false) => {
        contenedorProductos.textContent = '';

        if (tituloProductos) {
            contenedorProductos.append(tituloProductos);
        }

        if (barraOrden) {
            contenedorProductos.append(barraOrden);
        }

        const mensaje = document.createElement('p');
        mensaje.classList.add(esError ? 'error-carga' : 'cargando-productos');
        mensaje.setAttribute('role', esError ? 'alert' : 'status');
        mensaje.textContent = texto;
        contenedorProductos.append(mensaje);
    };

    const renderizarProductos = (lista) => {
        contenedorProductos.textContent = '';

        if (tituloProductos) {
            contenedorProductos.append(tituloProductos);
        }

        if (barraOrden) {
            contenedorProductos.append(barraOrden);
        }

        if (lista.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.classList.add('sin-resultados');
            mensaje.textContent = 'No encontramos guitarras con esos filtros';
            contenedorProductos.append(mensaje);
            return;
        }

        const fragmento = document.createDocumentFragment();

        lista.forEach((producto) => {
            fragmento.append(crearCard(producto));
        });

        contenedorProductos.append(fragmento);
    };

    const obtenerTildados = (nombre) => {
        if (!formularioFiltros) {
            return [];
        }

        return Array.from(formularioFiltros.querySelectorAll(`input[name="${nombre}"]:checked`))
            .map((input) => input.value);
    };

    const obtenerNumero = (input) => {
        if (!input || input.value.trim() === '') {
            return null;
        }

        const valor = Number(input.value);
        return Number.isFinite(valor) ? valor : null;
    };

    const filtrarProductos = ({ texto, categorias, marcas, precioMin, precioMax }) => productos.filter((producto) => {
        const coincideTexto = !texto || producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categorias.length === 0 || categorias.includes(producto.categoria);
        const coincideMarca = marcas.length === 0 || marcas.includes(producto.marca);
        const coincidePrecioMin = precioMin === null || producto.precio >= precioMin;
        const coincidePrecioMax = precioMax === null || producto.precio <= precioMax;

        return coincideTexto && coincideCategoria && coincideMarca && coincidePrecioMin && coincidePrecioMax;
    });

    const ordenarProductos = (lista, orden) => {
        const copia = [...lista];

        if (orden === 'precio-asc') {
            copia.sort((a, b) => a.precio - b.precio);
        } else if (orden === 'precio-desc') {
            copia.sort((a, b) => b.precio - a.precio);
        } else if (orden === 'nombre-asc') {
            copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        } else if (orden === 'nombre-desc') {
            copia.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
        }

        return copia;
    };

    const aplicarFiltros = () => {
        if (!catalogoListo) {
            return;
        }

        const criterios = {
            texto: inputBusqueda ? inputBusqueda.value.trim().toLowerCase() : '',
            categorias: obtenerTildados('categoria'),
            marcas: obtenerTildados('marca'),
            precioMin: obtenerNumero(inputPrecioMin),
            precioMax: obtenerNumero(inputPrecioMax)
        };
        const filtrados = filtrarProductos(criterios);
        const orden = selectorOrden ? selectorOrden.value : 'default';

        renderizarProductos(ordenarProductos(filtrados, orden));
    };

    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', () => {
            if (formularioFiltros) {
                formularioFiltros.reset();
            }

            aplicarFiltros();
        });
    }

    if (selectorOrden) {
        selectorOrden.addEventListener('change', aplicarFiltros);
    }

    if (formularioBusqueda) {
        formularioBusqueda.addEventListener('submit', (evento) => {
            evento.preventDefault();
            aplicarFiltros();
        });
    }

    if (formularioFiltros) {
        formularioFiltros.addEventListener('submit', (evento) => {
            evento.preventDefault();

            if (inputBusqueda) {
                inputBusqueda.value = '';
            }

            aplicarFiltros();
        });
    }

    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', () => {
            setTimeout(() => {
                if (inputBusqueda) {
                    inputBusqueda.value = '';
                }

                if (selectorOrden) {
                    selectorOrden.value = 'default';
                }

                aplicarFiltros();
            }, 0);
        });
    }

    const iniciarCatalogo = async () => {
        mostrarEstadoCatalogo('Cargando guitarras...');

        try {
            await obtenerProductos();
            catalogoListo = true;
            aplicarFiltros();
        } catch (error) {
            const detalle = error instanceof Error ? error.message : 'Intentá de nuevo más tarde.';
            mostrarEstadoCatalogo(`No pudimos cargar las guitarras. ${detalle}`, true);
        }
    };

    iniciarCatalogo();
}
