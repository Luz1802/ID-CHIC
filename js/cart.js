const API_URL = "http://localhost:8080/api";
const cartBody = document.getElementById("cart-body");
const totalSpan = document.getElementById("total");
const tablaCarrito = document.querySelector("table");
const resumenCompra = document.querySelectorAll("div.bg-white.rounded-lg.shadow-md.p-6.w-full.md\\:w-1\\/2")[0];
const metodoPago = document.querySelectorAll("div.bg-white.rounded-lg.shadow-md.p-6.w-full.md\\:w-1\\/2")[1];

const mensajeVacio = document.createElement("p");
mensajeVacio.classList = "text-center text-gray-500 text-lg my-6 font-semibold";
mensajeVacio.textContent = "🛒 Tu carrito está vacío.";

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function cargarCarrito() {
  cartBody.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    tablaCarrito.style.display = "none";
    resumenCompra.style.display = "none";
    metodoPago.style.display = "none";
    if (!document.body.contains(mensajeVacio)) {
      cartBody.parentElement.parentElement.insertAdjacentElement("afterend", mensajeVacio);
    }
    return;
  }

  tablaCarrito.style.display = "table";
  resumenCompra.style.display = "block";
  metodoPago.style.display = "block";
  if (document.body.contains(mensajeVacio)) mensajeVacio.remove();

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const row = document.createElement("tr");
    row.classList = "border-b text-center";
    row.innerHTML = `
      <td class="py-4 text-left flex items-center gap-2">
        <img src="${item.imagen}" alt="${item.nombre}" class="w-12 h-12 object-cover rounded">
        ${item.nombre}
      </td>
      <td class="py-4">$${item.precio}</td>
      <td class="py-4">
        <button class="px-2 bg-gray-300 rounded" onclick="cambiarCantidad(${index}, -1)">-</button>
        ${item.cantidad}
        <button class="px-2 bg-gray-300 rounded" onclick="cambiarCantidad(${index}, 1)">+</button>
      </td>
      <td class="py-4">$${subtotal}</td>
      <td class="py-4">
        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="eliminarProducto(${index})">❌</button>
      </td>
    `;
    cartBody.appendChild(row);
  });

  totalSpan.textContent = `$${total}`;
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito();
}

document.getElementById("buy-btn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  const metodoSeleccionado = document.querySelector('input[name="payment"]:checked').value;
  alert(`✅ Compra realizada con método de pago: ${metodoSeleccionado}`);
  carrito = [];
  localStorage.removeItem("carrito");
  cargarCarrito();
});

cargarCarrito();
