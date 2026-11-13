const productos = [
    {
        id: 1,
        nombre: 'Guitarra Eléctrica Stratocaster',
        precio: 850,
        stock: 5,
        destacado: true,
        categoria: 'electrica',
        marca: 'stratocaster',
        descripcion: 'Guitarra eléctrica versátil con cuerpo de aliso y tres micrófonos single-coil.',
        imagen: 'img/Guitarra Eléctrica Stratocaster.webp',
        alt: 'Guitarra eléctrica Stratocaster roja'
    },
    {
        id: 2,
        nombre: 'Guitarra Electroacústica Dreadnought',
        precio: 520,
        stock: 3,
        destacado: true,
        categoria: 'acustica',
        marca: 'dreadnought',
        descripcion: 'Electroacústica con tapa de abeto macizo, preamplificador y afinador integrado.',
        imagen: 'img/Guitarra Electroacústica Dreadnought.webp',
        alt: 'Guitarra electroacústica Dreadnought'
    },
    {
        id: 3,
        nombre: 'Bajo Leonard Precision Bass De Estudio',
        precio: 400,
        stock: 2,
        destacado: true,
        categoria: 'bajo',
        marca: 'leonard',
        descripcion: 'Bajo eléctrico Precision de 4 cuerdas, cómodo para estudio y escenario.',
        imagen: 'img/Bajo Leonard Precision Bass De Estudio.webp',
        alt: 'Bajo Leonard Precision Bass de estudio'
    },
    {
        id: 4,
        nombre: 'Guitarra Eléctrica Squier by Fender',
        precio: 950,
        stock: 4,
        destacado: true,
        categoria: 'electrica',
        marca: 'fender',
        descripcion: 'Guitarra eléctrica Squier by Fender con sonido clásico y gran relación precio-calidad.',
        imagen: 'img/Fender-roja.webp',
        alt: 'Guitarra eléctrica Squier by Fender roja'
    },
    {
        id: 5,
        nombre: 'Guitarra Clásica Criolla Aston Reed de Estudio',
        precio: 100,
        stock: 0,
        destacado: true,
        categoria: 'acustica',
        marca: 'aston',
        descripcion: 'Guitarra criolla de estudio con cuerpo liviano y sonido cálido.',
        imagen: 'img/criolla-azul.webp',
        alt: 'Guitarra clásica criolla Aston Reed azul'
    },
    {
        id: 6,
        nombre: 'Guitarra Eléctrica Black Cherry ESP LTD',
        precio: 550,
        stock: 6,
        destacado: true,
        categoria: 'electrica',
        marca: 'esp ltd',
        descripcion: 'Guitarra eléctrica ESP LTD con estética Black Cherry y micrófonos de alta salida.',
        imagen: 'img/electrica-roja-leopardo.webp',
        alt: 'Guitarra eléctrica Black Cherry ESP LTD roja con diseño de leopardo'
    }
];

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

const { disponibles, agotados } = separarPorStock(productos);

const mostrarGrupo = (titulo, grupo) => {
    console.group(titulo);
    console.table(grupo);
    console.groupEnd();
};

mostrarGrupo('Disponibles', disponibles);
mostrarGrupo('Agotados', agotados);

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

    aplicarFiltros();
}
