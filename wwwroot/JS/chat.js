const API_BASE = "https://localhost:7128";

const API_MESSAGES = `${API_BASE}/api/Message`;
const API_CURRENT_USER = `${API_BASE}/api/Users/current`; // правильный маршрут
const CHAT_HUB = `${API_BASE}/chathub`;

const messagesList = document.getElementById("messagesList");
const currentUserEl = document.getElementById("currentUser");
const messageInput = document.getElementById("messageInput");
const messageForm = document.getElementById("messageForm");

if (!messagesList || !currentUserEl || !messageInput || !messageForm) {
    console.error("❌ Не найдены необходимые элементы DOM (chat.html)");
}

// Подключение к SignalR
const connection = new signalR.HubConnectionBuilder()
    .withUrl(CHAT_HUB)
    .configureLogging(signalR.LogLevel.Information)
    .build();

// --- Получение имени пользователя ---
async function loadCurrentUser() {
    try {
        const res = await fetch(API_CURRENT_USER, { credentials: "include" });
        if (res.ok) {
            const data = await res.json();
            if (data.userName) {
                currentUserEl.textContent = data.userName;
                console.log("Текущий пользователь:", data.userName);
            } else {
                console.warn("⚠ Сервер вернул пустое имя пользователя");
            }
        } else {
            console.warn("⚠ Не удалось получить имя пользователя:", res.status);
        }
    } catch (err) {
        console.error("❌ Ошибка при загрузке имени пользователя:", err);
    }
}

// --- Загрузка истории сообщений ---
async function loadHistory() {
    try {
        const res = await fetch(API_MESSAGES, {
            method: "GET",
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
            credentials: "include"
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`Ошибка загрузки истории: HTTP ${res.status}`, text);
            return;
        }

        let data = await res.json();

        // сортируем от старых к новым
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        messagesList.innerHTML = "";
        data.forEach(msg => appendMessage(msg.userName, msg.content, msg.timestamp));
    } catch (err) {
        console.error("❌ История не загрузилась:", err);
    }
}

// --- Отрисовка одного сообщения ---
function appendMessage(user, message, timestamp) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");

    const time = timestamp
        ? new Date(timestamp).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
        : "";

    msgDiv.innerHTML = `
        <span class="time">${time}</span>
        <span class="user">${user || "??"}</span>:
        <span class="text">${message || ""}</span>
    `;

    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
}

// --- Отправка нового сообщения ---
async function sendMessage() {
    const user = currentUserEl?.textContent?.trim();
    const message = messageInput.value.trim();
    if (!message || !user) return;

    try {
        await connection.invoke("SendMessage", user, message);
        messageInput.value = "";
    } catch (err) {
        console.error("❌ Ошибка при отправке сообщения:", err);
    }
}

// --- Приём сообщений от SignalR ---
connection.on("ReceiveMessage", (user, message, timestamp) => {
    appendMessage(user, message, timestamp);
});

// --- Обработка отправки формы ---
messageForm.addEventListener("submit", e => {
    e.preventDefault();
    sendMessage();
});

// --- Старт приложения ---
async function start() {
    try {
        await loadCurrentUser();        // получаем имя пользователя с бэка
        await connection.start();       // подключаем SignalR
        console.log("✅ SignalR Connected.");
        await loadHistory();            // загружаем историю
    } catch (err) {
        console.error("❌ Ошибка подключения SignalR:", err);
        setTimeout(start, 5000);
    }
}

start();
