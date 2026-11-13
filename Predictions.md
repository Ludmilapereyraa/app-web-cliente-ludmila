1. ## Prediccion Clase 1
 Quiero hacer la estructura base de mi index.html. Le voy a pedir a OpenCode que cree la estructura HTML semántica básica con doctype, html, head, body, header, nav, main, section y footer.

2. ## Predicción Clase 2
Esperamos que OpenCode cree la estructura semántica completa con las páginas de contacto, carrito y producto. El formulario de contacto no debe permitir el envío si los campos obligatorios están vacíos o si el formato del correo es incorrecto, resolviendo todo con validación nativa sin usar JavaScript. En la pagina de producto debera hacer una breve descripcion detallada sobre el producto seleccionado como por ejemplo caracteristicas, precio, descripcion. Y en la pagina de carrito debera de crear un seguimiento de los productos que se estan agregando o del caso contrario "El carrito de compras esta vacio"

3. ## Predicción Clase 3
Me gustaria poder realizar con OpenCode todo el diseño de mi sitio web de guitarras, en donde se pueda lucir la gama de colores para dar con la estetica de la pagina pensada. Que genere un archivo "styles.css" para darle estilo general como la definición de tipografía, colores del sitio en variables y reseteo del "body, header, productos destacados, nav y footer".

4. ## Predicción 
Quiero que OpenCode cree un archivo js/app.js y lo vincule en mis páginas con
defer. Espero que use querySelector y querySelectorAll para traer el nav, sus
links y el botón del newsletter, y que al hacer clic en un link del menú le
agregue la clase "activa" y se la quite a los demás con classList. Espero
también que cree los mensajes de error con createElement y textContent (no
innerHTML), y que use un solo listener para los botones "Añadir al carrito"

5. ## Predicción
Espero que OpenCode cree un archivo js/catalogo.js con un array de 6 productos
(id, nombre, precio, stock) usando const. Espero una función flecha precio(n)
que devuelva un string con formato "$ 1.234", la separación de productos
disponibles y agotados con if/else, y el cálculo del total con IVA usando
filter, map y reduce en lugar de un for clásico. Lo voy a probar en la consola
con console.table.

6. ## Predicción
Qiero que OpenCode use el array de js/catalogo.js para generar las cards de
la sección "Todas las guitarras" con createElement y append, sin innerHTML.
Espero que cada card muestre imagen, nombre y precio con la función precio(),
y que el producto con stock 0 muestre el botón deshabilitado. Ademas quiero
que me diga que borre las cards escritas a mano en index.html.

7. ## Prediccióm
Me gustario que OpenCode me avise que si cuando completo el formulario, me avise si el email esta mal y que cuando el cliente toque el boton de "suscribirme" con los campos vacios, el formulario no se envíe. 
Al igual que si el email o formulario estan bien, no aparezco un error. 

8. ## Predicción
Me gustaria que OpenCode pudiera poner un solo listener en el contenedor de guitarra. Y que cuando se presione "añadir al carrito" en cualquier guitarra, aparezca en la pagina un mensaje con el nombre de ese producto y que el contador del carrito suba de a uno a uno. Ademas me gustaria que el boton de "Sin stock" no haga nada en mi pagina.

9. ## Predicción
Deseo que OpenCode pueda hacer que los filtros de mi pagina funcionen de verdad, que al marcar una "marca" o "categoria" o precio de min o max, demuestre que funciona aplicando a las guitarras que cumplan con la condicion. 
Ademas que el boton de "limpiar filtros" funcione y que si  no hay ningun producto que haga una especie de match, que muestre un mensaje avisando al usuario. El buscador igual tiene que cumplir su función de que si un usario escribe el nombre del producto que desea, este lo detecte y lo muestre en pantalla.

10. ## Predicción
Espero que al tocar cualquier guitarra, ya sea en las destacadas o en "Todas las
guitarras", se abra la página del producto mostrando justo esa guitarra, con su
imagen, nombre y precio. Espero que el botón "Añadir al carrito" de esa página
funcione y sume al carrito, y que si el producto no existe aparezca un mensaje
avisándolo. También espero que la guitarra agotada no se pueda agregar. Ademas de agregar un selector de ordenamiento que las ordene de menor precio a mayor precio, A-Z.
Me gustaria que la IA pueda hacer que las guitarras destacadas aparezcan en una fila que se desplaza sola cada pocos segundos y vuelve al principio al llegar al final. Espero que se frene cuando paso el mouse por encima y que haya un botón para pausarlo

11. ## Predicción
## Predicción (Supabase)
(Nota: me olvidé de escribir esta predicción antes, así que la escribí después de ejecutar el prompt.)
Esperaba que OpenCode hiciera que mis guitarras ya no estén escritas a mano en el código, sino que la página las pida a Supabase con fetch, usando async/await y try/catch. Esperaba que mientras llegan los datos aparezca "Cargando guitarras...", que si algo falla se muestre un mensaje en la página, y que las cards, los filtros, el carrusel, el detalle de producto y el carrito sigan funcionando igual.

**Resultado:** coincidió. Los productos se cargan desde Supabase y revisa res.ok. 