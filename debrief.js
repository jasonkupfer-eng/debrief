document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HACKER ROOM BACKGROUND CANVAS ---
    const canvas = document.getElementById('hackerRoomCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create background "monitors"
    const bgMonitors = [];
    for (let i = 0; i < 8; i++) {
        bgMonitors.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.8), // Keep mostly in upper half
            w: 100 + Math.random() * 200,
            h: 80 + Math.random() * 150,
            color: ['#ff007f', '#00f0ff', '#39ff14', '#ffea00'][Math.floor(Math.random() * 4)],
            lines: Array(10).fill('').map(() => Math.random().toString(36).substring(2, 15))
        });
    }

    function drawHackerRoom() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'screen';
        
        bgMonitors.forEach(mon => {
            // Draw Screen Glow
            ctx.fillStyle = mon.color;
            ctx.globalAlpha = 0.05 + Math.random() * 0.05; // Flickering opacity
            ctx.fillRect(mon.x, mon.y, mon.w, mon.h);
            
            // Draw Code Lines
            ctx.globalAlpha = 0.3;
            ctx.font = '10px monospace';
            mon.lines.forEach((line, index) => {
                // Randomly change characters for the matrix effect
                if (Math.random() > 0.9) mon.lines[index] = Math.random().toString(36).substring(2, 10);
                ctx.fillText(mon.lines[index], mon.x + 5, mon.y + 15 + (index * 12));
            });
        });
        requestAnimationFrame(drawHackerRoom);
    }
    drawHackerRoom();


    // --- 2. RETRO AUDIO SYNTHESIZER ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() { if (!audioCtx) audioCtx = new AudioContext(); }

    function playTone(freq, type, duration) {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function playSadTrumpet() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        
        // Descending Wah-wah notes
        osc.frequency.setValueAtTime(311.13, audioCtx.currentTime); // Eb4
        osc.frequency.setValueAtTime(293.66, audioCtx.currentTime + 0.3); // D4
        osc.frequency.setValueAtTime(277.18, audioCtx.currentTime + 0.6); // Db4
        osc.frequency.linearRampToValueAtTime(200.00, audioCtx.currentTime + 1.2); // Slide down

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
    }

    function playErrorBuzz() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(60, audioCtx.currentTime); // Low harsh buzz
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }


    // --- 3. DYNAMIC KEYBOARD GENERATOR & TYPING EFFECT ---
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

    // Bounce a random key visually when typing in any input
    document.querySelectorAll('.term-input').forEach(input => {
        input.addEventListener('input', () => {
            if (keys.length > 0) {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                randomKey.classList.add('pressed');
                setTimeout(() => randomKey.classList.remove('pressed'), 100);
            }
        });
    });


    // --- 4. HUMANITY METER (COLOR CLIMB & SOUNDS) ---
    const hearts = document.querySelectorAll('.pixel-heart');
    const ratingText = document.getElementById('ratingText');
    const finalRatingInput = document.getElementById('finalRating');
    const flawlessBadge = document.getElementById('flawlessBadge');
    let currentRating = 0;

    const ratingData = [
        { msg: "[1/5] BOTS WIN. CRITICAL FAILURE.", colorClass: 'h-red', pitch: null }, // Handled by sad trumpet
        { msg: "[2/5] BARELY FUNCTIONING.", colorClass: 'h-orange', pitch: 349.23 }, // F4
        { msg: "[3/5] ACCEPTABLE PROTOCOL.", colorClass: 'h-yellow', pitch: 440.00 }, // A4
        { msg: "[4/5] STRONG HUMAN EFFORT.", colorClass: 'h-chartreuse', pitch: 523.25 }, // C5
        { msg: "[5/5] HUMANITY RESTORED.", colorClass: 'h-green', pitch: 659.25 } // E5
    ];

    hearts.forEach((heart, index) => {
        heart.addEventListener('mouseenter', () => {
            ratingText.innerText = ratingData[index].msg;
            hearts.forEach((h, i) => {
                h.className = 'pixel-heart term-heart'; // Reset
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
            
            // Audio Logic
            if (currentRating === 1) {
                playSadTrumpet();
            } else {
                playTone(ratingData[index].pitch, 'sine', 0.4);
                if (currentRating === 5) {
                    setTimeout(() => playTone(880, 'sine', 0.6), 150); // The extra "ding" for flawless
                }
            }

            // Visual Logic
            if (currentRating === 5) flawlessBadge.classList.add('show');
            else flawlessBadge.classList.remove('show');
        });
    });


    // --- 5. DISK SPACE (MEMORY BAR) ---
    const debriefLog = document.getElementById('debriefLog');
    const memoryBar = document.getElementById('memoryBar');
    
    if (debriefLog && memoryBar) {
        debriefLog.addEventListener('input', () => {
            const length = debriefLog.value.length;
            const max = debriefLog.getAttribute('maxlength');
            const percentage = (length / max) * 100;
            
            memoryBar.style.width = `${percentage}%`;
            memoryBar.className = 'disk-fill'; // Reset classes
            
            if (percentage > 90) memoryBar.classList.add('critical');
            else if (percentage > 70) memoryBar.classList.add('warning');
        });
    }

    // --- 6. TRANSMISSION SEQUENCE ---
    const transmitBtn = document.getElementById('transmitDebriefBtn');
    const debriefForm = document.getElementById('debriefForm');
    const debriefSuccess = document.getElementById('debriefSuccess');
    const errorOverlay = document.getElementById('criticalErrorOverlay');

    transmitBtn.addEventListener('click', async () => {
        const rating = finalRatingInput.value;
        const log = debriefLog.value.trim();
        const email = document.getElementById('pilotEmail').value.trim();
        const initials = document.getElementById('pilotInitials').value.trim();

        // VALIDATION: THE BRUTAL RED ERROR
        if (rating === "0" || !email || !email.includes('@') || !initials) {
            playErrorBuzz();
            errorOverlay.classList.add('active');
            
            setTimeout(() => {
                errorOverlay.classList.remove('active');
            }, 2000);
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

            // Swap the screens
            debriefForm.style.display = "none";
            debriefSuccess.style.display = "flex";
            playTone(880, 'sine', 0.2); // Success chirp

        } catch (error) {
            transmitBtn.innerText = "[ UPLINK FAILED. RETRY. ]";
            transmitBtn.style.pointerEvents = "auto";
            playErrorBuzz();
        }
    });

    // Auto-formatting for Initials
    const initialInput = document.getElementById('pilotInitials');
    if (initialInput) {
        initialInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        });
    }
});