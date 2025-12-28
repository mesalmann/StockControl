document.addEventListener("DOMContentLoaded", () => {

  let currentUser = null;

  const loginForm = document.getElementById("loginForm");
  const loginScreen = document.getElementById("loginScreen");
  const mainApp = document.getElementById("mainApp");
  const userNameText = document.getElementById("userName");

  if (!loginForm) {
    console.error("loginForm bulunamadı");
    return;
  }

  const API_URL = "/api";

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeId = document.getElementById("employeeId").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    if (!employeeId || !firstName || !lastName) {
      showLoginError("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 0,
          firstName,
          lastName
        })
      });

      if (!response.ok) {
        throw new Error("Giriş başarısız.");
      }

      const user = await response.json();

      currentUser = user;
      enterApp();

      if (window.refreshProducts) {
        window.refreshProducts();
      }

    } catch (err) {
      console.error(err);
      showLoginError("Giriş yapılırken hata oluştu: " + err.message);
    }
  });

  function enterApp() {
    loginScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");

    userNameText.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  }

  window.logout = function () {
    currentUser = null;
    loginForm.reset();
    loginScreen.classList.remove("hidden");
    mainApp.classList.add("hidden");
  };

  function showLoginError(message) {
    const errorBox = document.getElementById("loginError");

    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.remove("hidden");

    setTimeout(() => {
      errorBox.classList.add("hidden");
    }, 3000);
  }

});
