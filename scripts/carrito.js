const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

console.log("Carrito:", carrito);

const carritoContainer = document.querySelector(".carrito-container");
const totalElement = document.querySelector(".total");
const vaciarCarritoBtn = document.querySelector(".vaciar-carrito");
const finalizarCompraBtn = document.querySelector(".finalizar-compra");

// Función para mostrar los productos en el carrito
const mostrarCarrito = () => {
  carritoContainer.innerHTML = ""; // Limpiar el contenedor del carrito
  let total = 0;

  carrito.forEach((producto, index) => {
    const { nombre, precio, imagen, cantidad, id } = producto;
    total += precio * cantidad;
    
    // Crear un elemento de lista para cada producto en el carrito
    // y agregar un botón para eliminar el producto del carrito

    const eliminarBtn = document.createElement("button");
    eliminarBtn.classList.add("btn", "eliminar");

    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener("click", () => {
      // Eliminar el producto del carrito por unidad
      carrito[index].cantidad -= 1;
      if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1); // Eliminar el producto si la cantidad es 0
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    });

    const item = document.createElement("li");
    item.classList.add("carrito-item");
    item.innerHTML = `
        <img src="${imagen}" alt="${nombre}" class="carrito-imagen">
        <div class="carrito-info">
            <h4>${nombre}</h4>
            <p>$${precio} x ${cantidad}</p>
        </div>
        `;

    carritoContainer.appendChild(item);
    item.appendChild(eliminarBtn);
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;

};

// Función para vaciar el carrito
const vaciarCarrito = () => {
  carrito.length = 0; // Vaciar el array del carrito
  localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualizar el localStorage
  mostrarCarrito(); // Volver a mostrar el carrito vacío
};

// Función para finalizar la compra
const finalizarCompra = () => {};

mostrarCarrito(); // Mostrar el carrito al cargar la página
