async function loadProducts() {
  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = products
    .map(
      (p) => `
    <div class="product">
      <img src="${p.image_url}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Agregar</button>
    </div>
  `
    )
    .join("");
}

loadProducts();
