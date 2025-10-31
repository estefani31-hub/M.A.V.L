// =======================================
// Archivo: script.js                      
// Lógica de Autenticación, Animaciones y Galería
// =======================================

// --- A. DEFINICIÓN DE CONSTANTES Y ELEMENTOS ---
const CORRECT_PASSCODE = "piojito";
const lockScreen = document.getElementById('protocol-lock');
const unlockScreen = document.getElementById('protocol-unlocked');
const diagnosticsButton = document.getElementById('run-diagnostics');
const passcodeField = document.getElementById('passcode');
const errorMessage = document.getElementById('error-message');
const loveSong = document.getElementById('love-song');
const photoArea = document.getElementById('photo-area');
const canvas = document.getElementById('love-canvas');
const ctx = canvas.getContext('2d');
const memoryGrid = document.getElementById('memory-grid');

// Definición de las 12 memorias (Ajusta las descripciones y archivos)
const memoryBank = [
    { file: "1.jpg", log: "LOG_001: Nos miramos peor es nada." },
    { file: "2.png", log: "LOG_002: Se vé bien mamacita rica en esta foto." }, // Asegura que este archivo es .png
    { file: "3.jpg", log: "LOG_003: Mi anillo de matrimonio, enana?." },
    { file: "4.jpg", log: "LOG_004: Cara de que hizo bien su trabajo." },
    { file: "5.jpg", log: "LOG_005: Mira con deseo jajaja." },
    { file: "6.jpg", log: "LOG_006: Mamacitas ricas." },
    { file: "7.jpg", log: "LOG_007: La voy a colgar, enana." },
    { file: "8.jpg", log: "LOG_008: Cara de que necesitamos cervezas." },
    { file: "9.jpg", log: "LOG_009: Rica, ni en mil vidas encontraía a alguien como yo 😏." },
    { file: "10.jpg", log: "LOG_010: No la culpo por querer volver conmigo ajja." },
    { file: "11.jpg", log: "LOG_011: Cara de que quería hacer otra cosa, no ir a la velada." },
    { file: "12.jpg", log: "LOG_012: Cosa rica, cosa bien hecha, cosa hecha con amor. (la mirada con deseo)." },
];


// --- B. LÓGICA DE AUTENTICACIÓN (LOGIN) ---
diagnosticsButton.addEventListener('click', () => {
    if (passcodeField.value.trim().toLowerCase() === CORRECT_PASSCODE) {
        // ACCESO CONCEDIDO
        lockScreen.classList.add('hidden');
        unlockScreen.classList.remove('hidden'); 
        
        // Cargar las unidades de memoria
        loadMemoryGrid();

    } else {
        // ACCESO DENEGADO
        errorMessage.classList.remove('hidden');
        passcodeField.classList.add('input-error');
        
        setTimeout(() => {
            passcodeField.classList.remove('input-error');
            errorMessage.classList.add('hidden');
        }, 2000);
    }
});

passcodeField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        diagnosticsButton.click();
    }
});


// --- C. LÓGICA DE ANIMACIÓN LOVE_BOMB (ON_CLICK) ---
let particles = [];
const loveMessages = ["TE AMO", "SIEMPRE TE ELIJO A TI", "ERES MI KERNEL"];

class Particle {
    constructor(x, y, message) {
        this.x = x; this.y = y; this.vx = (Math.random() - 0.5) * 6; this.vy = (Math.random() - 0.5) * 6;
        this.alpha = 1; this.message = message;
        this.color = '#00FFFF'; // Color neón
        this.isText = isNaN(this.message);
        this.glitchOffset = Math.random() * 5; this.glitchSpeed = Math.random() * 0.1;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.alpha -= 0.02;
    }
    draw() {
        ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
        if (this.isText) {
            const offsetX = Math.sin(Date.now() * this.glitchSpeed) * this.glitchOffset;
            const offsetY = Math.cos(Date.now() * this.glitchSpeed) * this.glitchOffset;
            ctx.font = 'bold 24px Consolas';
            ctx.fillText(this.message, this.x + offsetX, this.y + offsetY);
        } else {
            ctx.font = '12px Consolas';
            ctx.fillText(this.message, this.x, this.y);
        }
        ctx.globalAlpha = 1;
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0.05) { particles.splice(i, 1); }
    }
    if (particles.length > 0) { requestAnimationFrame(animate); }
}

