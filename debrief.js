document.addEventListener("DOMContentLoaded", () => {
    
    // --- AUDIO SYNTHESIZER (No external files needed) ---
    function playRetroDing() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch (A5)
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // Slide up
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5); // Fade out
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    // --- 1. HUMANITY METER (HEARTS) LOGIC ---
    const hearts = document.querySelectorAll('.pixel-heart');
    const ratingText = document.getElementById('ratingText');
    const finalRatingInput = document.getElementById('finalRating');
    const flawlessBadge = document.getElementById('flawlessBadge');
    let currentRating = 0;

    const ratingMessages = [
        "AWAITING INPUT...",
        "[1/5] BOTS WIN. CRITICAL FAILURE.",
        "[2/5] BARELY FUNCTIONING.",
        "[3/5] ACCEPTABLE PROTOCOL.",
        "[4/5] STRONG HUMAN EFFORT.",
        "[5/5] HUMANITY RESTORED."
    ];

    hearts.forEach((heart, index) => {
        heart.addEventListener('mouseenter', () => {
            hearts.forEach((h, i) => {
                if (i <= index) h.classList.add('hover-active');
                else h.classList.remove('hover-active');
            });
            ratingText.innerText = ratingMessages[index + 1];
        });

        heart.addEventListener('mouseleave', () => {
            hearts.forEach(h => h.classList.remove('hover-active'));
            ratingText.innerText = ratingMessages[currentRating];
        });

        heart.addEventListener('click', () => {
            currentRating = index + 1;
            finalRatingInput.value = currentRating;
            
            hearts.forEach((h, i) => {
                if (i < currentRating) h.classList.add('active');
                else h.classList.remove('active');
            });

            // Trigger the Badge and Ding on 5th Star
            if (currentRating === 5) {
                flawlessBadge.classList.add('show');
                playRetroDing();
            } else {
                flawlessBadge.classList.remove('show');
            }
        });
    });

    // --- 2. MEMORY BAR (COMM-LOG) LOGIC ---
    const debriefLog = document.getElementById('debriefLog');
    const memoryBar = document.getElementById('memoryBar');
    
    if (debriefLog && memoryBar) {
        debriefLog.addEventListener('input', () => {
            const length = debriefLog.value.length;
            const max = debriefLog.getAttribute('maxlength');
            const percentage = (length / max) * 100;
            memoryBar.style.width = `${percentage}%`;
            memoryBar.style.backgroundColor = percentage > 85 ? "#ff0000" : "#39ff14";
        });
    }

    // --- 3. TRANSMISSION SEQUENCE ---
    const transmitBtn = document.getElementById('transmitDebriefBtn');
    const debriefForm = document.getElementById('debriefForm');
    const debriefSuccess = document.getElementById('debriefSuccess');
    const crtScreen = document.getElementById('debriefScreen');
    const errorOverlay = document.getElementById('criticalErrorOverlay');

    // Trigger Floppy Light on click
    const floppyLight = document.querySelector('.floppy-light');

    transmitBtn.addEventListener('click', async () => {
        const rating = finalRatingInput.value;
        const log = debriefLog.value.trim();
        const email = document.getElementById('pilotEmail').value.trim();
        const initials = document.getElementById('pilotInitials').value.trim();

        // VALIDATION: BIG RED ERROR FOR MISSING DATA
        if (rating === "0" || !email || !email.includes('@') || !initials) {
            errorOverlay.classList.add('active');
            
            // Auto-hide the brutal red error after 2.5 seconds
            setTimeout(() => {
                errorOverlay.classList.remove('active');
            }, 2500);
            return;
        }

        transmitBtn.innerText = "[ TRANSMITTING... ]";
        transmitBtn.style.pointerEvents = "none";
        if(floppyLight) floppyLight.classList.add('active');

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
            if(floppyLight) floppyLight.classList.remove('active');

        } catch (error) {
            transmitBtn.innerText = "[ UPLINK FAILED. RETRY. ]";
            transmitBtn.style.pointerEvents = "auto";
            if(floppyLight) floppyLight.classList.remove('active');
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