document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    // Показываем логин по умолчанию
    loginSection.classList.add("active");

    function switchForm(fromEl, toEl) {
        fromEl.classList.remove("active");
        fromEl.classList.add("slide-out-left");
        toEl.classList.add("active", "slide-in-right");
<<<<<<< HEAD
=======

>>>>>>> 31f9c2340cab12ffbb395bb36971f1ae3002f914
        setTimeout(() => {
            fromEl.classList.remove("slide-out-left");
            toEl.classList.remove("slide-in-right");
        }, 500);
    }

    showRegister?.addEventListener("click", e => {
        e.preventDefault();
        switchForm(loginSection, registerSection);
    });

    showLogin?.addEventListener("click", e => {
        e.preventDefault();
        switchForm(registerSection, loginSection);
    });

    const readCreds = form => ({
        username: form.querySelector('[name="username"]').value.trim(),
        password: form.querySelector('[name="password"]').value.trim()
    });

    loginForm?.addEventListener("submit", async e => {
        e.preventDefault();
        const { username, password } = readCreds(loginForm);
        if (!username || !password) return alert("Введите имя пользователя и пароль");
        try {
            const res = await fetch("/api/Users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });
            if (!res.ok) return alert(await res.text() || "Ошибка входа");
            window.location.href = "/chat.html";
        } catch {
            alert("Сетевая ошибка при входе");
        }
    });

    registerForm?.addEventListener("submit", async e => {
        e.preventDefault();
        const { username, password } = readCreds(registerForm);
        if (!username || !password) return alert("Введите имя пользователя и пароль");
        try {
            const res = await fetch("/api/Users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });
            if (!res.ok) return alert(await res.text() || "Ошибка регистрации");
            alert("Регистрация успешна! Теперь войдите.");
            switchForm(registerSection, loginSection);
        } catch {
            alert("Сетевая ошибка при регистрации");
        }
    });
});
