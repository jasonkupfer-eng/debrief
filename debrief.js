document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HUMANITY METER (HEARTS) LOGIC ---
    const hearts = document.querySelectorAll('.pixel-heart');
    const ratingText = document.getElementById('ratingText');
    const finalRatingInput = document.getElementById('finalRating');
    let currentRating = 0;

    const ratingMessages = [
        "AWAITING INPUT...",
        "[1/5] BOTS WIN. CRITICAL FAILURE.",
        "[2/5] BARELY FUNCTIONING.",
        "[3/5] ACCEPTABLE PROTOCOL.",
        "[4/5] STRONG HUMAN EFFORT.",
        "[5/5] 100% HUMAN. FLAWLESS VICTORY."
    ];

    const ratingColors = ["#888", "#ff007f", "#ffea00", "#39ff14", "#00f0ff", "#39ff14"];

    hearts.forEach((heart, index) => {
        // Hover Effects
        heart.addEventListener('mouseenter', () => {
            hearts.forEach((h, i) => {
                if (i <= index) h.classList.add('hover-active');
                else h.classList.remove('hover-active');
            });
            ratingText.innerText = ratingMessages[index + 1];
            ratingText.style.color = ratingColors[index + 1];
        });

        // Remove Hover Effects
        heart.addEventListener('mouseleave', () => {
            hearts.forEach(h => h.classList.remove('hover-active'));
            ratingText.innerText = ratingMessages[currentRating];
            ratingText.style.color = ratingColors[currentRating];
        });

        // Click to Lock in Rating
        heart.addEventListener('click', () => {
            currentRating = index + 1;
            finalRatingInput.value = currentRating;
            
            // Lock in the active class
            hearts.forEach((h, i) => {
                h.classList.remove('error-flash'); // Clear any previous errors
                if (i < currentRating) h.classList.add('active');
                else h.classList.remove('active');
            });
            
            // Pop the text
            ratingText.style.textShadow = `0 0 10px ${ratingColors[currentRating]}`;
            setTimeout(() => { ratingText.style.textShadow = 'none'; }, 300);
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

            // Change color as it gets full
            if (percentage < 50) {
                memoryBar.style.backgroundColor = "var(--neon-green)";
            } else if (percentage < 85) {
                memoryBar.style.backgroundColor = "#ffea00";
            } else {
                memoryBar.style.backgroundColor = "var(--neon-pink)";
            }
        });
    }

    // --- 3. TRANSMISSION SEQUENCE ---
    const transmitBtn = document.getElementById('transmitDebriefBtn');
    const debriefForm = document.getElementById('debriefForm');
    const debriefSuccess = document.getElementById('debriefSuccess');
    const crtScreen = document.getElementById('debriefScreen');

    transmitBtn.addEventListener('click', async () => {
        const rating = finalRatingInput.value;
        const log = debriefLog.value.trim();
        const initials = document.getElementById('pilotInitials').value.trim();

        // VALIDATION: Did they forget to rate?
        if (rating === "0") {
            hearts.forEach(h => h.classList.add('error-flash'));
            ratingText.innerText = "ERR: RATING REQUIRED FOR TRANSMISSION";
            ratingText.style.color = "var(--neon-pink)";
            setTimeout(() => {
                hearts.forEach(h => h.classList.remove('error-flash'));
                ratingText.innerText = "AWAITING INPUT...";
                ratingText.style.color = "#888";
            }, 2000);
            return;
        }

        // VALIDATION: Missing Initials
        if (!initials) {
            const initialInput = document.getElementById('pilotInitials');
            initialInput.style.borderColor = "var(--neon-pink)";
            setTimeout(() => { initialInput.style.borderColor = "var(--neon-cyan)"; }, 2000);
            return;
        }

        transmitBtn.innerText = "TRANSMITTING...";
        transmitBtn.style.pointerEvents = "none";

        try {
            // YOU WILL ADD YOUR VERCEL/BACKEND FETCH CALL HERE 
            // await fetch('/api/send-review', { ... payload: { rating, log, initials } });
            
            // Simulate network delay for effect
            await new Promise(r => setTimeout(r, 800));

            // TRIGGER THE VIOLENT GLITCH
            crtScreen.classList.add('glitch-crash');

            // Swap the screens while it's glitching out
            setTimeout(() => {
                debriefForm.style.display = "none";
                debriefSuccess.style.display = "flex";
                crtScreen.classList.remove('glitch-crash');
            }, 400);

        } catch (error) {
            transmitBtn.innerText = "UPLINK FAILED. RETRY.";
            transmitBtn.style.pointerEvents = "auto";
            transmitBtn.style.borderColor = "var(--neon-pink)";
            transmitBtn.style.color = "var(--neon-pink)";
        }
    });

    // Auto-formatting for Initials (force uppercase, no numbers)
    const initialInput = document.getElementById('pilotInitials');
    if (initialInput) {
        initialInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        });
    }
});