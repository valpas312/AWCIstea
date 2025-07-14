// toast.js
// toast.js
export function initToast() {
  // Si ya existe, no lo creamos de nuevo
  if (document.getElementById('toast')) return;

  const div = document.createElement('div');
  div.id = 'toast';
  div.className = 'toast';
  document.body.appendChild(div);
}

export function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return console.warn("No se ha inicializado el toast. Llamá primero a initToast()");

  toast.textContent = mensaje;
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000);
}
