(async function () {
  const apiKey = await fetchApiKey();

  document.getElementById('chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message.length === 0) return;

    addMessageToChat('user', message);
    userInput.value = '';

    const response = await fetchChatGPTResponse(apiKey, message);
    addMessageToChat('bot', response, 'assistant'); // role을 assistant로 추가
  });

  async function fetchApiKey() {
    const response = await fetch('get_api_key.php');
    const data = await response.json();
    return data.api_key;
  }

  async function fetchChatGPTResponse(apiKey, message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a kind assistant trying to get the answer the user wants' },
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.5,
      })
    });
  
    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      console.error('Unexpected API response:', data);
      return 'Error: Unable to get response from the ChatGPT API.';
    }
  }  

  function addMessageToChat(sender, message, role) {
    const chatHistory = document.getElementById('chat-history');
    const messageElem = document.createElement('div');
    messageElem.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    if (role === 'assistant') { // role이 assistant라면 클래스 이름을 추가해줍니다.
      messageElem.classList.add('assistant-message');
    }
    messageElem.innerText = message;
    chatHistory.appendChild(messageElem);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
})();
