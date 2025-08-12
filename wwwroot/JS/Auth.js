document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const linkToRegister = document.getElementById("showRegister");
    const linkToLogin = document.getElementById("showLogin");

    const hide = (el) => el && (el.style.display = "none");
    const show = (el) => el && (el.style.display = "");

    // Стартовое состояние
    if (loginSection && registerSection) {
        show(loginSection);
        hide(registerSection);
    }

    // Переключатели форм
    linkToRegister?.addEventListener("click", (e) => {
        e.preventDefault();
        hide(loginSection);
        show(registerSection);
    });

    linkToLogin?.addEventListener("click", (e) => {
        e.preventDefault();
        hide(registerSection);
        show(loginSection);
    });

    const readCreds = (form) => {
        const u = form?.querySelector('[name="username"]')?.value.trim();
        const p = form?.querySelector('[name="password"]')?.value.trim();
        return { username: u || "", password: p || "" };
    };

    // Обработка логина
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { username, password } = readCreds(loginForm);
        if (!username || !password) return alert("Введите имя пользователя и пароль");

        try {
            const res = await fetch("/api/Users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) return alert(await res.text() || "Ошибка входа");

            const data = await res.json();
            localStorage.setItem("username", data.username || username);
            window.location.href = "/chat.html";
        } catch {
            alert("Сетевая ошибка при входе");
        }
    });

    // Обработка регистрации
    registerForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { username, password } = readCreds(registerForm);
        if (!username || !password) return alert("Введите имя пользователя и пароль");

        try {
            const res = await fetch("/api/Users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) return alert(await res.text() || "Ошибка регистрации");

            alert("Регистрация успешна! Теперь войдите.");
            linkToLogin?.click();
        } catch {
            alert("Сетевая ошибка при регистрации");
        }
    });
});
