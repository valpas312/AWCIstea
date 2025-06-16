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
    };
  });

  // Mostrar los datos en la consola
  formattedData.forEach((item) => {
    const { nombre, descripcion, imagen, precio } = item;

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
    <button class="btn">Añadir al carrito</button>
    `;

    const button = document.querySelector(".btn");

    //button
    button.addEventListener("click", () => {
      // Aquí puedes agregar la lógica para añadir el producto al carrito
      // Por ejemplo, podrías guardar el producto en el localStorage

      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push({ nombre, precio });
      localStorage.setItem("carrito", JSON.stringify(carrito));
      // Mostrar un mensaje de éxito
      console.log(`Añadido al carrito:`, nombre, precio, imagen);
    });

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
