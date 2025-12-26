document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // AUTH STATE
  // ===============================

  let currentUser = null;

  // ===============================
  // ELEMENTS
  // ===============================

  const loginForm = document.getElementById("loginForm");
  const loginScreen = document.getElementById("loginScreen");
  const mainApp = document.getElementById("mainApp");
  const userNameText = document.getElementById("userName");

  if (!loginForm) {
    console.error("loginForm bulunamadı");
    return;
  }

  // ===============================
  // LOGIN
  // ===============================

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const employeeId = document.getElementById("employeeId").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    if (!employeeId || !firstName || !lastName) {
      showLoginError("Lütfen tüm alanları doldurun.");
      return;
    }

    currentUser = {
      id: employeeId,
      firstName,
      lastName
    };

    enterApp();
  });

  // ===============================
  // ENTER APP
  // ===============================

  function enterApp() {
    loginScreen.classList.add("hidden");
    mainApp.classList.remove("hidden");

    userNameText.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  }

  // ===============================
  // LOGOUT
  // ===============================

  window.logout = function () {
    currentUser = null;
    loginForm.reset();
    loginScreen.classList.remove("hidden");
    mainApp.classList.add("hidden");
  };

  // ===============================
  // ERROR HANDLING
  // ===============================

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
