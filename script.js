const startBtn = document.getElementById('start-btn');
const statusText = document.getElementById('status');
const userText = document.getElementById('user-text');
const jarvisText = document.getElementById('jarvis-text');
const apiKeyInput = document.getElementById('api-key');
const saveKeyBtn = document.getElementById('save-key');

let apiKey = localStorage.getItem('jarvis_gemini_key') || '';

if (apiKey) {
    apiKeyInput.value = '••••••••••••••••••••';
    statusText.innerText = 'Status: Systems Operational';
}

saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key && key !== '••••••••••••••••••••') {
        localStorage.setItem('jarvis_gemini_key', key);
        apiKey = key;
        statusText.innerText = 'Status: Core Initialized';
        alert('API Key loaded successfully.');
    }
});

// Speech Recognition Config
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    statusText.innerText = 'Status: Speech API Unsupported';
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    startBtn.addEventListener('click', () => {
        if (!apiKey) {
            alert('Please input your Gemini API Key to wake up JARVIS.');
            return;
        }
        recognition.start();
    });

    recognition.onstart = () => {
        statusText.innerText = 'Status: Listening...';
        startBtn.classList.add('listening');
    };

    recognition.onresult = async (event) => {
        startBtn.classList.remove('listening');
        const command = event.results[0][0].transcript;
        userText.innerText = command;
        statusText.innerText = 'Status: Processing Matrix...';

        const reply = await askAI(command);
        jarvisText.innerText = reply;
        speak(reply);
    };

    recognition.onerror = () => {
        startBtn.classList.remove('listening');
        statusText.innerText = 'Status: Input Error';
    };

    recognition.onend = () => {
        startBtn.classList.remove('listening');
    };
}

// REST Call to Gemini
async function askAI(prompt) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are JARVIS, Tony Stark's sophisticated, highly intelligent, and slightly sarcastic British AI assistant. Answer the user prompt directly, conversationally, and keep it brief (maximum 2 sentences) so it sounds natural when spoken aloud. User says: "${prompt}"` }]
                }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error(error);
        return "Apologies Sir, I am having trouble reaching my central databanks.";
    }
}

// Text to Speech
function speak(text) {
    statusText.innerText = 'Status: Responding...';
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to match an English (UK) voice for standard JARVIS persona
    const voices = window.speechSynthesis.getVoices();
    const jarvisVoice = voices.find(v => v.lang.includes('en-GB') && v.name.toLowerCase().includes('male')) ||
                        voices.find(v => v.lang.includes('en-GB')) || 
                        voices[0];
    
    if (jarvisVoice) utterance.voice = jarvisVoice;
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onend = () => {
        statusText.innerText = 'Status: Systems Operational';
    };
    
    window.speechSynthesis.speak(utterance);
}

// Trigger voice pre-loading for Chrome compatibility
window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };