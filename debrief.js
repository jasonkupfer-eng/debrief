document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HEAVY HACKER ROOM CANVAS ---
    const canvas = document.getElementById('hackerRoomCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Define background monitors with distinct styles
    const monitors = [];
    const colors = ['#ff007f', '#00f0ff', '#39ff14', '#ffea00'];
    
    for (let i = 0; i < 12; i++) {
        monitors.push({
            x: Math.random() * width,
            y: Math.random() * height,
            w: 150 + Math.random() * 250,
            h: 100 + Math.random() * 200,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: ['matrix', 'chart', 'glitch'][Math.floor(Math.random() * 3)],
            dataOffset: 0
        });
    }

    function drawBackground() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'screen';
        
        monitors.forEach(mon => {
            // Draw Screen Base Glow
            ctx.fillStyle = mon.color;
            ctx.globalAlpha = 0.1 + Math.random() * 0.15; // Brighter glow
            ctx.fillRect(mon.x, mon.y, mon.w, mon.h);
            
            ctx.globalAlpha = 0.6; // Brighter content
            
            if (mon.type === 'matrix') {
                ctx.font = '12px monospace';
                for(let r = 0; r < mon.h / 15; r++) {
                    const line = Math.random().toString(36).substring(2, 20);
                    ctx.fillText(line, mon.x + 5, mon.y + 15 + (r * 15));
                }
            } 
            else if (mon.type === 'chart') {
                mon.dataOffset += 2;
                if (mon.dataOffset > mon.w) mon.dataOffset = 0;
                for (let b = 0; b < 10; b++) {
                    const barHeight = Math.random() * (mon.h - 20);
                    ctx.fillRect(mon.x + 10 + (b * 20), mon.y + mon.h - 10 - barHeight, 15, barHeight);
                }
            }
            else if (mon.type === 'glitch') {
                if (Math.random() > 0.8) {
                    ctx.fillRect(mon.x + Math.random() * mon.w, mon.y + Math.random() * mon.h, Math.random() * 50, Math.random() * 20);
                }
            }
        });
        requestAnimationFrame(drawBackground);
    }
    drawBackground();

    // --- 2. AUDIO SYNTHESIZER ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    function initAudio() { if (!audioCtx) audioCtx = new AudioContext(); }

    function playTone(freq, type, duration) {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
    }

    function playSadTrumpet() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(311.13, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(293.66, audioCtx.currentTime + 0.3);
        osc.frequency.setValueAtTime(277.18, audioCtx.currentTime + 0.6); 
        osc.frequency.linearRampToValueAtTime(200.00, audioCtx.currentTime + 1.2); 
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 1.2);
    }

    function playErrorBuzz() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(60, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    }

    // --- 3. DYNAMIC KEYBOARD TYPING ---
    const kbContainer = document.getElementById('tactileKeyboard');
    const keys = [];
    if (kbContainer) {
        for (let i = 0; i < 45; i++) {
            const key = document.createElement('div');
            key.className = 'kb-key';
            if (i === 40) key.classList.add('kb-space');
            if (i === 28) key.classList.add('kb-enter');
            kbContainer.appendChild(key);
            keys.push(key);
        }
    }

    document.querySelectorAll('.term-input').forEach(input => {
        input.addEventListener('input', () => {
            if (keys.length > 0) {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                randomKey.classList.add('pressed');
                setTimeout(() => randomKey.classList.remove('pressed'), 80);
            }
        });
    });

    // --- 4. HUMANITY METER ---
    const hearts = document.querySelectorAll('.pixel-heart');
    const ratingText = document.getElementById('ratingText');
    const finalRatingInput = document.getElementById('finalRating');
    const flawlessBadge = document.getElementById('flawlessBadge');
    let currentRating = 0;

    const ratingData = [
        { msg: "[1/5] BOTS WIN. CRITICAL FAILURE.", colorClass: 'h-red', pitch: null }, 
        { msg: "[2/5] BARELY FUNCTIONING.", colorClass: 'h-orange', pitch: 349.23 }, 
        { msg: "[3/5] ACCEPTABLE PROTOCOL.", colorClass: 'h-yellow', pitch: 440.00 }, 
        { msg: "[4/5] STRONG HUMAN EFFORT.", colorClass: 'h-chartreuse', pitch: 523.25 }, 
        { msg: "[5/5] HUMANITY RESTORED.", colorClass: 'h-green', pitch: 659.25 } 
    ];

    hearts.forEach((heart, index) => {
        heart.addEventListener('mouseenter', () => {
            ratingText.innerText = ratingData[index].msg;
            hearts.forEach((h, i) => {
                h.className = 'pixel-heart term-heart';
                if (i <= index) h.classList.add(ratingData[index].colorClass);
            });
        });

        heart.addEventListener('mouseleave', () => {
            if (currentRating === 0) {
                ratingText.innerText = "AWAITING INPUT...";
                hearts.forEach(h => h.className = 'pixel-heart term-heart');
            } else {
                ratingText.innerText = ratingData[currentRating - 1].msg;
                hearts.forEach((h, i) => {
                    h.className = 'pixel-heart term-heart';
                    if (i < currentRating) h.classList.add(ratingData[currentRating - 1].colorClass);
                });
            }
        });

        heart.addEventListener('click', () => {
            currentRating = index + 1;
            finalRatingInput.value = currentRating;
            
            if (currentRating === 1) { playSadTrumpet(); } 
            else {
                playTone(ratingData[index].pitch, 'sine', 0.4);
                if (currentRating === 5) setTimeout(() => playTone(880, 'sine', 0.6), 150);
            }

            if (currentRating === 5) flawlessBadge.classList.add('show');
            else flawlessBadge.classList.remove('show');
        });
    });

    // --- 5. DISK SPACE ---
    const debriefLog = document.getElementById('debriefLog');
    const memoryBar = document.getElementById('memoryBar');
    
    if (debriefLog && memoryBar) {
        debriefLog.addEventListener('input', () => {
            const length = debriefLog.value.length;
            const max = debriefLog.getAttribute('maxlength');
            const percentage = (length / max) * 100;
            memoryBar.style.width = `${percentage}%`;
            memoryBar.className = 'disk-fill';
            if (percentage > 90) memoryBar.classList.add('critical');
            else if (percentage > 70) memoryBar.classList.add('warning');
        });
    }

    // --- 6. TRANSMISSION SEQUENCE ---
    const transmitBtn = document.getElementById('transmitDebriefBtn');
    const debriefForm = document.getElementById('debriefForm');
    const debriefSuccess = document.getElementById('debriefSuccess');
    const errorOverlay = document.getElementById('criticalErrorOverlay');
    const crtScreen = document.getElementById('debriefScreen');

    transmitBtn.addEventListener('click', async () => {
        const rating = finalRatingInput.value;
        const log = debriefLog.value.trim();
        const email = document.getElementById('pilotEmail').value.trim();
        const initials = document.getElementById('pilotInitials').value.trim();

        if (rating === "0" || !email || !email.includes('@') || !initials) {
            playErrorBuzz();
            errorOverlay.classList.add('active');
            setTimeout(() => errorOverlay.classList.remove('active'), 2000);
            return;
        }

        transmitBtn.innerText = "[ TRANSMITTING... ]";
        transmitBtn.style.pointerEvents = "none";

        try {
            const res = await fetch('/api/send-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, log, email, initials })
            });

            if (!res.ok) throw new Error('Transmission failed');

            // Trigger CRT Blink Out
            crtScreen.classList.add('crt-blink-out');
            
            // Swap content while screen is "off"
            setTimeout(() => {
                debriefForm.style.display = "none";
                debriefSuccess.style.display = "flex";
                playTone(880, 'sine', 0.2);
            }, 300); // Happens exactly halfway through the CSS animation

            // Remove blink class so it comes back on
            setTimeout(() => {
                crtScreen.classList.remove('crt-blink-out');
            }, 650);

        } catch (error) {
            transmitBtn.innerText = "[ UPLINK FAILED. RETRY. ]";
            transmitBtn.style.pointerEvents = "auto";
            playErrorBuzz();
        }
    });

    const initialInput = document.getElementById('pilotInitials');
    if (initialInput) {
        initialInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        });
    }
});