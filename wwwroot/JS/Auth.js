document.addEventListener("DOMContentLoaded", () => {
    // Поиск основных блоков по заголовкам и структуре
    const findSectionByHeading = (text) => {
        const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4"));
        const h = headings.find(el => el.textContent.trim().toLowerCase().includes(text.toLowerCase()));
        return h ? h.closest("section") || h.parentElement : null;
    };

    // Пытаемся найти блоки входа/регистрации максимально гибко
    const loginSection = findSectionByHeading("Вход") || document.querySelector('[data-auth="login"]') || document.getElementById("loginSection");
    const registerSection = findSectionByHeading("Регистрация") || document.querySelector('[data-auth="register"]') || document.getElementById("registerSection");

    // Находим формы внутри этих секций
    const loginForm = loginSection ? loginSection.querySelector("form") : null;
    const registerForm = registerSection ? registerSection.querySelector("form") : null;

    // Находим ссылки-переключатели по видимому тексту
    const findLinkByText = (txt) =>
        Array.from(document.querySelectorAll("a,button"))
            .find(el => (el.textContent || "").trim().toLowerCase() === txt.toLowerCase());

    const linkToRegister = findLinkByText("Зарегистрироваться") || document.getElementById("showRegister");
    const linkToLogin = findLinkByText("Войти") || document.getElementById("showLogin");

    // Утилиты показа/скрытия (без жёсткой зависимости от класса hidden)
    const hide = (el) => { if (el) el.style.display = "none"; };
    const show = (el) => { if (el) el.style.display = ""; };

    // Изначально показываем блок входа, скрываем регистрацию (если оба найдены)
    if (loginSection && registerSection) {
        show(loginSection);
        hide(registerSection);
    }

    // Переключение
    if (linkToRegister && loginSection && registerSection) {
        linkToRegister.addEventListener("click", (e) => {
            e.preventDefault();
            hide(loginSection);
            show(registerSection);
        });
    }
    if (linkToLogin && loginSection && registerSection) {
        linkToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            hide(registerSection);
            show(loginSection);
        });
    }

    // Вспомогательная функция чтения значений username/password из формы
    const readCredentials = (form) => {
        if (!form) return { username: "", password: "" };
        // Пытаемся найти по name, затем по id, затем по type=password/text с placeholder’ом
        const u = form.querySelector('[name="username"]') ||
            form.querySelector('#username') ||
            Array.from(form.querySelectorAll('input[type="text"], input[type="email"]'))
                .find(i => /логин|имя|username|email/i.test(i.placeholder || i.ariaLabel || i.name || ""));
        const p = form.querySelector('[name="password"]') ||
            form.querySelector('#password') ||
            form.querySelector('input[type="password"]');
        return {
            username: (u && u.value ? u.value.trim() : ""),
            password: (p && p.value ? p.value.trim() : "")
        };
    };

    // Сабмит входа
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const { username, password } = readCredentials(loginForm);
            if (!username || !password) {
                alert("Введите имя пользователя и пароль");
                return;
            }
            try {
                const res = await fetch("/api/Users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });
                if (!res.ok) {
                    const msg = await safeText(res);
                    alert(msg || "Ошибка входа");
                    return;
                }
                const data = await res.json();
                localStorage.setItem("username", data.username || username);
                window.location.href = "/chat.html";
            } catch (err) {
                console.error(err);
                alert("Сетевая ошибка при входе");
            }
        });
    }

    // Сабмит регистрации
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const { username, password } = readCredentials(registerForm);
            if (!username || !password) {
                alert("Введите имя пользователя и пароль");
                return;
            }
            try {
                const res = await fetch("/api/Users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });
                if (!res.ok) {
                    const msg = await safeText(res);
                    alert(msg || "Ошибка регистрации");
                    return;
                }
                alert("Регистрация успешна! Теперь войдите.");
                // Переключаемся на форму входа
                if (linkToLogin) linkToLogin.click();
                else {
                    // если ссылки нет — покажем вход вручную
                    if (registerSection) hide(registerSection);
                    if (loginSection) show(loginSection);
                }
            } catch (err) {
                console.error(err);
                alert("Сетевая ошибка при регистрации");
            }
        });
    }

    async function safeText(res) {
        try { return await res.text(); } catch { return ""; }
    }
});
