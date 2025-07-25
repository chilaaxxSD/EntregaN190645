const videojuegos = [
  {
    id: 1,
    nombre: "FC 2026",
    precio: 10000,
    genero: "Deportes",
    imagen: "image/fc26.jpg"
  },
  {
    id: 2,
    nombre: "GTA V",
    precio: 15000,
    genero: "Acción / Mundo abierto",
    imagen: "image/gta5.jpg"
  },
  {
    id: 3,
    nombre: "God of War",
    precio: 12000,
    genero: "Aventura / Mitología",
    imagen: "image/godofwar.jpg"
  },
  {
    id: 4,
    nombre: "Red Dead Redemption 2",
    precio: 14000,
    genero: "Acción / Western",
    imagen: "image/rdr2.jpg"
  }
];


const catalogo = document.getElementById("catalogo");
const cantidad = document.getElementById("cantidad");
const verCarrito = document.getElementById("verCarrito");
const listaCarrito = document.getElementById("lista-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function renderizarCatalogo() {
  videojuegos.forEach((juego) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${juego.imagen}" alt="${juego.nombre}">
      <h3>${juego.nombre}</h3>
      <p>${juego.genero}</p>
      <p>$${juego.precio}</p>
      <button onclick="agregarAlCarrito(${juego.id})">Agregar al carrito</button>
    `;
    catalogo.appendChild(card);
  });
}

// Agrega un juego 
function agregarAlCarrito(id) {
  const juego = videojuegos.find((j) => j.id === id);
  carrito.push(juego);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}


function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarCarrito();
}


function actualizarContador() {
  cantidad.textContent = carrito.length;
}

// Muestra el contenido del carrito
function mostrarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach((juego, index) => {
    const item = document.createElement("div");
    item.innerHTML = `
      <p>
        🎮 ${juego.nombre} - $${juego.precio}
        <button onclick="eliminarDelCarrito(${index})">❌</button>
      </p>
    `;
    listaCarrito.appendChild(item);
  });

  const total = carrito.reduce((acc, juego) => acc + juego.precio, 0);
  const totalDiv = document.createElement("p");
  totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
  listaCarrito.appendChild(totalDiv);
}

// Evento para ver el carrito
verCarrito.addEventListener("click", mostrarCarrito);

// Inicialización al cargar
renderizarCatalogo();
actualizarContador();
