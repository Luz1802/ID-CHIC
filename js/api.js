const API_URL = "http://localhost:8080/api";
const seccionPortaCarnets = document.getElementById("seccion-porta-carnets");
const seccionLanyards = document.getElementById("seccion-lanyards");
const seccionPines = document.getElementById("seccion-pines");

let todosLosProductos = [];
const contenedorProductos = document.querySelector("main");

// Cargar productos
async function cargarProductos() {
  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

    todosLosProductos = await respuesta.json();
    mostrarProductos(todosLosProductos);
    actualizarContadorCarrito();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Mostrar productos
function mostrarProductos(lista) {
  seccionPortaCarnets.innerHTML = "";
  seccionLanyards.innerHTML = "";
  seccionPines.innerHTML = "";

  const mensajePrevio = document.querySelector("#mensaje-busqueda");
  if (mensajePrevio) mensajePrevio.remove();

  const sectionPorta = document.getElementById("porta-carnets");
  const sectionLany = document.getElementById("lanyards");
  const sectionPines = document.getElementById("pines");

  if (lista.length === 0) {
    sectionPorta.style.display = "none";
    sectionLany.style.display = "none";
    sectionPines.style.display = "none";

    const mensaje = document.createElement("div");
    mensaje.id = "mensaje-busqueda";
    mensaje.classList = "flex flex-col items-center justify-center my-20 text-gray-500";
    mensaje.innerHTML = `
      <div class="animate-bounce text-6xl mb-3">🔍</div>
      <p class="text-lg font-semibold">No se encontraron productos.</p>
    `;
    contenedorProductos.appendChild(mensaje);
    return;
  }

  sectionPorta.style.display = "block";
  sectionLany.style.display = "block";
  sectionPines.style.display = "block";

  lista.forEach((prod) => {
    const card = document.createElement("div");
    card.classList = "min-w-[250px] max-w-[250px] bg-white rounded-lg shadow-md flex-shrink-0 overflow-hidden card-hover fade-in";

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="w-full h-40 object-cover">
      <div class="p-3 text-center">
        <h3 class="text-base font-semibold text-gray-800 leading-tight break-words">${prod.nombre}</h3>
        <p class="text-pink-700 font-bold text-sm mt-1">$${prod.precio.toLocaleString("es-CO")}</p>
        <div class="product-btn" data-codigo="${prod.codigo}" data-nombre="${prod.nombre}" data-precio="${prod.precio}" data-imagen="${prod.imagen}">
          Añadir a la cesta
        </div>
      </div>
    `;

    if (prod.codigo.startsWith("PI")) {
      seccionPines.appendChild(card);
    } else if (prod.codigo.startsWith("P")) {
      seccionPortaCarnets.appendChild(card);
    } else if (prod.codigo.startsWith("L")) {
      seccionLanyards.appendChild(card);
    }
  });

  // Asignar eventos a botones
  document.querySelectorAll(".product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const codigo = btn.getAttribute("data-codigo");
      const nombre = btn.getAttribute("data-nombre");
      const precio = parseFloat(btn.getAttribute("data-precio"));
      const imagen = btn.getAttribute("data-imagen");
      agregarAlCarrito(codigo, nombre, precio, imagen, btn);
    });
  });
}

// Agregar al carrito con animación en botón
async function agregarAlCarrito(codigo, nombre, precio, imagen, boton) {
  const producto = { codigo, nombre, precio, cantidad: 1, imagen };
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const index = carrito.findIndex((item) => item.codigo === codigo);
  if (index >= 0) carrito[index].cantidad += 1;
  else carrito.push(producto);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();

  // Animación: botón cambia a check y vuelve al texto original
  boton.textContent = "✅ Añadido!";
  boton.style.backgroundColor = "#10b981"; // Verde éxito
  setTimeout(() => {
    boton.textContent = "Añadir a la cesta";
    boton.style.backgroundColor = "#be185d"; // Rosa original
  }, 1500);

  // Guardar en backend simulado
  await fetch(`${API_URL}/carrito`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById("cart-count").textContent = total;
}

// Buscar productos
document.getElementById("search-input").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = todosLosProductos.filter((prod) =>
    prod.nombre.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
});

cargarProductos();
