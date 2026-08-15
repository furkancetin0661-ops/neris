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

        const productImage = document.getElementById("productImage");
        const thumb1 = document.getElementById("thumb1");
        const thumb2 = document.getElementById("thumb2");
        const thumb3 = document.getElementById("thumb3");

        // --------------------------------
        // GÖRSELLER
        // --------------------------------

        const images = [
            product.resim,
            product.resim2 || product.resim,
            product.resim3 || product.resim
        ];

        // Görselleri önceden yükle
        images.forEach(src => {
            if (src) {
                const preload = new Image();
                preload.src = src;
            }
        });

        // Ana görsel
        productImage.src = images[0];

        // Ürün bilgileri
        document.getElementById("productName").textContent =
            product.reklam || "";

        document.getElementById("productBadge").textContent =
            product.badge || "";

        document.getElementById("productPrice").textContent =
            "₺" + product.fiyat;

        if (product.eskiFiyat) {

            document.getElementById("oldPrice").textContent =
                "₺" + product.eskiFiyat;

        }

        document.getElementById("productCategory").textContent =
            "Kategori: " + (product.kategori || "-");

        document.getElementById("productDescription").textContent =
            product.aciklama || "Açıklama bulunmuyor.";

        // --------------------------------
        // STOK
        // --------------------------------

        const stockText = document.getElementById("stockText");

        if (product.stok > 0) {

            stockText.innerHTML =
                `<i class="fa-solid fa-circle-check"></i> Stokta ${product.stok} adet mevcut`;

        } else {

            stockText.innerHTML =
                `<i class="fa-solid fa-circle-xmark"></i> Tükendi`;

        }

        // --------------------------------
        // SATIN AL
        // --------------------------------

        document.getElementById("buyNow").href =
            product.bağlantı || "#";

        // --------------------------------
        // GALERİ
        // --------------------------------

        thumb1.src = images[0];
        thumb2.src = images[1];
        thumb3.src = images[2];

        const thumbs = document.querySelectorAll(".thumb");

        function changeImage(src, activeThumb) {

            if (!src) return;

            // Görseli anında değiştir
            productImage.src = src;

            thumbs.forEach(t => {
                t.classList.remove("active");
            });

            if (activeThumb) {
                activeThumb.classList.add("active");
            }
        }

        thumbs.forEach((img) => {

            img.addEventListener("click", () => {

                changeImage(img.src, img);

            });

        });

        // --------------------------------
        // BEDEN
        // --------------------------------

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

        // --------------------------------
        // SEPETE EKLE
        // --------------------------------

        document.getElementById("addCart").addEventListener("click", () => {

            if (selectedSize === "") {

                alert("Lütfen beden seçiniz.");

                return;

            }

            let cart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(item =>
                item.id === id &&
                item.size === selectedSize
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

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            updateCartCount();

            alert("Ürün sepete eklendi 🛒");

        });

    } else {

        console.log("Ürün bulunamadı.");

    }

}


// --------------------------------
// SEPET SAYISI
// --------------------------------

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    const badge =
        document.getElementById("cartCount");

    if (badge) {
        badge.textContent = total;
    }

}

updateCartCount();
