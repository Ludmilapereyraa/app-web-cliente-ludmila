const productos = [
    { id: 1, nombre: 'Guitarra Eléctrica Stratocaster', precio: 850, stock: 5 },
    { id: 2, nombre: 'Guitarra Electroacústica Dreadnought', precio: 520, stock: 3 },
    { id: 3, nombre: 'Bajo Leonard Precision Bass De Estudio', precio: 400, stock: 2 },
    { id: 4, nombre: 'Guitarra Eléctrica Squier by Fender', precio: 950, stock: 4 },
    { id: 5, nombre: 'Guitarra Clásica Criolla Aston Reed de Estudio', precio: 100, stock: 0 },
    { id: 6, nombre: 'Guitarra Eléctrica Black Cherry ESP LTD', precio: 550, stock: 6 }
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
