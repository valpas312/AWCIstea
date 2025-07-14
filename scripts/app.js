const API_TOKEN =
  "patdhWEghM3DDKm5u.b4a67c54da5bc87051e7d7a3468a59b203717aa913ae4463098fda4cbe011faf";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

import { mostrarToast, initToast } from "./toast.js";

// Inicializar el toast
initToast();

//elementos html
const guitarras = document.getElementById("guitarras");
const baterias = document.getElementById("baterias");
const teclados = document.getElementById("teclados");
const bajos = document.getElementById("bajos");

// Función para obtener los datos de Airtable
// y mostrarlos en la página

const getAirtableData = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  const formattedData = data.records.map((record) => {
    return {
      nombre: record.fields.Nombre,
      descripcion: record.fields.Descripcion,
      imagen: record.fields.Imagen,
      precio: record.fields.Precio,
      Id: record.id,
      categoria: record.fields.Categoria || "Otros", // Asignar una categoría por defecto si no existe
    };
  });

  formattedData.forEach((item) => {
    const { nombre, descripcion, imagen, precio, Id, categoria } = item;

    let cantidad = 1; // Cantidad por defecto

    // Crear un elemento para cada producto
    const instrumento = document.createElement("li");
    instrumento.classList.add("instrumento-item");

    // Agregar contenido al elemento
    instrumento.innerHTML = `
    <button class="btn eliminar">Eliminar</button>
    <img src="${imagen}" alt="${nombre}" class="instrumento-imagen">
    <div class="instrumento-info ${categoria}">
    <h4>${nombre}</h4>
    <p>${descripcion}</p>
    <p class="instrumento-precio">$${precio}</p>
    </div>
    `;

    // Agregar evento para eliminar el producto de airtable
    const btnEliminar = instrumento.querySelector(".eliminar");
    btnEliminar.addEventListener("click", async () => {
      console.log(`Eliminar ${nombre}`);

      const deleteResponse = await fetch(`${API_URL}/${Id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (deleteResponse.ok) {
        instrumento.remove();
        alert(`${nombre} ha sido eliminado.`);
        // Actualizar el localStorage
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        const productosActualizados = productos.filter(
          (producto) => producto.Id !== Id
        );
        localStorage.setItem(
          "productos",
          JSON.stringify(productosActualizados)
        );
        // Actualizar carrito si es necesario
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const carritoActualizado = carrito.filter(
          (producto) => producto.nombre !== nombre
        );
        localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
      } else {
        alert(`Error al eliminar ${nombre}.`);
      }
    })

    // Agregar boton para editar el producto
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn", "editar");
    btnEditar.textContent = "Editar";

    // Enviar a pagina de edición (placeholder)
    btnEditar.addEventListener("click", () => {
      console.log(`Editar ${nombre}`);

      window.location.href = `editarProducto.html?id=${Id}`;
    });

    // Agregar botón de añadir al carrito
    const btnAgregar = document.createElement("button");
    btnAgregar.classList.add("btn", "agregar");
    btnAgregar.textContent = "Añadir al carrito";

    // Evento para añadir al carrito
    btnAgregar.addEventListener("click", () => {
      console.log(`Añadir ${cantidad} ${nombre} al carrito`);

      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const producto = {
        nombre: nombre,
        descripcion: descripcion,
        imagen: imagen,
        precio: precio,
        cantidad: cantidad,
      };

      // Verificar si el producto ya está en el carrito
      const productoExistente = carrito.find((item) => item.nombre === nombre);
      if (productoExistente) {
        // Si el producto ya existe, aumentar la cantidad
        productoExistente.cantidad += cantidad;
        alert(`Se ha añadido ${cantidad} más de ${nombre} al carrito.`);
      } else {
        // Si no existe, añadir el nuevo producto
        carrito.push(producto);
        alert(`${nombre} ha sido añadido al carrito.`);
      }

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      console.log("Carrito actualizado:", carrito);
    });

    // Añadir el botón al elemento del instrumento

    const botones = document.createElement("div");
    botones.classList.add("botones");

    botones.appendChild(btnAgregar);
    botones.appendChild(btnEditar);

    const info = instrumento.querySelector(".instrumento-info");
    info.appendChild(botones);

    // Agregar el elemento al contenedor correspondiente
    switch (categoria) {
      case "Guitarra":
        guitarras.appendChild(instrumento);
        break;
      case "Bateria":
        baterias.appendChild(instrumento);
        break;
      case "Teclado":
        teclados.appendChild(instrumento);
        break;
      case "Bajo":
        bajos.appendChild(instrumento);
        break;
      default:
        console.warn(`Categoría desconocida: ${categoria}.`);
    }
  });

  console.log("data", formattedData);
  localStorage.setItem("productos", JSON.stringify(formattedData));
  console.log("Productos guardados en localStorage");
};

getAirtableData();
