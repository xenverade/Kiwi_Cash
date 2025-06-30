let productos = [];

fetch("./js/productos.json")
  .then(response => response.json())
  .then(data => {
    productos = data;
    cargarProductos(productos.filter(p => p.categoria.id === "celulares")); // Mostrar celulares por defecto
    activarBotonesFiltro();
  });

const contenedorProductos = document.querySelector("#contenedor-productos");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Cargar productos filtrados
function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";

  productosElegidos.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
      <div class="producto-detalles">
        <h3 class="producto-titulo">${producto.titulo}</h3>
        <p class="producto-precio">S/ ${producto.precio}.00</p>
        <button class="producto-agregar" id="${producto.id}">Agregar</button>
      </div>
    `;
    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar();
}

// Filtro por categoría
function activarBotonesFiltro() {
  const botonesCategoria = document.querySelectorAll(".nav-link");

  botonesCategoria.forEach(boton => {
    boton.addEventListener("click", e => {
      e.preventDefault();

      botonesCategoria.forEach(b => b.classList.remove("active"));
      boton.classList.add("active");

      const categoria = boton.getAttribute("data-categoria");
      const productosFiltrados = productos.filter(p => p.categoria.id === categoria);
      tituloPrincipal.innerText = boton.innerText;
      cargarProductos(productosFiltrados);
    });
  });
}

// Botones agregar
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito = [];
const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
}

function agregarAlCarrito(e) {
  Toastify({
    text: "Producto agregado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #04426a, #04426a)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem"
    },
    offset: {
      x: '1.5rem',
      y: '1.5rem'
    }
  }).showToast();

  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(producto => producto.id === idBoton);

  if (productosEnCarrito.some(producto => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
  const total = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerText = total;
}

