import { db, auth } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {

    console.error("Ürün ID bulunamadı.");

} else {

    const snap = await getDoc(doc(db, "Ürünler", id));

    if (snap.exists()) {

        const product = snap.data();

        // Ürün bilgileri
        document.getElementById("productImage").src = product.resim;
        document.getElementById("productName").textContent = product.reklam;
        document.getElementById("productBadge").textContent =
product.badge || "";
        document.getElementById("productPrice").textContent =
"₺" + product.fiyat;

if(product.eskiFiyat){

    document.getElementById("oldPrice").textContent =
    "₺" + product.eskiFiyat;

}

        document.getElementById("productCategory").textContent =
            "Kategori: " + (product.kategori || "-");

        document.getElementById("productDescription").textContent =
            product.aciklama || "Açıklama bulunmuyor.";

        // Stok
        const stockText = document.getElementById("stockText");

        if (product.stok > 0) {

            stockText.innerHTML =
                `<i class="fa-solid fa-circle-check"></i> Stokta ${product.stok} adet mevcut`;

        } else {

            stockText.innerHTML =
                `<i class="fa-solid fa-circle-xmark"></i> Tükendi`;

        }

        // Satın Al
        document.getElementById("buyNow").href = product.bağlantı;

        // Galeri
        document.getElementById("thumb1").src = product.resim;

document.getElementById("thumb2").src =
    product.resim2 || product.resim;

document.getElementById("thumb3").src =
    product.resim3 || product.resim;

        document.querySelectorAll(".thumb").forEach(img => {

            img.addEventListener("click", () => {

                document.getElementById("productImage").src = img.src;

                document.querySelectorAll(".thumb").forEach(t => {
                    t.classList.remove("active");
                });

                img.classList.add("active");

            });

        });

        // Beden seçimi
        let selectedSize = "";

        document.querySelectorAll(".sizes button").forEach(btn => {

            btn.addEventListener("click", () => {

                document.querySelectorAll(".sizes button").forEach(b => {
                    b.classList.remove("active");
                });

                btn.classList.add("active");

                selectedSize = btn.dataset.size;

            });

        });

        // Sepete ekle
        document.getElementById("addCart").addEventListener("click", () => {

            if (selectedSize === "") {

                alert("Lütfen beden seçiniz.");

                return;

            }

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(item =>
                item.id === id && item.size === selectedSize
            );

            if (existing) {

                existing.quantity++;

            } else {

                cart.push({

                    id: id,
                    name: product.reklam,
                    price: product.fiyat,
                    image: product.resim,
                    size: selectedSize,
                    quantity: 1

                });

            }

            localStorage.setItem("cart", JSON.stringify(cart));
            console.log(cart);
            updateCartCount();
            alert("Ürün sepete eklendi 🛒");

        });

    } else {

        console.log("Ürün bulunamadı.");

    }

}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    const badge = document.getElementById("cartCount");

    if (badge) {
        badge.textContent = total;
    }
}

updateCartCount();
