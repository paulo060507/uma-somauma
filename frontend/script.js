
async function sendMessage() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chat");
    const message = input.value;
    chat.innerHTML += `<p><strong>Você:</strong> ${message}</p>`;
    input.value = "";

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    chat.innerHTML += `<p><strong>UMA:</strong> ${data.response}</p>`;
    chat.scrollTop = chat.scrollHeight;
}
