
document.getElementById('chat-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<p><strong>Você:</strong> ${userInput}</p>`;
    document.getElementById('user-input').value = '';

    const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
    });
    const data = await res.json();
    chatBox.innerHTML += `<p><strong>UMA:</strong> ${data.response}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});