function createLoveBomb(e) {
    canvas.width = photoArea.clientWidth; canvas.height = photoArea.clientHeight;
    const centerX = canvas.width / 2; const centerY = canvas.height / 2;
    
    // 1. Crear el torrente Binario
    for (let i = 0; i < 300; i++) {
        const message = Math.random() > 0.5 ? 1 : 0; 
        particles.push(new Particle(centerX, centerY, message));
    }

    // 2. Crear las frases "TE AMO"
    for (let i = 0; i < 7; i++) {
        const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        particles.push(new Particle(centerX, centerY, message));
    }

    animate();
}

photoArea.addEventListener('click', createLoveBomb);


// --- D. LÓGICA DE GALERÍA (MEMORY CORE) ---
function loadMemoryGrid() {
    memoryGrid.innerHTML = ''; 
    memoryBank.forEach((item, index) => {
        const dataUnit = document.createElement('div');
        dataUnit.className = 'data-unit relative aspect-square border border-gray-700 hover:border-neon-cian transition-all duration-300 overflow-hidden group cursor-pointer'; 
        
        // Abre la segunda página con los datos de la foto
        dataUnit.addEventListener('click', () => {
            const params = new URLSearchParams();
            params.append('file', item.file);
            params.append('log', item.log);
            window.location.href = `memory_hack.html?${params.toString()}`;
        });

        const img = document.createElement('img');
        img.src = item.file;
        img.alt = `Archivo de memoria ${index + 1}`;
        img.className = 'w-full h-full object-cover transition-opacity duration-500 opacity-20 group-hover:opacity-100'; 

        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-sm neon-cian p-2 opacity-100 group-hover:opacity-0 transition-opacity duration-500 glitch-text';
        overlay.innerHTML = `FILE_${index + 1}.${item.file.split('.').pop()}<br/>[STATUS: OFFLINE]`; 

        const logTooltip = document.createElement('div');
        logTooltip.className = 'absolute bottom-0 left-0 w-full bg-neon-cian text-black font-bold text-xs text-center p-1 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300';
        logTooltip.textContent = item.log; 

        dataUnit.append(img, overlay, logTooltip);
        memoryGrid.appendChild(dataUnit);
    });
}


// --- E. ANIMACIÓN DE FONDO (NETWORK FLOW) ---
const bgCanvas = document.getElementById('background-canvas');
const bgCtx = bgCanvas.getContext('2d');

let particlesBg = [];
const PARTICLE_COUNT = 50; 

function initBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    particlesBg = []; 
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesBg.push({
            x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.5 + 1, color: '#00FFFF' 
        });
    }
}

function drawBackground() {
    bgCtx.fillStyle = 'rgba(0, 0, 0, 1)'; 
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    for (let i = 0; i < particlesBg.length; i++) {
        let p = particlesBg[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > bgCanvas.width) p.x = (p.x < 0) ? bgCanvas.width : 0;
        if (p.y < 0 || p.y > bgCanvas.height) p.y = (p.y < 0) ? bgCanvas.height : 0;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        bgCtx.fillStyle = p.color; bgCtx.fill();

        for (let j = i + 1; j < particlesBg.length; j++) {
            let p2 = particlesBg[j];
            let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));

            if (dist < 100) {
                bgCtx.beginPath();
                bgCtx.strokeStyle = 'rgba(0, 255, 255, ' + (1 - dist / 100) + ')';
                bgCtx.lineWidth = 0.5;
                bgCtx.moveTo(p.x, p.y);
                bgCtx.lineTo(p2.x, p2.y);
                bgCtx.stroke();
            }
        }
    }
    requestAnimationFrame(drawBackground);
}

initBackground();
drawBackground();
window.addEventListener('resize', initBackground);


// --- F. MANEJO DE AUDIO FORZADO POR INTERACCIÓN ---
const audioPrompt = document.getElementById('audio-prompt');
const startAudioBtn = document.getElementById('start-audio-btn');

if(startAudioBtn) {
    startAudioBtn.addEventListener('click', () => {
        loveSong.play()
            .then(() => {
                // Si la reproducción es exitosa, oculta el mensaje
                if(audioPrompt) {
                audioPrompt.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error al reproducir audio:", error);
                alert("ERROR DE AUDIO: Archivo 'All of Me.mp3' no encontrado o corrupto.");
            });
    });
}
