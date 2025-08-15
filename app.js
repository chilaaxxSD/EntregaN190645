// ====== Agrego Luxon ======
const { DateTime } = luxon;
const ZONA = "America/Argentina/Buenos_Aires";
const numAR = new Intl.NumberFormat("es-AR");

// ====== Estado ======
let catalogoData = [];   // juegos desde data.json
let carrito = [];        

// ====== DOM ======
const catalogo      = document.getElementById("catalogo");
const cantidad      = document.getElementById("cantidad");
const listaCarrito  = document.getElementById("lista-carrito");
const totalTxt      = document.getElementById("total");
const finalizarBtn  = document.getElementById("finalizar");

const checkout      = document.getElementById("checkout");
const formCheckout  = document.getElementById("formCheckout");
const cancelar      = document.getElementById("cancelar");
const ticket        = document.getElementById("ticket");

// ====== Toast  ======
function toast(msg, type="info"){
  const color = type==="ok" ? "#2ecc71" : type==="warn" ? "#f39c12" : "#444";
  Toastify({ text: msg, gravity: "top", position: "right", backgroundColor: color, duration: 1800 }).showToast();
}

// ====== Contador ======
function actualizarContador(){
  cantidad.textContent = carrito.length;
  finalizarBtn.classList.toggle("oculto", carrito.length === 0);
}
function calcularTotal(){
  return carrito.reduce((acc, j) => acc + j.precio, 0);
}

// ====== Render ======
function renderCatalogo(){
  catalogo.innerHTML = "";
  catalogoData.forEach(j => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${j.imagen}" alt="${j.nombre}">
      <h3>${j.nombre}</h3>
      <p>${j.genero}</p>
      <p class="precio">$${numAR.format(j.precio)}</p>
      <button data-id="${j.id}">Agregar al carrito</button>
    `;
    catalogo.appendChild(card);
  });
}
function renderCarrito(){
  listaCarrito.innerHTML = "";
  if (carrito.length === 0){
    listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    totalTxt.textContent = "";
    actualizarContador();
    return;
  }
  carrito.forEach((juego, idx) => {
    const fila = document.createElement("div");
    fila.className = "item";
    fila.innerHTML = `
      <span>🎮 ${juego.nombre}</span>
      <span>$${numAR.format(juego.precio)}</span>
      <span class="acciones">
        <button data-idx="${idx}" class="btn-del">❌</button>
      </span>
    `;
    listaCarrito.appendChild(fila);
  });
  totalTxt.textContent = `Total: $${numAR.format(calcularTotal())}`;
  actualizarContador();
}

// ====== Carrito ======
function agregarAlCarrito(id){
  const juego = catalogoData.find(x => x.id === id);
  if (!juego) { toast("Juego no encontrado", "warn"); return; }
  carrito.push(juego);
  renderCarrito();
  toast("Agregado al carrito ✅", "ok");
}
function eliminarDelCarrito(idx){
  carrito.splice(idx, 1);
  renderCarrito();
  toast("Eliminado del carrito", "info");
}

// ====== Checkout (modificado para mostrar comprobante) ======
function abrirCheckout(){
  if (!carrito.length) { toast("Carrito vacío", "warn"); return; }
  checkout.classList.remove("oculto");
  // mostramos el form y ocultamos cualquier ticket anterior
  formCheckout.classList.remove("oculto");
  ticket.classList.add("oculto");
  window.scrollTo({ top: checkout.offsetTop, behavior:"smooth" });
}
function cerrarCheckout(){
  // cerramos la sección completa y dejamos listo para una próxima compra
  checkout.classList.add("oculto");
  ticket.classList.add("oculto");
  formCheckout.classList.remove("oculto");
}
function confirmarCompra(e){
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const email  = document.getElementById("email").value.trim();
  const pago   = document.getElementById("pago").value;
  if (!nombre || !email || !pago){
    toast("Completá todos los campos", "warn");
    return;
  }

  const total  = calcularTotal();
  const ahora  = DateTime.now().setZone(ZONA);
  const orderId = "ORD-" + Math.random().toString(36).slice(2,8).toUpperCase();

  ticket.innerHTML = `
    <p class="ok"><strong>¡Compra confirmada!</strong></p>
    <p>Número de orden: <strong>${orderId}</strong></p>
    <p>Cliente: <strong>${nombre}</strong> — ${email}</p>
    <p>Método de pago: ${pago}</p>
    <p>Fecha: ${ahora.toFormat("dd/LL/yyyy HH:mm")} (${ZONA})</p>
    <p>Total: <strong>$${numAR.format(total)}</strong></p>
  `;

  // Mostrar comprobante dentro del checkout sin cerrarlo
  formCheckout.classList.add("oculto");
  ticket.classList.remove("oculto");
  window.scrollTo({ top: ticket.offsetTop - 20, behavior: "smooth" });

  // Reset de flujo
  carrito = [];
  renderCarrito();
  formCheckout.reset();
  toast("Compra realizada 🎉", "ok");
}

// ====== Eventos ======
catalogo.addEventListener("click", (e)=>{
  if (e.target.tagName === "BUTTON" && e.target.dataset.id){
    agregarAlCarrito(Number(e.target.dataset.id));
  }
});
listaCarrito.addEventListener("click", (e)=>{
  if (e.target.classList.contains("btn-del")){
    eliminarDelCarrito(Number(e.target.dataset.idx));
  }
});
finalizarBtn.addEventListener("click", abrirCheckout);
cancelar.addEventListener("click", cerrarCheckout);
formCheckout.addEventListener("submit", confirmarCompra);

// ====== Init (fetch data.json) ======
async function init(){
  try{
    const res = await fetch("data.json");
    const data = await res.json();
    catalogoData = data;
    renderCatalogo();
    renderCarrito();
  }catch{
    catalogo.innerHTML = `<p>No se pudo cargar <strong>data.json</strong>. Abrí el proyecto con un servidor local (Live Server).</p>`;
    toast("Error cargando catálogo", "warn");
  }
}
init();
