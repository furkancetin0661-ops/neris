import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
console.log(searchInput);
console.log(categoryFilter);

async function loadProducts(){

    productContainer.innerHTML = "";
    const searchText = searchInput
    ? searchInput.value.toLowerCase()
    : "";

const selectedCategory = categoryFilter
    ? categoryFilter.value
    : "Tümü";

    const querySnapshot = await getDocs(collection(db,"Ürünler"));

    querySnapshot.forEach((doc)=>{

        console.log(doc.data());

        const product = doc.data();
        if (
    product.reklam.toLowerCase().includes(searchText) === false
) return;

if (
    selectedCategory !== "Tümü" &&
    product.kategori !== selectedCategory
) return;
console.log("Ürün ekleniyor...");
        productContainer.innerHTML += `
        
        <div class="product-card" onclick="window.location='product.html?id=${doc.id}'">
        <div class="badge">${product.badge || ""}</div>

            <img src="${product.resim}" alt="${product.reklam}">

            <div class="product-info">

                <h3 class="product-title">
                    ${product.reklam}
                </h3>

                <div class="product-price">

                    ₺${product.fiyat}

                </div>

                <div class="product-actions">

                    <button
                    class="favorite-btn">

                    ❤️ Favori

                    </button>

                    <button
class="buy-btn add-cart"
data-id="${doc.id}"
data-name="${product.reklam}"
data-price="${product.fiyat}"
data-image="${product.resim}">

Sepete Ekle

</button>

</div>

</div>

</div>

`;

});

}
console.log(productContainer.innerHTML);
loadProducts();
document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("add-cart")) return;

    const product = {
        id: e.target.dataset.id,
        name: e.target.dataset.name,
        price: Number(e.target.dataset.price),
        image: e.target.dataset.image,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(localStorage.getItem("cart"));
    updateCartCount();



    alert("Ürün sepete eklendi 🛒");

});

function updateCartCount(){

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item=>{

        total += item.quantity;

    });

    const badge = document.getElementById("cartCount");

    if(badge){

        badge.textContent = total;

    }

}

updateCartCount();
if (searchInput) {
    searchInput.addEventListener("input", loadProducts);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", loadProducts);
}