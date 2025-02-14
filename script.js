const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
} else {
    const commandRecognition = new SpeechRecognition();
    commandRecognition.lang = 'en-US';
    commandRecognition.continuous = false;
    commandRecognition.interimResults = false;

    let knowledgeBase = {}; // This will store fetched data

    async function loadKnowledgeBase() {
        try {
            const response = await fetch('data.json'); // Load external data file
            knowledgeBase = await response.json();
            console.log("Knowledge Base Loaded:", knowledgeBase);
        } catch (error) {
            console.error("Error loading knowledge base:", error);
        }
    }

    function generateAnswer(query) {
        query = query.toLowerCase();

        // Check for predefined responses
        for (let key in knowledgeBase.responses) {
            if (query.includes(key)) {
                return knowledgeBase.responses[key][Math.floor(Math.random() * knowledgeBase.responses[key].length)];
            }
        }

        // Check for knowledge-based responses
        for (let entry of knowledgeBase.knowledge) {
            for (let keyword of entry.keywords) {
                if (query.includes(keyword)) {
                    return entry.response;
                }
            }
        }

        return "That's an interesting question! Let me think about it...";
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = synth.getVoices()[1] || synth.getVoices()[0];
        utterance.rate = 1.0;
        utterance.pitch = 1.2;

        document.getElementById("robot-img").src = "robot_talking.gif";

        synth.speak(utterance);
        document.getElementById("response-text").innerText = text;

        utterance.onend = () => {
            document.getElementById("robot-img").src = "robot_talking.gif";
        };
    }

    function startListening() {
        console.log("Listening for user command...");
        document.querySelector(".status").innerText = "Listening...";
        document.getElementById("robot-img").src = "robot_talking.gif";
        commandRecognition.start();
    }

    commandRecognition.onresult = (event) => {
        let userText = event.results[0][0].transcript.toLowerCase();
        document.querySelector(".status").innerText = "Processing...";
        console.log("User said: ", userText);

        let responseText = generateAnswer(userText);
        speak(responseText);
    };

    document.getElementById("speak-btn").addEventListener("click", () => {
        startListening();
    });

    loadKnowledgeBase(); // Load data when script runs
}
