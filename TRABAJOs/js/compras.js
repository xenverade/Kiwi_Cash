// ===============================
// Mostrar compras desde Firebase
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const listaCompras = document.getElementById("lista-compras");

  // Verifica que exista el contenedor y que Firestore esté inicializado
  if (listaCompras && typeof db !== "undefined") {
    db.collection("compras").orderBy("fecha", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          listaCompras.innerHTML = "<p>No hay compras registradas aún.</p>";
          return;
        }

        snapshot.forEach(doc => {
          const compra = doc.data();

          const div = document.createElement("div");
          div.style.marginBottom = "1.5rem";
          div.style.border = "1px solid #ccc";
          div.style.padding = "1rem";
          div.style.borderRadius = "8px";
          div.style.background = "#f9f9f9";

          const productosHTML = compra.productos.map(p => `
            <li>${p.titulo} x${p.cantidad} - S/ ${(p.precio * p.cantidad).toFixed(2)}</li>
          `).join("");

          div.innerHTML = `
            <h4>🕓 ${new Date(compra.fecha).toLocaleString()}</h4>
            <ul>${productosHTML}</ul>
            <p><strong>Total:</strong> S/ ${compra.total.toFixed(2)}</p>
            <p><strong>Método:</strong> ${compra.metodo}</p>
          `;

          listaCompras.appendChild(div);
        });
      })
      .catch(error => {
        console.error("Error al cargar compras:", error);
        listaCompras.innerHTML = "<p>Error al obtener compras.</p>";
      });
  }
});