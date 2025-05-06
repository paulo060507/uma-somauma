const chatForm = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function getResponse(question) {
    const res = await fetch("dados.json");
    const data = await res.json();

    const lowerQ = question.toLowerCase();
    if (lowerQ.includes("quem criou") || lowerQ.includes("fundador"))
        return data.criador;
    if (lowerQ.includes("equipe"))
        return data.equipe;
    if (lowerQ.includes("empreendimento"))
        return data.empreendimentos;
    if (lowerQ.includes("como chegar") || lowerQ.includes("localização"))
        return data.localizacao;
    if (lowerQ.includes("valores"))
        return data.valores;
    return data.default;
}

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;
    chatBox.innerHTML += `<div class="message user">Você: ${question}</div>`;
    userInput.value = "";
    const resposta = await getResponse(question);
    chatBox.innerHTML += `<div class="message uma">UMA: ${resposta}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});