const productos = [
    {
        id: 1,
        nombre: 'Guitarra Eléctrica Stratocaster',
        precio: 850,
        stock: 5,
        imagen: 'img/Guitarra Eléctrica Stratocaster.webp',
        alt: 'Guitarra eléctrica Stratocaster roja'
    },
    {
        id: 2,
        nombre: 'Guitarra Electroacústica Dreadnought',
        precio: 520,
        stock: 3,
        imagen: 'img/Guitarra Electroacústica Dreadnought.webp',
        alt: 'Guitarra electroacústica Dreadnought'
    },
    {
        id: 3,
        nombre: 'Bajo Leonard Precision Bass De Estudio',
        precio: 400,
        stock: 2,
        imagen: 'img/Bajo Leonard Precision Bass De Estudio.webp',
        alt: 'Bajo Leonard Precision Bass de estudio'
    },
    {
        id: 4,
        nombre: 'Guitarra Eléctrica Squier by Fender',
        precio: 950,
        stock: 4,
        imagen: 'img/Fender-roja.webp',
        alt: 'Guitarra eléctrica Squier by Fender roja'
    },
    {
        id: 5,
        nombre: 'Guitarra Clásica Criolla Aston Reed de Estudio',
        precio: 100,
        stock: 0,
        imagen: 'img/criolla-azul.webp',
        alt: 'Guitarra clásica criolla Aston Reed azul'
    },
    {
        id: 6,
        nombre: 'Guitarra Eléctrica Black Cherry ESP LTD',
        precio: 550,
        stock: 6,
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

const crearCard = (producto) => {
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
    titulo.textContent = producto.nombre;

    const precioElemento = document.createElement('span');
    precioElemento.classList.add('precio');
    precioElemento.textContent = precio(producto.precio);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = producto.stock === 0 ? 'SIN STOCK' : 'AÑADIR AL CARRITO';
    boton.disabled = producto.stock === 0;

    card.append(imgContainer, titulo, precioElemento, boton);

    return card;
};

const contenedorProductos = document.querySelector('#productos');

if (contenedorProductos) {
    const fragmento = document.createDocumentFragment();

    productos.forEach((producto) => {
        fragmento.append(crearCard(producto));
    });

    contenedorProductos.append(fragmento);
}
