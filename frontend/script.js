async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = userInput.value;

    if (!message.trim()) return;

    chatBox.innerHTML += `<p><strong>Você:</strong> ${message}</p>`;
    userInput.value = '';

    const response = await fetch('http://localhost:10000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
    });

    const data = await response.json();
    chatBox.innerHTML += `<p><strong>UMA:</strong> ${data.answer}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}