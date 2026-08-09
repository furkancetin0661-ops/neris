function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItems = document.getElementById("cartItems");
    const araToplamEl = document.getElementById("araToplam");
    const genelToplamEl = document.getElementById("genelToplam");
    const kargoEl = document.getElementById("kargo");

    cartItems.innerHTML = "";

    let toplam = 0;

    cart.forEach(item => {
        toplam += item.price * item.quantity;

        cartItems.innerHTML += `
            <div>
                <h4>${item.name}</h4>
                <p>${item.price}₺ x ${item.quantity}</p>
            </div>
        `;
    });

    // 🚚 KARGO HESABI
    let kargo = 0;

    if (toplam > 0 && toplam < 3000) {
        kargo = 100;
    }

    // 💰 EKRANA YAZ
    araToplamEl.innerText = toplam + "₺";
    genelToplamEl.innerText = (toplam + kargo) + "₺";

    if (kargo === 0 && toplam > 0) {
        kargoEl.innerText = "Ücretsiz";
    } else {
        kargoEl.innerText = kargo + "₺";
    }
}

// SAYFA AÇILINCA
renderCart();


// 🔥 BUTON (DÜZELTİLMİŞ)
document.getElementById("checkoutBtn").addEventListener("click", () => {
    window.location.href = "odeme.html";
});
