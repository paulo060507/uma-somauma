document.getElementById('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const input = document.getElementById('input');
    const userText = input.value;
    input.value = '';

    const conversation = document.getElementById('conversation');
    conversation.innerHTML += '<p><strong>Você:</strong> ' + userText + '</p>';

    const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText })
    });

    const data = await response.json();
    conversation.innerHTML += '<p><strong>UMA:</strong> ' + data.answer + '</p>';
    conversation.scrollTop = conversation.scrollHeight;
});
