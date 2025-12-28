let products = [];
let isLoading = false;

const productForm = document.getElementById("addProductForm");
const productList = document.getElementById("productsContainer");
const totalProductsEl = document.getElementById("totalProducts");
const lowStockEl = document.getElementById("lowStockCount");

const API_URL = "/api";

productForm.addEventListener("submit", async (e) => {
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
    name,
    category,
    stock,
    minStock
  };

  try {
    isLoading = true;
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    if (!response.ok) throw new Error("Ürün eklenemedi");

    await fetchProducts();
    productForm.reset();
    showMessage("addMessage", "Ürün eklendi.");

  } catch (err) {
    console.error(err);
    showMessage("addMessage", "Hata: " + err.message, true);
  } finally {
    isLoading = false;
  }
});

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    products = await res.json();
    renderProducts();
    updateStats();
  } catch (err) {
    console.error("Failed to fetch products", err);
  }
}

window.refreshProducts = fetchProducts;

function renderProducts() {
  renderTable(products);
}

function renderTable(data) {
  if (data.length === 0) {
    productList.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-gray" style="padding: 2rem;">
          Ürün bulunamadı
        </td>
      </tr>
    `;
    return;
  }

  productList.innerHTML = data.map(p => {
    const isLow = p.stock <= p.minStock;
    const stockClass = isLow ? "badge badge-red" : "badge badge-green";
    const stockText = isLow ? "Kritik" : "İyi";

    return `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${p.stock}</td>
        <td>${p.minStock}</td>
        <td><span class="${stockClass}">${stockText}</span></td>
        <td>
          <button class="btn-sm btn-delete" onclick="deleteProduct('${p.id}')">Sil</button>
        </td>
      </tr>
    `;
  }).join("");
}

async function deleteProduct(id) {
  if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Silinemedi");
    await fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Silme başarısız: " + err.message);
  }
}
window.deleteProduct = deleteProduct;

function updateStats() {
  totalProductsEl.textContent = products.length;

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  lowStockEl.textContent = lowStockCount;
}

function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = isError ? "text-red mt-2" : "text-green mt-2";

  setTimeout(() => {
    el.textContent = "";
  }, 2500);
}
