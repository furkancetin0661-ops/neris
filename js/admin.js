import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const btn = document.getElementById("addProduct");
const status = document.getElementById("status");

let editId = null;

btn.addEventListener("click", async () => {

    const ad = document.getElementById("productName").value.trim();
    const fiyat = Number(document.getElementById("productPrice").value);
    const resim = document.getElementById("productImage").value.trim();
    const bağlantı = document.getElementById("productLink").value.trim();

    const kategori =
        document.getElementById("productCategory").value;

    const açıklama =
        document.getElementById("productDescription").value.trim();

    const stok =
        Number(document.getElementById("productStock").value);

    const resim2 =
        document.getElementById("productImage2").value.trim();

    const resim3 =
        document.getElementById("productImage3").value.trim();

    const eskiFiyat =
        Number(document.getElementById("productOldPrice").value);

    const badge =
        document.getElementById("productBadge").value;

    if (
        !ad ||
        !fiyat ||
        !resim ||
        !bağlantı ||
        !kategori ||
        !açıklama ||
        !stok
    ) {

        status.innerHTML = "❌ Lütfen tüm alanları doldurun.";
        status.style.color = "red";
        return;

    }

    try {

        if (editId) {

            await updateDoc(doc(db, "Ürünler", editId), {

                reklam: ad,
                fiyat: fiyat,
                resim: resim,
                bağlantı: bağlantı,
                kategori: kategori,
                aciklama: açıklama,
                stok: stok,

                resim2: resim2,
                resim3: resim3,
                eskiFiyat: eskiFiyat,
                badge: badge

            });

            status.innerHTML = "✅ Ürün güncellendi.";

            editId = null;

            btn.textContent = "Ürünü Ekle";

        } else {

            await addDoc(collection(db, "Ürünler"), {

                reklam: ad,
                fiyat: fiyat,
                resim: resim,
                bağlantı: bağlantı,
                kategori: kategori,
                aciklama: açıklama,
                stok: stok,

                resim2: resim2,
                resim3: resim3,
                eskiFiyat: eskiFiyat,
                badge: badge

            });

            status.innerHTML = "✅ Ürün başarıyla eklendi.";

        }
                loadProducts();

        status.style.color = "lime";

        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("productLink").value = "";
        document.getElementById("productImage2").value = "";
        document.getElementById("productImage3").value = "";
        document.getElementById("productOldPrice").value = "";
        document.getElementById("productBadge").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productDescription").value = "";
        document.getElementById("productStock").value = "";

    } catch (error) {

        console.error(error);

        status.innerHTML = "❌ Hata oluştu.";
        status.style.color = "red";

    }

});

async function loadProducts() {

    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "Ürünler"));

    querySnapshot.forEach((item) => {

        const product = item.data();

        productList.innerHTML += `

        <div class="admin-product">

            <img src="${product.resim}">

            <div class="admin-product-info">

                <h3>${product.reklam}</h3>

                <p>₺${product.fiyat}</p>

                <small>${product.badge || ""}</small>

            </div>

            <div style="display:flex; gap:10px;">

                <button class="edit-btn"
                onclick="editProduct('${item.id}')">
                    ✏️ Düzenle
                </button>

                <button class="delete-btn"
                onclick="deleteProduct('${item.id}')">
                    🗑️ Sil
                </button>

            </div>

        </div>

        `;

    });

}

window.editProduct = async function(id){

    const querySnapshot = await getDocs(collection(db,"Ürünler"));

    querySnapshot.forEach((item)=>{

        if(item.id===id){

            const product=item.data();

            document.getElementById("productName").value = product.reklam;
            document.getElementById("productPrice").value = product.fiyat;
            document.getElementById("productImage").value = product.resim;
            document.getElementById("productLink").value = product.bağlantı;

            document.getElementById("productImage2").value = product.resim2 || "";
            document.getElementById("productImage3").value = product.resim3 || "";
            document.getElementById("productOldPrice").value = product.eskiFiyat || "";
            document.getElementById("productBadge").value = product.badge || "";
            document.getElementById("productCategory").value = product.kategori || "";
            document.getElementById("productDescription").value = product.aciklama || "";
            document.getElementById("productStock").value = product.stok || "";

            editId = id;

            btn.textContent = "💾 Güncelle";

        }

    });

}

window.deleteProduct = async function(id){

    if(!confirm("Bu ürünü silmek istiyor musunuz?")) return;

    await deleteDoc(doc(db,"Ürünler",id));

    loadProducts();

}

loadProducts();