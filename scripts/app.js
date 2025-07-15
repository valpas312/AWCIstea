const API_TOKEN =
  "patdhWEghM3DDKm5u.b4a67c54da5bc87051e7d7a3468a59b203717aa913ae4463098fda4cbe011faf";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

import { mostrarToast, initToast } from "./toast.js";

// Inicializar el toast
initToast();

// --- ELEMENTOS DEL DOM ---
const instrumentosContainer = document.querySelector(".instrumentos");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroOrden = document.getElementById("filtro-orden");

// Almacenará todos los productos obtenidos de la API
let allProducts = [];

// --- FUNCIÓN PARA RENDERIZAR PRODUCTOS ---
// Recibe un array de productos y los muestra en el DOM
const renderProducts = (productsToRender) => {
  instrumentosContainer.innerHTML = ""; // Limpiar la lista actual

  if (productsToRender.length === 0) {
    instrumentosContainer.innerHTML =
      "<p>No se encontraron productos con estos filtros.</p>";
    return;
  }

  productsToRender.forEach((item) => {
    const { nombre, descripcion, imagen, precio, Id, categoria } = item;
    let cantidad = 1;

    const instrumento = document.createElement("li");
    instrumento.classList.add("instrumento-item");
    instrumento.innerHTML = `
      <button class="btn eliminar">Eliminar</button>
      <div class="instrumento-imagen-container">
      <img src="${imagen}" alt="${nombre}" class="instrumento-imagen">
      </div>
      <div class="instrumento-info ${categoria}">
        <h4>${nombre}</h4>
        <p class="instrumento-descripcion">${descripcion}</p>
        <p class="instrumento-precio">$${precio}</p>
      </div>`;

    // --- Lógica de botones (Editar, Eliminar, Añadir al carrito) ---
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
        mostrarToast(`Se eliminó: ${nombre}`);
        getAirtableData();
      } else {
        alert(`Error al eliminar ${nombre}.`);
      }
    });

    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn", "editar");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => {
      window.location.href = `editarProducto.html?id=${Id}`;
    });

    const btnAgregar = document.createElement("button");
    btnAgregar.classList.add("btn", "agregar");
    btnAgregar.textContent = "Añadir al carrito";
    btnAgregar.addEventListener("click", () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const productoExistente = carrito.find((p) => p.nombre === nombre);

      if (productoExistente) {
        productoExistente.cantidad += cantidad;
        mostrarToast(
          `Tienes ${productoExistente.cantidad} ${nombre} en el carrito.`
        );
      } else {
        const producto = { nombre, descripcion, imagen, precio, cantidad };
        carrito.push(producto);
        mostrarToast(`${nombre} ha sido añadido al carrito.`);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
    });

    const botones = document.createElement("div");
    botones.classList.add("botones");
    botones.appendChild(btnAgregar);
    botones.appendChild(btnEditar);

    const info = instrumento.querySelector(".instrumento-info");
    info.appendChild(botones);

    instrumentosContainer.appendChild(instrumento);
  });
};

// --- FUNCIÓN PARA APLICAR FILTROS Y ORDENAMIENTO ---
const applyFiltersAndSort = () => {
  let filteredProducts = [...allProducts];

  // 1. Filtrar por categoría
  const categoriaSeleccionada = filtroCategoria.value;
  if (categoriaSeleccionada !== "todos") {
    filteredProducts = filteredProducts.filter(
      (producto) => producto.categoria === categoriaSeleccionada,
      console.log(`Filtrando por categoría: ${categoriaSeleccionada}`)
    );
  }

  // 2. Ordenar
  const ordenSeleccionado = filtroOrden.value;
  switch (ordenSeleccionado) {
    case "precio-asc":
      filteredProducts.sort((a, b) => a.precio - b.precio);
      break;
    case "precio-desc":
      filteredProducts.sort((a, b) => b.precio - a.precio);
      break;
    case "alfabetico":
      filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
  }

  // 3. Renderizar el resultado
  renderProducts(filteredProducts);
};

// --- FUNCIÓN PRINCIPAL PARA OBTENER DATOS DE AIRTABLE ---
const getAirtableData = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }

    const data = await response.json();

    allProducts = data.records.map((record) => ({
      Id: record.id,
      nombre: record.fields.Nombre,
      descripcion: record.fields.Descripcion,
      imagen: record.fields.Imagen,
      precio: record.fields.Precio,
      categoria: record.fields.Categoria,
    }));

    localStorage.setItem("productos", JSON.stringify(allProducts));

    console.log("Productos cargados:", allProducts);

    // Aplicar filtros
    applyFiltersAndSort();
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    instrumentosContainer.innerHTML =
      "<p>Error al cargar los productos. Inténtalo de nuevo más tarde.</p>";
  }
};

// --- EVENT LISTENERS PARA LOS FILTROS ---
filtroCategoria.addEventListener("change", applyFiltersAndSort);
filtroOrden.addEventListener("change", applyFiltersAndSort);

// --- INICIAR LA CARGA DE DATOS AL CARGAR LA PÁGINA ---
getAirtableData();
