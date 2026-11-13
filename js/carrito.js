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

const obtenerCantidadCarrito = (carrito = leerCarrito()) => carrito.reduce((total, item) => {
    if (!item || typeof item !== 'object') {
        return total;
    }

    const cantidad = Number(item.cantidad);
    return total + (Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 1);
}, 0);

const actualizarContadorCarrito = () => {
    const linkCarrito = document.querySelector('a[href="carrito.html"]');

    if (!linkCarrito) {
        return;
    }

    let contador = linkCarrito.querySelector('.contador-carrito');

    if (!contador) {
        contador = document.createElement('span');
        contador.classList.add('contador-carrito');
        linkCarrito.appendChild(contador);
    }

    contador.textContent = obtenerCantidadCarrito();
};

const agregarProductoAlCarrito = (producto) => {
    if (!producto) {
        return;
    }

    const carrito = leerCarrito();
    const itemCarrito = carrito.find((item) => Number(item.id) === Number(producto.id));

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
    actualizarContadorCarrito();
    return carrito;
};

actualizarContadorCarrito();
