// ===============================
// STATE
// ===============================

let products = [];
let isLoading = false;

// ===============================
// ELEMENTS
// ===============================

const productForm = document.getElementById("addProductForm");
const productList = document.getElementById("productsContainer");
const totalProductsEl = document.getElementById("totalProducts");
const lowStockEl = document.getElementById("lowStockCount");

// ===============================
// ADD PRODUCT
// ===============================

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isLoading) return;

  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("category").value.trim();
  const stock = parseInt(document.getElementById("stockQuantity").value);
  const minStock = parseInt(document.getElementById("minStockLevel").value);

  if (!name || !category || isNaN(stock) || isNaN(minStock)) {
    showMessage("addMessage", "Tüm alanları doldur.", true);
    return;
  }

  const newProduct = {
    id: crypto.randomUUID(),
    name,
    category,
    stock,
    minStock
  };

  products.push(newProduct);
  renderProducts();
  updateStats();

  productForm.reset();
  showMessage("addMessage", "Ürün eklendi.");
});

// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts() {
  if (products.length === 0) {
    productList.innerHTML = `
      <div class="text-center text-gray">
        Henüz ürün eklenmedi
      </div>
    `;
    return;
  }

  productList.innerHTML = products.map(p => {
    const low = p.stock <= p.minStock;

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="flex justify-between">
          <div>
            <div class="product-title">${p.name}</div>
            <div class="product-meta">${p.category}</div>
          </div>

          <div>
            <button class="secondary" onclick="deleteProduct('${p.id}')">
              Sil
            </button>
          </div>
        </div>

        <div class="mt-2">
          <span>Stok: </span>
          <span class="${low ? "low-stock" : "good-stock"}">
            ${p.stock}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

// ===============================
// DELETE PRODUCT
// ===============================

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  renderProducts();
  updateStats();
}

// ===============================
// STATS
// ===============================

function updateStats() {
  totalProductsEl.textContent = products.length;

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  lowStockEl.textContent = lowStockCount;
}

// ===============================
// MESSAGE
// ===============================

function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = isError ? "text-red mt-2" : "text-green mt-2";

  setTimeout(() => {
    el.textContent = "";
  }, 2500);
}
