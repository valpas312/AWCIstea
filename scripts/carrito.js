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
    const { nombre, precio, imagen, cantidad } = producto;
    total += precio * cantidad;

    const item = document.createElement("li");
    item.classList.add("carrito-item");
    item.innerHTML = `
        <img src="${imagen}" alt="${nombre}" class="carrito-imagen">
        <div class="carrito-info">
            <h4>${nombre}</h4>
            <p>$${precio} x ${cantidad}</p>
        </div>
        <button class="btn eliminar" data-index="${index}">Eliminar</button>
        `;

    carritoContainer.appendChild(item);
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;

  // Agregar evento para eliminar productos del carrito
  const eliminarBtns = document.querySelectorAll(".eliminar");
  eliminarBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarCarrito();
    });
  });
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
