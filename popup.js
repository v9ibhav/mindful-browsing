// Popup functionality for Mindful Browsing Extension
document.addEventListener('DOMContentLoaded', async function() {
    // DOM elements
    const streakCount = document.getElementById('streakCount');
    const progressFill = document.getElementById('progressFill');
    const dailyQuote = document.getElementById('dailyQuote');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    const extensionToggle = document.getElementById('extensionToggle');
    const totalBlocks = document.getElementById('totalBlocks');
    const timesSaved = document.getElementById('timesSaved');
    const resetBtn = document.getElementById('resetBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const meditationBtn = document.getElementById('meditationBtn');
    const breathingBtn = document.getElementById('breathingBtn');

    // Modals
    const breathingModal = document.getElementById('breathingModal');
    const meditationModal = document.getElementById('meditationModal');
    const closeBreathing = document.getElementById('closeBreathing');
    const closeMeditation = document.getElementById('closeMeditation');

    // Breathing exercise elements
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingText = document.getElementById('breathingText');
    const breathingCount = document.getElementById('breathingCount');
    const startBreathingBtn = document.getElementById('startBreathingBtn');

    // Meditation elements
    const meditationTimer = document.getElementById('meditationTimer');
    const meditationText = document.getElementById('meditationText');
    const meditationProgress = document.getElementById('meditationProgress');
    const startMeditationBtn = document.getElementById('startMeditationBtn');

    // State variables
    let currentQuoteIndex = 0;
    let quotes = [];
    let tips = [];
    let affirmations = [];
    let breathingActive = false;
    let meditationActive = false;
    let meditationInterval;

    // Load quotes data
    async function loadQuotes() {
        try {
            const response = await fetch(chrome.runtime.getURL('data/quotes.json'));
            const data = await response.json();
            quotes = data.quotes;
            tips = data.tips;
            affirmations = data.affirmations;
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Fallback quotes
            quotes = [
                {
                    text: "The present moment is the only time over which we have dominion.",
                    author: "Thich Nhat Hanh",
                    category: "mindfulness"
                }
            ];
        }
    }

    // Get random quote
    function getRandomQuote() {
        if (quotes.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    // Update streak display
    async function updateStreakDisplay() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getStreak' });
            if (response.success) {
                const streak = response.streak;
                streakCount.textContent = streak.count;

                // Update progress bar (example: 7-day cycle)
                const progress = (streak.count % 7) / 7 * 100;
                progressFill.style.width = progress + '%';

                // Update stats
                const today = new Date().toDateString();
                const blocksToday = await getBlocksToday();
                totalBlocks.textContent = blocksToday;
                timesSaved.textContent = Math.floor(blocksToday * 5.5); // Estimated minutes saved
            }
        } catch (error) {
            console.error('Error updating streak:', error);
        }
    }

    // Get blocks for today
    async function getBlocksToday() {
        try {
            const result = await chrome.storage.local.get(['daily_blocks']);
            const dailyBlocks = result.daily_blocks || {};
            const today = new Date().toDateString();
            return dailyBlocks[today] || 0;
        } catch (error) {
            console.error('Error getting daily blocks:', error);
            return 0;
        }
    }

    // Display quote
    function displayQuote(quote) {
        if (!quote) return;

        dailyQuote.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `- ${quote.author}`;

        // Add subtle animation
        dailyQuote.style.opacity = '0';
        quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            dailyQuote.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 200);
    }

    // Breathing exercise
    async function startBreathingExercise() {
        if (breathingActive) return;

        breathingActive = true;
        startBreathingBtn.textContent = 'In Progress...';
        startBreathingBtn.disabled = true;

        // Countdown
        for (let i = 3; i > 0; i--) {
            breathingCount.textContent = i;
            breathingText.textContent = 'Get Ready';
            await sleep(1000);
        }

        // Breathing cycles (4 cycles of 4-7-8 breathing)
        for (let cycle = 0; cycle < 4; cycle++) {
            // Inhale (4 seconds)
            breathingText.textContent = 'Inhale';
            breathingCircle.classList.add('inhale');
            breathingCircle.classList.remove('exhale');

            for (let i = 4; i > 0; i--) {
                breathingCount.textContent = i;
                await sleep(1000);
            }

            // Hold (7 seconds)
            breathingText.textContent = 'Hold';
            for (let i = 7; i > 0; i--) {
                breathingCount.textContent = i;
                await sleep(1000);
            }

            // Exhale (8 seconds)
            breathingText.textContent = 'Exhale';
            breathingCircle.classList.add('exhale');
            breathingCircle.classList.remove('inhale');

            for (let i = 8; i > 0; i--) {
                breathingCount.textContent = i;
                await sleep(1000);
            }
        }

        // Finish
        breathingText.textContent = 'Well done! 🌟';
        breathingCount.textContent = '✨';
        breathingCircle.classList.remove('inhale', 'exhale');

        setTimeout(() => {
            breathingActive = false;
            startBreathingBtn.textContent = 'Start';
            startBreathingBtn.disabled = false;
            breathingModal.style.display = 'none';
        }, 2000);
    }

    // Meditation timer
    async function startMeditation() {
        if (meditationActive) return;

        meditationActive = true;
        startMeditationBtn.textContent = 'In Progress...';
        startMeditationBtn.disabled = true;

        let timeLeft = 60; // 1 minute
        const totalTime = 60;

        meditationInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            meditationTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Update progress
            const progress = ((totalTime - timeLeft) / totalTime) * 100;
            meditationProgress.style.width = progress + '%';

            // Update text
            if (timeLeft > 45) {
                meditationText.textContent = 'Focus on your breath';
            } else if (timeLeft > 30) {
                meditationText.textContent = 'Let thoughts pass by';
            } else if (timeLeft > 15) {
                meditationText.textContent = 'Notice the present moment';
            } else {
                meditationText.textContent = 'Almost there...';
            }

            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(meditationInterval);
                meditationTimer.textContent = '0:00';
                meditationText.textContent = 'Meditation complete! 🧘‍♀️';
                meditationProgress.style.width = '100%';

                setTimeout(() => {
                    meditationActive = false;
                    startMeditationBtn.textContent = 'Start';
                    startMeditationBtn.disabled = false;
                    meditationModal.style.display = 'none';
                }, 2000);
            }
        }, 1000);
    }

    // Helper function for delays
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Event listeners
    newQuoteBtn.addEventListener('click', () => {
        const quote = getRandomQuote();
        displayQuote(quote);
    });

    extensionToggle.addEventListener('change', async (e) => {
        try {
            const enabled = e.target.checked;
            const response = await chrome.runtime.sendMessage({
                action: 'toggleExtension',
                enabled
            });
            if (!response.success) {
                // Revert toggle if failed
                e.target.checked = !enabled;
            }
        } catch (error) {
            console.error('Error toggling extension:', error);
        }
    });

    resetBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset your streak?')) {
            try {
                const response = await chrome.runtime.sendMessage({ action: 'resetStreak' });
                if (response.success) {
                    await updateStreakDisplay();
                }
            } catch (error) {
                console.error('Error resetting streak:', error);
            }
        }
    });

    settingsBtn.addEventListener('click', () => {
        // Open options page (to be implemented)
        console.log('Settings clicked');
    });

    // Modal event listeners
    breathingBtn.addEventListener('click', () => {
        breathingModal.style.display = 'block';
    });

    meditationBtn.addEventListener('click', () => {
        meditationModal.style.display = 'block';
    });

    closeBreathing.addEventListener('click', () => {
        breathingModal.style.display = 'none';
        if (breathingActive) {
            breathingActive = false;
            startBreathingBtn.textContent = 'Start';
            startBreathingBtn.disabled = false;
        }
    });

    closeMeditation.addEventListener('click', () => {
        meditationModal.style.display = 'none';
        if (meditationActive) {
            clearInterval(meditationInterval);
            meditationActive = false;
            startMeditationBtn.textContent = 'Start';
            startMeditationBtn.disabled = false;
        }
    });

    startBreathingBtn.addEventListener('click', startBreathingExercise);
    startMeditationBtn.addEventListener('click', startMeditation);

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === breathingModal) {
            breathingModal.style.display = 'none';
        }
        if (e.target === meditationModal) {
            meditationModal.style.display = 'none';
        }
    });

    // Initialize
    await loadQuotes();
    await updateStreakDisplay();

    // Display initial quote
    const initialQuote = getRandomQuote();
    displayQuote(initialQuote);

    // Load extension state
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
        if (response.success) {
            extensionToggle.checked = response.settings.extension_enabled !== false;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
});