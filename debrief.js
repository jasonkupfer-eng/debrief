document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONCRETE HACKER ROOM CANVAS ---
    const canvas = document.getElementById('hackerRoomCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const monitors = [
        { x: 0.05, y: 0.15, w: 0.12, h: 0.20, color: '#00f0ff', blur: 3, type: 'text', data: { lines: [] } },
        { x: 0.20, y: 0.45, w: 0.08, h: 0.12, color: '#ffea00', blur: 8, type: 'glitch', data: {} },
        { x: 0.08, y: 0.70, w: 0.15, h: 0.22, color: '#00f0ff', blur: 1, type: 'wave', data: { offset: 0 } },
        { x: 0.28, y: 0.20, w: 0.14, h: 0.25, color: '#39ff14', blur: 2, type: 'matrix', data: { columns: [] } },
        { x: 0.78, y: 0.15, w: 0.16, h: 0.25, color: '#ff007f', blur: 6, type: 'spectrum', data: { phase: 0 } },
        { x: 0.72, y: 0.55, w: 0.12, h: 0.20, color: '#39ff14', blur: 1, type: 'chart', data: { bars: Array(8).fill(0) } },
        { x: 0.88, y: 0.65, w: 0.10, h: 0.25, color: '#00f0ff', blur: 4, type: 'vertical-text', data: {} }, // Modified to Vertical Text
        { x: 0.62, y: 0.22, w: 0.06, h: 0.10, color: '#ffea00', blur: 2, type: 'flicker', data: {} } 
    ];

    monitors.forEach(mon => {
        if (mon.type === 'text') {
            for (let i = 0; i < 20; i++) mon.data.lines.push(generateHex());
        }
        if (mon.type === 'matrix') {
            for (let i = 0; i < 15; i++) mon.data.columns.push({ y: Math.random() * 100, speed: 2 + Math.random() * 3 });
        }
    });

    function generateHex() {
        return '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0') + ' ' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    function drawBackground() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, width, height);
        
        monitors.forEach(mon => {
            const px = mon.x * width;
            const py = mon.y * height;
            const pw = mon.w * width;
            const ph = mon.h * height;

            ctx.save();
            ctx.globalCompositeOperation = 'source-over'; 
            if (mon.blur > 0) ctx.filter = `blur(${mon.blur}px)`;

            // Bright Gray Visible Bezel
            ctx.fillStyle = '#222222';
            ctx.fillRect(px - 10, py - 10, pw + 20, ph + 20);
            ctx.strokeStyle = '#666666'; 
            ctx.lineWidth = 4;
            ctx.strokeRect(px - 10, py - 10, pw + 20, ph + 20);

            // Screen Background
            ctx.fillStyle = '#020502';
            ctx.fillRect(px, py, pw, ph);
            ctx.beginPath();
            ctx.rect(px, py, pw, ph);
            ctx.clip();

            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = mon.color;
            ctx.strokeStyle = mon.color;

            if (mon.type === 'text') {
                ctx.font = '10px monospace';
                ctx.globalAlpha = 0.8;
                mon.data.lines.shift();
                mon.data.lines.push(generateHex());
                mon.data.lines.forEach((line, i) => { ctx.fillText(line, px + 5, py + 15 + (i * 14)); });
            } 
            else if (mon.type === 'wave') {
                mon.data.offset += 0.1;
                ctx.globalAlpha = 0.9;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < pw; x += 2) {
                    const y = ph/2 + Math.sin(x * 0.05 + mon.data.offset) * (ph/3) * Math.sin(x * 0.01 - mon.data.offset);
                    if (x === 0) ctx.moveTo(px + x, py + y);
                    else ctx.lineTo(px + x, py + y);
                }
                ctx.stroke();
            }
            else if (mon.type === 'chart') {
                ctx.globalAlpha = 0.7;
                const barW = (pw - 20) / mon.data.bars.length;
                mon.data.bars.forEach((bar, i) => {
                    const target = Math.random() * (ph - 20);
                    mon.data.bars[i] += (target - bar) * 0.1; 
                    ctx.fillRect(px + 10 + (i * barW), py + ph - 10 - mon.data.bars[i], barW - 2, mon.data.bars[i]);
                });
            }
            else if (mon.type === 'spectrum') {
                mon.data.phase += 2;
                ctx.globalAlpha = 0.5;
                for(let y = 0; y < ph; y += 10) {
                    const alpha = (Math.sin((y + mon.data.phase) * 0.05) + 1) / 2;
                    ctx.fillStyle = mon.color;
                    ctx.globalAlpha = alpha * 0.8;
                    ctx.fillRect(px, py + y, pw, 10);
                }
            }
            else if (mon.type === 'matrix') {
                ctx.font = '14px monospace';
                ctx.globalAlpha = 0.8;
                const colW = pw / mon.data.columns.length;
                mon.data.columns.forEach((col, i) => {
                    col.y += col.speed;
                    if (col.y > ph + 20) col.y = -20;
                    ctx.fillText(Math.random().toString(36).substring(2, 3).toUpperCase(), px + (i * colW), py + col.y);
                });
            }
            else if (mon.type === 'vertical-text') {
                // Downward Typing Text Logic
                ctx.font = '12px monospace';
                ctx.globalAlpha = 0.9;
                
                if (!mon.data.cols) {
                    const numCols = Math.floor(pw / 15);
                    mon.data.cols = Array(numCols).fill(0).map(() => ({
                        chars: [],
                        timer: Math.random() * 10
                    }));
                }
                
                mon.data.cols.forEach((col, i) => {
                    col.timer -= 1;
                    if (col.timer <= 0) {
                        // Adds random characters
                        col.chars.push(String.fromCharCode(0x30A0 + Math.random() * 96));
                        col.timer = 2 + Math.random() * 3;
                        if (col.chars.length * 14 > ph) col.chars.shift();
                    }
                    col.chars.forEach((char, j) => {
                        ctx.fillText(char, px + 5 + (i * 15), py + 15 + (j * 14));
                    });
                });
            }
            else if (mon.type === 'glitch') {
                if (Math.random() > 0.5) {
                    ctx.globalAlpha = Math.random();
                    const gY = Math.random() * ph;
                    const gH = Math.random() * 20;
                    ctx.fillRect(px, py + gY, pw, gH);
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(px + Math.random() * pw, py + gY, 10, gH);
                }
            }
            else if (mon.type === 'flicker') {
                if (Math.random() > 0.4) {
                    const flickerColors = ['#ff007f', '#00f0ff', '#39ff14', '#ffea00', '#ffffff'];
                    ctx.fillStyle = flickerColors[Math.floor(Math.random() * flickerColors.length)];
                    ctx.globalAlpha = 0.7 + Math.random() * 0.3;
                    ctx.fillRect(px, py, pw, ph);
                }
            }

            // Glow & Scanlines
            ctx.fillStyle = mon.color;
            ctx.globalAlpha = 0.1;
            ctx.fillRect(px, py, pw, ph);
            ctx.fillStyle = '#000';
            ctx.globalAlpha = 0.3;
            for(let y = 0; y < ph; y += 4) { ctx.fillRect(px, py + y, pw, 2); }
            ctx.restore();
        });
        setTimeout(() => requestAnimationFrame(drawBackground), 1000 / 24);
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

            crtScreen.classList.add('crt-blink-out');
            
            setTimeout(() => {
                debriefForm.style.display = "none";
                debriefSuccess.style.display = "flex";
                playTone(880, 'sine', 0.2);
            }, 300);

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