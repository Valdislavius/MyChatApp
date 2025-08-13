// Адрес API — теперь всегда совпадает с адресом, откуда загружена страница
const API_BASE = window.location.origin;

const API_MESSAGES = `${API_BASE}/api/Message`;
const API_CURRENT_USER = `${API_BASE}/api/Users/current`;
const CHAT_HUB = `${API_BASE}/chathub`;

const messagesList = document.getElementById("messagesList");
const currentUserEl = document.getElementById("currentUser");
const messageInput = document.getElementById("messageInput");
const messageForm = document.getElementById("messageForm");
const logoutBtn = document.getElementById("logoutBtn");

const connection = new signalR.HubConnectionBuilder()
    .withUrl(CHAT_HUB)
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Получаем текущее имя пользователя
async function loadCurrentUser() {
    try {
        const res = await fetch(API_CURRENT_USER, { credentials: "include" });
        if (res.ok) {
            const data = await res.json();
            if (data.userName) {
                currentUserEl.textContent = data.userName;
            }
        } else {
            console.warn("⚠ Не удалось получить имя пользователя:", res.status);
        }
    } catch (err) {
        console.error("❌ Ошибка при получении имени:", err);
    }
}

// Проверка: прокрутка до низа
function isUserAtBottom() {
    const threshold = 50;
    return messagesList.scrollHeight - messagesList.scrollTop - messagesList.clientHeight < threshold;
}

function scrollToBottom() {
    messagesList.scrollTop = messagesList.scrollHeight;
}

function appendMessage(user, message, timestamp, scrollCheck = true) {
    const isMine = user === currentUserEl.textContent.trim();
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", isMine ? "out" : "in");
    const timeStr = timestamp
        ? new Date(timestamp).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    msgDiv.innerHTML = `
        <span class="user">${user}</span>
        <span class="text">${message || ""}</span>
        <span class="time">${timeStr}</span>
    `;
    const shouldScroll = !scrollCheck || isUserAtBottom();
    messagesList.appendChild(msgDiv);
    if (shouldScroll) {
        scrollToBottom();
    }
}

async function loadHistory() {
    try {
        const res = await fetch(API_MESSAGES, {
            method: "GET",
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
            credentials: "include"
        });
        if (!res.ok) {
            console.error(`Ошибка загрузки истории: ${res.status}`);
            return;
        }
        let data = await res.json();
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        messagesList.innerHTML = "";
        data.forEach(msg => appendMessage(msg.userName, msg.content, msg.timestamp, false));

        [0, 50, 150, 300].forEach(delay => setTimeout(scrollToBottom, delay));
    } catch (err) {
        console.error("❌ История не загрузилась:", err);
    }
}

async function sendMessage() {
    const user = currentUserEl?.textContent?.trim();
    const message = messageInput.value.trim();
    if (!message || !user) return;
    try {
        await connection.invoke("SendMessage", user, message);
        messageInput.value = "";
    } catch (err) {
        console.error("❌ Ошибка отправки:", err);
    }
}

connection.on("ReceiveMessage", (user, message, timestamp) => {
    appendMessage(user, message, timestamp, true);
});

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    sendMessage();
});

logoutBtn.addEventListener("click", () => {
    window.location.href = "/auth.html";
});

async function start() {
    try {
        await loadCurrentUser();
        await connection.start();
        await loadHistory();
    } catch (err) {
        console.error("❌ Ошибка подключения:", err);
        setTimeout(start, 5000);
    }
}
start();
