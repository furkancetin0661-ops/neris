const USERNAME = "admin";
const PASSWORD = "Neris2026!";

const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.addEventListener("click", () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if(username === USERNAME && password === PASSWORD){

        sessionStorage.setItem("adminLoggedIn","true");

        window.location.href = "admin.html";

    }else{

        error.textContent = "Kullanıcı adı veya şifre hatalı.";

    }

});