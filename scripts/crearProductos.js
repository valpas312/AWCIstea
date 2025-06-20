const API_TOKEN =
  "patdhWEghM3DDKm5u.c1127999a716b968324b960a33484eaa29837975bd9d4da2100fb892ba52c731";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const crearProductoForm = document.getElementById("crearProductoForm");

// Función para crear un producto en Airtable
const addToAirtable = async (product) => {
  const itemAirtable = {
    fields: product,
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemAirtable),
  }).then((data) => console.log(data));
};

crearProductoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const imagen = document.getElementById("imagen").value;
  const precio = document.getElementById("precio").value;

  if (descripcion.length < 10) {
    alert("La descripción debe tener al menos 10 caracteres.");
    return;
  }

  if (descripcion.length > 200) {
    alert("La descripción no puede exceder los 200 caracteres.");
    return;
  }

  if (nombre && descripcion && imagen && precio) {
    const data = {
      Nombre: nombre,
      Descripcion: descripcion,
      Imagen: imagen,
      Precio: parseFloat(precio),
    };
    console.log("Producto a crear:", data);
    addToAirtable(data);
    alert("Producto creado correctamente");
  } else {
    alert("Por favor, completa todos los campos.");
  }
});
