document.getElementById('chat-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const msg = input.value.trim();
  if (!msg) return;

  const box = document.getElementById('chat-box');
  box.innerHTML += `<p><strong>Você:</strong> ${msg}</p>`;
  input.value = '';

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  box.innerHTML += `<p><strong>UMA:</strong> ${data.message}</p>`;
  box.scrollTop = box.scrollHeight;
});