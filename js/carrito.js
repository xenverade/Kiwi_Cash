let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonContinuar = document.querySelector("#carrito-continuar");

function cargarProductosCarrito() {
  if (productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-img" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="carrito-descripcion">
          <p class="titulo">${producto.titulo}</p>
          <p class="vendedor">Vendido por <strong>Kiwicash</strong></p>
          <div class="carrito-cantidad">
            <button class="btn-cantidad menos" data-id="${producto.id}">-</button>
            <span>${producto.cantidad}</span>
            <button class="btn-cantidad mas" data-id="${producto.id}">+</button>
          </div>
        </div>
        <div class="carrito-total">
          <p class="precio-anterior">S/ ${(producto.precio * 1.1).toFixed(2)}</p>
          <p class="precio-oh">S/ ${(producto.precio).toFixed(2)}</p>
        </div>
        <button class="carrito-eliminar" data-id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
      `;
      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesCantidad();
    actualizarBotonesEliminar();
    actualizarTotal();
    actualizarResumen();
  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
}

function actualizarResumen() {
  const subtotal = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  const descuento = subtotal * 0.1; // 10% de descuento
  const totalFinal = subtotal - descuento;

  document.querySelector("#subtotal").innerText = `S/ ${subtotal.toFixed(2)}`;
  document.querySelector("#descuento").innerText = `- S/ ${descuento.toFixed(2)}`;
  document.querySelector("#total-final").innerText = `S/ ${totalFinal.toFixed(2)}`;

  const totalOhEl = document.querySelector("#total-oh");
  if (totalOhEl) {
    totalOhEl.innerText = `S/ ${totalFinal.toFixed(2)}`; // Solo si existe
  }
}


function actualizarBotonesCantidad() {
  document.querySelectorAll(".btn-cantidad").forEach(boton => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.id;
      const prod = productosEnCarrito.find(p => p.id === id);
      if (boton.classList.contains("mas")) {
        prod.cantidad++;
      } else {
        if (prod.cantidad > 1) {
          prod.cantidad--;
        } else {
          productosEnCarrito = productosEnCarrito.filter(p => p.id !== id);
        }
      }
      localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      cargarProductosCarrito();
    });
  });
}

function actualizarBotonesEliminar() {
  document.querySelectorAll(".carrito-eliminar").forEach(boton => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.id;
      productosEnCarrito = productosEnCarrito.filter(p => p.id !== id);
      localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      cargarProductosCarrito();
    });
  });
}

function actualizarTotal() {
  const total = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  contenedorTotal.innerText = `S/ ${total.toFixed(2)}`;
}

// Botón Vaciar carrito
botonVaciar.addEventListener("click", () => {
  Swal.fire({
    title: '¿Vaciar carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      productosEnCarrito = [];
      localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      cargarProductosCarrito();
    }
  });
});

// Botón CONTINUAR 
botonContinuar.addEventListener("click", () => {
  if (productosEnCarrito.length === 0) return;
let metodoDePagoSeleccionado = ""; // Global

Swal.fire({
  title: "Selecciona tu método de pago",
  showCancelButton: true,
  showDenyButton: true,
  confirmButtonText: 'Tarjeta',
  denyButtonText: `Yape / Plin`,
  cancelButtonText: 'Cancelar',
  icon: 'question'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: `Compra realizada con Tarjeta`,
      text: "Gracias por tu compra",
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
    finalizarCompra("Tarjeta"); // ✅ Aquí lo pasas
  } else if (result.isDenied) {
    Swal.fire({
      title: 'Escanea para pagar con Yape o Plin',
      html: `<img src="img/yaplin.png" alt="QR de pago" style="width:200px; margin-bottom:10px;"><p>Total a pagar: <strong>${document.querySelector("#total-final").innerText}</strong></p>`,
      confirmButtonText: 'Ya pagué',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: `¡Pago confirmado!`,
          text: "Gracias por tu compra",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        finalizarCompra("Yape/Plin"); // ✅ También aquí
      }
    });
  }
});
});



function finalizarCompra(metodoDePagoSeleccionado) {
  const totalFinal = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0) * 0.9;

  generarTicketPDF(totalFinal);

  db.collection("compras").add({
    productos: productosEnCarrito,
    total: totalFinal,
    fecha: new Date().toISOString(),
    metodo: metodoDePagoSeleccionado
  })
  .then(() => {
    console.log("✅ Compra guardada en Firebase");

    // 🧹 Vaciar carrito
    productosEnCarrito = [];
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();

    // 🔁 Redirigir al index después de 2 segundos
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  })
  .catch(error => {
    console.error("❌ Error al guardar la compra en Firebase:", error);
  });
}








// Aplicar cupón
document.querySelector(".carrito-cupon button").addEventListener("click", () => {
  const codigo = document.querySelector(".carrito-cupon input").value.trim().toLowerCase();
  if (codigo === "kiwi10") {
    Toastify({
      text: "Cupón aplicado: -10%",
      duration: 3000,
      style: { background: "#0f5132" }
    }).showToast();
  } else {
    Toastify({
      text: "Cupón no válido",
      duration: 3000,
      style: { background: "#842029" }
    }).showToast();
  }
});
cargarProductosCarrito();

async function generarTicketPDF(totalCompra) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fecha = new Date().toLocaleString();
  const numeroTicket = Math.floor(Math.random() * 1000000);

  doc.setFontSize(16);
  doc.text("Ticket de Compra - Kiwicash", 20, 20);

  doc.setFontSize(12);
  doc.text(`Fecha: ${fecha}`, 20, 30);
  doc.text(`N° de operación: ${numeroTicket}`, 20, 40);
  doc.text("Productos comprados:", 20, 50);

  let y = 60;
  productosEnCarrito.forEach((producto, index) => {
    doc.text(
      `${index + 1}. ${producto.titulo} (x${producto.cantidad}) - S/ ${(producto.precio * producto.cantidad).toFixed(2)}`,
      20,
      y
    );
    y += 10;
  });

  y += 10;
  doc.text(`Total pagado: S/ ${totalCompra.toFixed(2)}`, 20, y);
  y += 10;
  doc.text("¡Gracias por tu compra en Kiwicash!", 20, y);

  doc.save(`Ticket_Kiwicash_${numeroTicket}.pdf`);
}
