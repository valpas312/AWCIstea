const API_TOKEN =
  "patdhWEghM3DDKm5u.c1127999a716b968324b960a33484eaa29837975bd9d4da2100fb892ba52c731";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const editarProductoForm = document.getElementById("editarProductoForm");

const id = new URLSearchParams(window.location.search).get("id");

// Función para llenar el formulario de edición con los datos del producto
const fillEditForm = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
        },
        });
    
        if (!response.ok) {
        throw new Error("Error al obtener el producto");
        }
    
        const data = await response.json();
        const product = data.fields;
    
        // Llenar el formulario con los datos del producto
        document.getElementById("nombre").value = product.Nombre || "";
        document.getElementById("descripcion").value = product.Descripcion || "";
        document.getElementById("imagen").value = product.Imagen || "";
        document.getElementById("precio").value = product.Precio || "";
    
    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos del producto. Por favor, inténtalo de nuevo.");
    }
}

// Llamar a la función para llenar el formulario al cargar la página
if (id) {
    fillEditForm(id);
}

// Funcion para editar un producto en Airtable
const editAirtable = async (id, product) => {
  const itemAirtable = {
    fields: product,
  };

  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemAirtable),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al editar el producto");
      }
    })
    .then((data) => {
      console.log("Producto editado:", data);
      alert("Producto editado correctamente");
      window.location.href = "index.html"; // Redirigir a la página principal
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al editar el producto. Por favor, inténtalo de nuevo.");
    });
};

editarProductoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = new URLSearchParams(window.location.search).get("id");
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
    console.log("Producto a editar:", data);
    editAirtable(id, data);
  } else {
    alert("Por favor, completa todos los campos.");
  }
});