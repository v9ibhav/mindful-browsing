Mindful Browsing for Gen Z Chrome Extension
A modern Chrome extension designed to combat doomscrolling and promote digital wellness for Gen Z users. Features beautiful glassmorphism design, mindfulness exercises, and gamified streak tracking.

🌟 Features
Core Functionality
Website Blocking: Automatically blocks major doomscrolling sites (Twitter/X, Reddit, Instagram, TikTok, Facebook, YouTube, Snapchat)

Mindful Replacement: Replaces blocked pages with inspirational quotes, breathing exercises, and intention-setting prompts

Streak Tracking: Gamified streak counter to encourage consistent mindful browsing habits

Interactive Exercises: Built-in 1-minute meditation and 4-7-8 breathing exercises

Modern Gen Z Design
Glassmorphism UI: Beautiful frosted glass effects with backdrop blur

Gradient Backgrounds: Vibrant, modern color schemes

Smooth Animations: Subtle animations and transitions throughout

Responsive Design: Works perfectly on all screen sizes

Dark Mode Ready: Designed with modern aesthetics in mind

Mental Health Focus
Curated Quotes: Mindfulness quotes from spiritual leaders and modern thinkers

Breathing Exercises: Guided breathing techniques for stress relief

Intention Setting: Prompts users to set clear intentions before browsing

Progress Tracking: Visual progress indicators and statistics

🚀 Installation
Method 1: Load Unpacked Extension (Recommended for Development)
Download the Extension

Clone this repository or download the ZIP file

Extract the files to a folder on your computer

Open Chrome Extensions

Open Google Chrome

Navigate to chrome://extensions/

Enable "Developer mode" (toggle in top right)

Load the Extension

Click "Load unpacked"

Select the mindful-browsing folder

The extension will appear in your toolbar

Method 2: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store soon

Look for "Mindful Browsing for Gen Z"

🎯 How to Use
Getting Started
After installation, click the extension icon in your toolbar

The popup will show your current streak and daily quote

Toggle the extension on/off as needed

Try the built-in meditation and breathing exercises

When a Site is Blocked
Blocked sites will redirect to a mindful pause page

Take a moment to breathe and set your intention

Choose from quick mindfulness exercises

Continue with purpose or take a meditation break

Building Your Streak
Your streak increases each day you successfully avoid distracting sites

Reset your streak anytime from the popup

Track your progress with visual indicators

Celebrate milestones and achievements

🛠️ Technical Details
Architecture
Manifest V3: Built with the latest Chrome Extension standards

Service Worker: Efficient background processing

Declarative Net Request: Modern website blocking without performance impact

Local Storage: All data stored locally for privacy

Files Structure
text
mindful-browsing/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── popup.html            # Extension popup
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── block.html            # Blocked page replacement
├── block.css             # Blocked page styling
├── block.js              # Blocked page functionality
├── rules.json            # Blocking rules
├── data/
│   └── quotes.json       # Quotes and tips database
└── icons/
├── icon16.png        # Extension icons
├── icon32.png
├── icon48.png
└── icon128.png
Technologies Used
JavaScript ES6+: Modern JavaScript features

CSS3: Advanced styling with glassmorphism effects

HTML5: Semantic markup

Chrome Extension APIs: Storage, declarativeNetRequest, scripting

🎨 Design Philosophy
Gen Z Aesthetics
Glassmorphism: Frosted glass effects with subtle transparency

Gradient Backgrounds: Vibrant, eye-catching color combinations

Modern Typography: Clean, readable fonts with good hierarchy

Micro-interactions: Subtle animations that enhance user experience

Color Palette
Primary: Gradient from #667eea to #764ba2

Accent: #4ecdc4 (teal) and #ff6b6b (coral)

Success: #44a08d (green gradient)

Warning: #ffa500 (orange)

User Experience Principles
Gentle Interruption: Non-aggressive blocking with positive messaging

Choice Architecture: Clear options without overwhelming the user

Progress Visualization: Visual feedback for achievements and growth

Accessibility: High contrast, readable text, and intuitive navigation

📊 Privacy & Security
Data Handling
Local Storage Only: All data stored locally on your device

No Tracking: No user behavior tracking or analytics

No External Requests: All functionality works offline

Minimal Permissions: Only requests necessary permissions

Security Features
Content Security Policy: Prevents code injection attacks

Manifest V3 Compliance: Uses the latest security standards

No Remote Code: All code is bundled with the extension

Transparent Operations: Open source for full transparency

🔧 Development
Prerequisites
Google Chrome browser

Basic knowledge of HTML, CSS, and JavaScript

Chrome Developer Tools

Development Setup
Clone the repository

Make your changes to the source files

Load the extension in Chrome as an unpacked extension

Test your changes

Submit a pull request

Contributing
We welcome contributions! Please:

Fork the repository

Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

🐛 Troubleshooting
Common Issues
Extension not loading:

Make sure Developer mode is enabled

Check the console for error messages

Verify all files are in the correct location

Sites not being blocked:

Check that the extension is enabled

Verify the toggle is turned on in the popup

Make sure the site is in the blocking list

Streak not updating:

Check Chrome's storage permissions

Try resetting the streak and starting over

Ensure you're visiting blocked sites to trigger updates

Getting Help
Check the Issues tab on GitHub

Review the documentation

Contact the development team

📈 Roadmap
Version 1.1
Custom website blocking lists

Scheduling features (block during work hours)

Export/import settings

More meditation options

Version 1.2
Coming Soon!



📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Inspired by digital wellness research and mindfulness practices

Design influenced by modern Gen Z aesthetics and trends

Quotes curated from various spiritual and philosophical traditions

Built with love for healthier digital habits ✨

📞 Contact
GitHub: https://github.com/v9ibhav

Email: v9ibhav@gmail.com

Website: vaibhav.cloud

Building healthier digital habits, one mindful pause at a time. 🧘‍♀️✨