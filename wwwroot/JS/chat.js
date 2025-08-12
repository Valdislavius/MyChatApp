"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "/auth.html";
        return;
    }

    document.getElementById("currentUser").textContent = `Вы вошли как: ${username}`;

    const listEl = document.getElementById("messagesList");

    function addMessage(user, message, timeText) {
        const wrap = document.createElement("div");
        const isMine = user === username;
        wrap.className = "msg " + (isMine ? "out" : "in");

        const text = document.createElement("div");
        text.textContent = message;

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.innerHTML = `<span class="author">${user}</span>${timeText ? ` • ${timeText}` : ""}`;

        wrap.appendChild(text);
        wrap.appendChild(meta);

        listEl.appendChild(wrap);
        listEl.scrollTop = listEl.scrollHeight;
    }

    // Загрузка истории
    async function loadHistory() {
        try {
            const res = await fetch("/api/Messages");
            if (!res.ok) return;

            const messages = await res.json();
            listEl.innerHTML = "";
            messages.forEach(m => {
                const u = m.user?.username || m.username || "user";
                const c = m.content || m.message;
                const t = m.createdAt || m.timestamp;
                addMessage(u, c, t ? new Date(t).toLocaleTimeString() : "");
            });
        } catch (e) {
            console.error("История не загрузилась", e);
        }
    }

    // SignalR
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chathub")
        .withAutomaticReconnect()
        .build();

    connection.on("ReceiveMessage", (user, message, timestamp) => {
        addMessage(user, message, timestamp ? new Date(timestamp).toLocaleTimeString() : "");
    });

    async function start() {
        try {
            await connection.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.error(err);
            setTimeout(start, 2000);
        }
    }
    connection.onclose(start);
    start();

    // Отправка
    document.getElementById("messageForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const messageInput = document.getElementById("messageInput");
        const message = messageInput.value.trim();
        if (!message) return;
        try {
            await connection.invoke("SendMessage", username, message);
            messageInput.value = "";
        } catch (err) {
            console.error("Ошибка отправки:", err);
        }
    });

    loadHistory();
});
