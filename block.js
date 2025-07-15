// Block page functionality for Mindful Browsing Extension
document.addEventListener('DOMContentLoaded', async function() {
    // DOM elements
    const streakCount = document.getElementById('streakCount');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    const todayBlocks = document.getElementById('todayBlocks');
    const timeSaved = document.getElementById('timeSaved');
    const streakDays = document.getElementById('streakDays');
    const continueBtn = document.getElementById('continueBtn');
    const meditateBtn = document.getElementById('meditateBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const disableBtn = document.getElementById('disableBtn');

    // Intention buttons
    const intentionButtons = document.querySelectorAll('.intention-btn');

    // Modal elements
    const meditationModal = document.getElementById('meditationModal');
    const closeModal = document.getElementById('closeModal');
    const meditationTimer = document.getElementById('meditationTimer');
    const meditationInstructions = document.getElementById('meditationInstructions');
    const meditationProgress = document.getElementById('meditationProgress');
    const startMeditationBtn = document.getElementById('startMeditationBtn');

    // State variables
    let quotes = [];
    let tips = [];
    let affirmations = [];
    let selectedIntention = null;
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
            // Fallback data
            quotes = [
                {
                    text: "The present moment is the only time over which we have dominion.",
                    author: "Thich Nhat Hanh",
                    category: "mindfulness"
                },
                {
                    text: "You are not your thoughts. You are the awareness behind your thoughts.",
                    author: "Eckhart Tolle",
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

    // Display quote
    function displayQuote(quote) {
        if (!quote) return;

        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `- ${quote.author}`;

        // Add subtle animation
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 200);
    }

    // Update statistics
    async function updateStats() {
        try {
            // Record blocked visit
            const response = await chrome.runtime.sendMessage({ action: 'recordBlockedVisit' });
            if (response.success) {
                const streak = response.streak;
                streakCount.textContent = streak.count;
                streakDays.textContent = streak.count;
            }

            // Update daily blocks
            const today = new Date().toDateString();
            const result = await chrome.storage.local.get(['daily_blocks']);
            const dailyBlocks = result.daily_blocks || {};

            if (!dailyBlocks[today]) {
                dailyBlocks[today] = 0;
            }
            dailyBlocks[today]++;

            await chrome.storage.local.set({ daily_blocks: dailyBlocks });

            // Update display
            todayBlocks.textContent = dailyBlocks[today];
            timeSaved.textContent = Math.floor(dailyBlocks[today] * 5.5); // Estimated minutes saved

        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    // Handle intention selection
    function handleIntentionSelection(intention) {
        selectedIntention = intention;

        // Update button states
        intentionButtons.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.intention === intention) {
                btn.classList.add('selected');
            }
        });

        // Update continue button text
        const intentionTexts = {
            'work': 'Continue to Work',
            'learn': 'Continue Learning',
            'connect': 'Connect with Others',
            'rest': 'Take a Break'
        };

        continueBtn.innerHTML = `<span>🚀</span> ${intentionTexts[intention]}`;
    }

    // 5-minute meditation
    async function startMeditation() {
        if (meditationActive) return;

        meditationActive = true;
        startMeditationBtn.textContent = 'In Progress...';
        startMeditationBtn.disabled = true;

        let timeLeft = 300; // 5 minutes
        const totalTime = 300;

        const instructions = [
            "Close your eyes and focus on your breath",
            "Notice the sensation of breathing in and out",
            "Let thoughts come and go without judgment",
            "Feel your body relaxing with each breath",
            "Bring your attention back to your breath",
            "Notice the peace within this moment",
            "Continue breathing naturally and calmly",
            "Almost there... stay present",
            "Take a moment to appreciate this pause"
        ];

        let instructionIndex = 0;

        meditationInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            meditationTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Update progress
            const progress = ((totalTime - timeLeft) / totalTime) * 100;
            meditationProgress.style.width = progress + '%';

            // Update instructions every 30 seconds
            if (timeLeft % 30 === 0 && instructionIndex < instructions.length) {
                meditationInstructions.textContent = instructions[instructionIndex];
                instructionIndex++;
            }

            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(meditationInterval);
                meditationTimer.textContent = '0:00';
                meditationInstructions.textContent = 'Meditation complete! Take a moment to appreciate this peaceful feeling. 🧘‍♀️';
                meditationProgress.style.width = '100%';

                setTimeout(() => {
                    meditationActive = false;
                    startMeditationBtn.textContent = 'Start';
                    startMeditationBtn.disabled = false;
                    meditationModal.style.display = 'none';

                    // Show completion message
                    showNotification('Meditation complete! Well done. 🌟');
                }, 3000);
            }
        }, 1000);
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1001;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Handle continue button
    function handleContinue() {
        if (selectedIntention) {
            // Record intention
            chrome.storage.local.set({
                last_intention: selectedIntention,
                last_intention_time: Date.now()
            });

            showNotification(`Great choice! Remember to ${selectedIntention === 'work' ? 'stay focused' : selectedIntention === 'learn' ? 'stay curious' : selectedIntention === 'connect' ? 'be present' : 'be kind to yourself'}.`);
        }

        // Close the current tab or redirect
        setTimeout(() => {
            window.close();
        }, 1500);
    }

    // Handle disable temporarily
    async function handleDisable() {
        try {
            await chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: false });

            // Set re-enable timer
            setTimeout(async () => {
                await chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: true });
            }, 10 * 60 * 1000); // 10 minutes

            showNotification('Extension disabled for 10 minutes. Use this time wisely! ⏰');

            setTimeout(() => {
                window.close();
            }, 1500);
        } catch (error) {
            console.error('Error disabling extension:', error);
        }
    }

    // Add CSS for notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Event listeners
    newQuoteBtn.addEventListener('click', () => {
        const quote = getRandomQuote();
        displayQuote(quote);
    });

    intentionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleIntentionSelection(btn.dataset.intention);
        });
    });

    continueBtn.addEventListener('click', handleContinue);

    meditateBtn.addEventListener('click', () => {
        meditationModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        meditationModal.style.display = 'none';
        if (meditationActive) {
            clearInterval(meditationInterval);
            meditationActive = false;
            startMeditationBtn.textContent = 'Start';
            startMeditationBtn.disabled = false;
        }
    });

    startMeditationBtn.addEventListener('click', startMeditation);

    settingsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    disableBtn.addEventListener('click', handleDisable);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === meditationModal) {
            meditationModal.style.display = 'none';
            if (meditationActive) {
                clearInterval(meditationInterval);
                meditationActive = false;
                startMeditationBtn.textContent = 'Start';
                startMeditationBtn.disabled = false;
            }
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && meditationModal.style.display === 'block') {
            meditationModal.style.display = 'none';
        }
        if (e.key === 'Enter' && selectedIntention) {
            handleContinue();
        }
        if (e.key === 'm' || e.key === 'M') {
            meditationModal.style.display = 'block';
        }
    });

    // Initialize
    await loadQuotes();
    await updateStats();

    // Display initial quote
    const initialQuote = getRandomQuote();
    displayQuote(initialQuote);

    // Auto-select first intention after 3 seconds if none selected
    setTimeout(() => {
        if (!selectedIntention) {
            handleIntentionSelection('work');
        }
    }, 3000);
});