const API_TOKEN =
  "patdhWEghM3DDKm5u.c1127999a716b968324b960a33484eaa29837975bd9d4da2100fb892ba52c731";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

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
    };
  });

  formattedData.forEach((item) => {
    const { nombre, descripcion, imagen, precio, Id } = item;

    let cantidad = 1; // Cantidad por defecto

    // Crear un elemento para cada producto
    const instrumento = document.createElement("li");
    instrumento.classList.add("instrumento-item");

    // Agregar contenido al elemento
    instrumento.innerHTML = `
    <img src="${imagen}" alt="${nombre}" class="instrumento-imagen">
    <div class="instrumento-info">
    <h4>${nombre}</h4>
    <p>${descripcion}</p>
    <p class="instrumento-precio">$${precio}</p>
    `;

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
    instrumento.appendChild(btnAgregar);
    instrumento.appendChild(btnEditar);

    // Agregar el elemento al contenedor correspondiente
    if (nombre.includes("Guitarra")) {
      guitarras.appendChild(instrumento);
    } else if (nombre.includes("Bateria")) {
      baterias.appendChild(instrumento);
    } else if (nombre.includes("Teclado")) {
      teclados.appendChild(instrumento);
    } else if (nombre.includes("Bajo")) {
      bajos.appendChild(instrumento);
    }
  });

  console.log("data", formattedData);
};


getAirtableData();
