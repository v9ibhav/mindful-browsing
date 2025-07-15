// Background service worker for Mindful Browsing Extension
// Handles streak tracking, storage, and extension lifecycle

class StreakManager {
    constructor() {
        this.STORAGE_KEY = 'mindful_streak';
        this.LAST_VISIT_KEY = 'last_blocked_visit';
    }

    async getStreak() {
        const result = await chrome.storage.local.get([this.STORAGE_KEY]);
        return result[this.STORAGE_KEY] || {
            count: 0,
            startDate: null,
            lastUpdateDate: null
        };
    }

    async updateStreak() {
        const streak = await this.getStreak();
        const today = new Date().toDateString();

        if (streak.lastUpdateDate === today) {
            return streak; // Already updated today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (streak.lastUpdateDate === yesterdayStr || streak.count === 0) {
            // Continue streak or start new one
            streak.count++;
            streak.lastUpdateDate = today;

            if (streak.count === 1) {
                streak.startDate = today;
            }
        } else {
            // Streak broken, reset
            streak.count = 1;
            streak.startDate = today;
            streak.lastUpdateDate = today;
        }

        await chrome.storage.local.set({ [this.STORAGE_KEY]: streak });
        return streak;
    }

    async recordBlockedVisit() {
        const timestamp = Date.now();
        await chrome.storage.local.set({ [this.LAST_VISIT_KEY]: timestamp });
        return this.updateStreak();
    }

    async resetStreak() {
        const resetStreak = {
            count: 0,
            startDate: null,
            lastUpdateDate: null
        };
        await chrome.storage.local.set({ [this.STORAGE_KEY]: resetStreak });
        return resetStreak;
    }
}

// Initialize streak manager
const streakManager = new StreakManager();

// Extension installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        // Set up default settings
        await chrome.storage.local.set({
            extension_enabled: true,
            first_install: true,
            install_date: Date.now()
        });

        // Initialize streak
        await streakManager.updateStreak();

        console.log('Mindful Browsing Extension installed successfully');
    }
});

// Listen for messages from popup and blocked pages
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        switch (request.action) {
            case 'getStreak':
                const streak = await streakManager.getStreak();
                sendResponse({ success: true, streak });
                break;

            case 'recordBlockedVisit':
                const updatedStreak = await streakManager.recordBlockedVisit();
                sendResponse({ success: true, streak: updatedStreak });
                break;

            case 'resetStreak':
                const resetStreak = await streakManager.resetStreak();
                sendResponse({ success: true, streak: resetStreak });
                break;

            case 'toggleExtension':
                const enabled = request.enabled;
                await chrome.storage.local.set({ extension_enabled: enabled });

                if (enabled) {
                    // Enable blocking rules
                    await chrome.declarativeNetRequest.updateEnabledRulesets({
                        enableRulesetIds: ['mindful_blocking_rules']
                    });
                } else {
                    // Disable blocking rules
                    await chrome.declarativeNetRequest.updateEnabledRulesets({
                        disableRulesetIds: ['mindful_blocking_rules']
                    });
                }

                sendResponse({ success: true, enabled });
                break;

            case 'getSettings':
                const settings = await chrome.storage.local.get([
                    'extension_enabled',
                    'first_install',
                    'install_date'
                ]);
                sendResponse({ success: true, settings });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
    } catch (error) {
        console.error('Background script error:', error);
        sendResponse({ success: false, error: error.message });
    }

    return true; // Keep message channel open for async response
});

// Daily streak check
chrome.alarms.create('daily_streak_check', {
    delayInMinutes: 1,
    periodInMinutes: 60 * 24 // Check daily
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'daily_streak_check') {
        await streakManager.updateStreak();
    }
});

// Context menu for quick access
chrome.runtime.onStartup.addListener(() => {
    chrome.contextMenus.create({
        id: 'mindful_browsing_menu',
        title: 'Mindful Browsing',
        contexts: ['all']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'mindful_browsing_menu') {
        chrome.action.openPopup();
    }
});

console.log('Mindful Browsing background script loaded');