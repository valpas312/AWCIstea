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

const getAirtableData = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
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
    const productElement = document.createElement("div");
    productElement.classList.add("product");

    // Agregar contenido al elemento
    productElement.innerHTML = `
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
      <img src="${imagen}" alt="${nombre}" />
      <p>Precio: $${precio}</p>
    `;

    // Agregar el elemento al contenedor correspondiente
    if (nombre.includes("Guitarra")) {
      guitarras.appendChild(productElement);
    } else if (nombre.includes("Batería")) {
      baterias.appendChild(productElement);
    } else if (nombre.includes("Teclado")) {
      teclados.appendChild(productElement);
    } else if (nombre.includes("Bajo")) {
      bajos.appendChild(productElement);
    }
  });

  console.log("data", formattedData);
};

getAirtableData();
