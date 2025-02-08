let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("robot-container").appendChild(renderer.domElement);

scene.background = new THREE.Color(0x000000);

let ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let loader = new THREE.GLTFLoader();
let robot;
loader.load("https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb", function(gltf) {
    robot = gltf.scene;
    robot.scale.set(3, 3, 3);
    robot.position.y = -1;
    scene.add(robot);
    animate();
}, undefined, function(error) {
    console.error("Error loading the 3D model", error);
});

camera.position.set(0, 1.5, 5);

function animate() {
    requestAnimationFrame(animate);
    if (robot) robot.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();

async function startListening() {
    const recognizer = await speechCommands.create("BROWSER_FFT");
    await recognizer.ensureModelLoaded();
    recognizer.listen(result => {
        let words = recognizer.wordLabels();
        let highestScoreIndex = result.scores.indexOf(Math.max(...result.scores));
        let spokenWord = words[highestScoreIndex];
        let response = generateResponse(spokenWord);
        speak(response);
        moveRobot(spokenWord);
    }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.75
    });
}

document.getElementById("textInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleTextInput();
    }
});

function handleTextInput() {
    let inputText = document.getElementById("textInput").value;
    if (inputText.trim() !== "") {
        let response = generateResponse(inputText.toLowerCase());
        speak(response);
        moveRobot(inputText.toLowerCase());
        document.getElementById("textInput").value = "";
    }
}

function generateResponse(input) {
    let responses = {
        "hello": "Hello! How can I assist you today?",
        "how are you": "I am always at my best, ready to help!",
        "your name": "I am RoboAI, your intelligent assistant!",
        "tell me a joke": "Why did the robot go to therapy? It had too many circuits crossed!",
        "goodbye": "Goodbye! Have a fantastic day!",
        "who created you": "I was created by Manju, the innovator!",
        "what can you do": "I can chat, listen, and interact with you in real time!"
    };
    return responses[input] || "I am still learning. Can you rephrase that?";
}

function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function moveRobot(command) {
    if (!robot) return;
    if (command.includes("wave")) {
        robot.rotation.y += Math.PI / 4;
    } else if (command.includes("jump")) {
        let initialY = robot.position.y;
        let up = true;
        let jumpInterval = setInterval(() => {
            robot.position.y += up ? 0.1 : -0.1;
            if (robot.position.y >= initialY + 1) up = false;
            if (robot.position.y <= initialY) clearInterval(jumpInterval);
        }, 50);
    } else if (command.includes("spin")) {
        let spinCount = 0;
        let spinInterval = setInterval(() => {
            robot.rotation.y += 0.1;
            spinCount += 1;
            if (spinCount >= 62) clearInterval(spinInterval);
        }, 10);
    }
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
