// script.js

// Check if Speech Recognition is available
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    // Smart AI Responses with Variations
    const responses = {
        "hi": ["Hello! How can I assist you?", "Hey there! What do you need?", "Hi! Ready to help."],
        "hello": ["Hello! How can I assist you?", "Hey there! What do you need?", "Hi! Ready to help."],
        "who are you": ["I am Nova, your AI assistant!", "I am a virtual AI created to help you.", "Just a friendly AI ready to assist!"],
        "what is your name": ["I am Manju, your A.I assistant.", "You can call me Manju A.I.", "I am Manju A.I, your digital helper!"],
        "how are you": ["I'm great! How about you?", "I'm always operating at peak efficiency!", "I'm just a program, but I'm doing well!"],
        "what can you do": ["I can answer science and math questions, you can ask me!", "I can help you with science knowledge", "I'm here to assist with whatever you need."],
        "thank you": ["You're welcome!", "Happy to help!", "Anytime!"],
        "goodbye": ["Goodbye! Have a great day!", "See you later!", "Take care!"],
        "who created you": ["I am created by Manju", "I am created by a Manju ,a student"]
        };

    // Function to handle speech output
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = synth.getVoices()[1] || synth.getVoices()[0]; // Choose a better voice if available
        utterance.rate = 1.0;
        utterance.pitch = 1.2;

        // Change robot image to talking mode
        document.getElementById("robot-img").src = "robot_talking.gif";

        synth.speak(utterance);
        document.getElementById("response-text").innerText = text; // Display response

        utterance.onend = () => {
            // Revert back to idle image after speaking
            document.getElementById("robot-img").src = "robot_talking.gif";
        };
    }

    // Function to get random response
    function getRandomResponse(key) {
        if (responses[key]) {
            let variations = responses[key];
            return variations[Math.floor(Math.random() * variations.length)];
        }
        return "I'm sorry, I don't understand that.";
    }

    // Start recognition when button is clicked
    document.getElementById("speak-btn").addEventListener("click", () => {
        recognition.start();
        document.querySelector(".status").innerText = "Listening...";
        document.getElementById("robot-img").src = "robot_talking.gif"; // Change to listening image
    });

    // Process recognized speech
    recognition.onresult = (event) => {
        let userText = event.results[0][0].transcript.toLowerCase();
        document.querySelector(".status").innerText = "Processing...";
        console.log("User said: ", userText);

        let responseText = "I'm sorry, I don't understand that.";
        for (let key in responses) {
            if (userText.includes(key)) {
                responseText = getRandomResponse(key);
                break;
            }
        }

        speak(responseText);
        document.querySelector(".status").innerText = "Listening...";
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        document.querySelector(".status").innerText = "Error. Try again.";
    };
}
