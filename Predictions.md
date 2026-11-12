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