const API_TOKEN =
  "patdhWEghM3DDKm5u.b4a67c54da5bc87051e7d7a3468a59b203717aa913ae4463098fda4cbe011faf";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const editarProductoForm = document.getElementById("editarProductoForm");

const id = new URLSearchParams(window.location.search).get("id");

// Función para llenar el formulario de edición con los datos del producto
const fillEditForm = async (id) => {
  const productos = localStorage.getItem("productos");

  if (productos) {
    const productosArray = JSON.parse(productos);
    const product = productosArray.find((p) => p.Id === id);

    console.log("Producto encontrado:", product);

    if (!product) {
      throw new Error("Producto no encontrado en el almacenamiento local.");
    }
    // Llenar el formulario con los datos del producto
    document.getElementById("nombre").value = product.nombre || "";
    document.getElementById("descripcion").value = product.descripcion || "";
    document.getElementById("imagen").value = product.imagen || "";
    document.getElementById("precio").value = product.precio || "";
  }
};

// Llamar a la función para llenar el formulario al cargar la página
if (id) {
  fillEditForm(id);
}

// Funcion para editar un producto en Airtable
const editAirtable = async (id, product) => {
  const itemAirtable = {
    fields: {
      Nombre: product.nombre,
      Descripcion: product.descripcion,
      Imagen: product.imagen,
      Precio: product.precio,
    },
  };

  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemAirtable),
  })
    .then((response) => response.json())
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

  //validar el largo de todos los campos
  if (descripcion.length < 10) {
    alert("La descripción debe tener al menos 10 caracteres.");
    return;
  }

  if (descripcion.length > 200) {
    alert("La descripción no puede exceder los 200 caracteres.");
    return;
  }

  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres.");
    return;
  
  
  } else if (nombre.length > 50) {
    alert("El nombre no puede exceder los 50 caracteres.");
    return;
  }

  if (imagen.length < 5) {
    alert("La URL de la imagen debe tener al menos 5 caracteres.");
    return;
  }

  if (precio <= 0) {
    alert("El precio debe ser un número positivo.");
    return;
  }

  if (precio.length < 1) {
    alert("El precio no puede estar vacío.");
    return;
  }

  if (precio.length > 10) {
    alert("El precio no puede exceder los 10 caracteres.");
    return;
  }

  if (isNaN(precio)) {
    alert("El precio debe ser un número válido.");
    return;
  }

  // Validar que todos los campos estén completos
  if (nombre && descripcion && imagen && precio) {
    const data = {
      nombre: nombre,
      descripcion: descripcion,
      imagen: imagen,
      precio: parseFloat(precio),
    };
    console.log("Producto a editar:", data);
    editAirtable(id, data);
  } else {
    alert("Por favor, completa todos los campos.");
  }
});
