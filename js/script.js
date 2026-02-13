document.addEventListener('DOMContentLoaded', () => {
    createSparkles();
    startFallingEmojis();

    // Auto-scroll for memory pages
    if (window.location.pathname.includes('memory')) {
        startAutoScroll();
    } // added here to ensure it runs

    // Music Overlay Logic
    const overlay = document.getElementById('music-overlay');
    const audio = document.getElementById('bg-music');

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (audio) {
                audio.play().catch(console.error);
                localStorage.setItem('musicPlaying', 'true');
            }
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        });
    } else {
        // If no overlay (inner pages), try to autoplay if allowed
        if (audio && localStorage.getItem('musicPlaying') === 'true') {
            audio.play().catch(console.error);
        }
    }

    adjustLandscapeImages();
});

function startFallingEmojis() {
    const emojis = ['🌹', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💗', '💓', '💞', '💕', '⭐', '✨'];
    const container = document.body; // or a specific container if needed

    // Create a new emoji every 300ms
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.classList.add('falling-emoji');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Random horizontal position
        emoji.style.left = Math.random() * 100 + 'vw';

        // Random animation duration between 3s and 8s
        const duration = Math.random() * 5 + 3;
        emoji.style.animationDuration = duration + 's';

        // Random size
        const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
        emoji.style.fontSize = size + 'rem';

        container.appendChild(emoji);

        // Remove element after animation finishes to prevent memory leaks
        setTimeout(() => {
            emoji.remove();
        }, duration * 1000);
    }, 300);
}

function createSparkles() {
    const container = document.getElementById('sparkles-container');
    const sparkleCount = 50;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random animation delay and duration
        const delay = Math.random() * 2;
        const duration = 1 + Math.random() * 2;
        const size = 2 + Math.random() * 4;

        sparkle.style.left = `${x}%`;
        sparkle.style.top = `${y}%`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDelay = `${delay}s`;
        sparkle.style.animationDuration = `${duration}s`;

        // Random color tint
        if (Math.random() > 0.5) {
            sparkle.style.background = '#ffcad4'; // Light pink
        }

        container.appendChild(sparkle);
    }
}

// Function to handle entering the site (start music and transition)
function enterSite(e) {
    if (e) e.preventDefault();
    const targetUrl = e ? e.target.href : 'pages/memory1.html';

    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.play().catch(console.error);
        localStorage.setItem('musicPlaying', 'true');
    }

    // Add a transition effect (fade out landing page content?)
    const landingPage = document.querySelector('.landing-page');
    if (landingPage) {
        landingPage.style.transition = 'opacity 1s';
        landingPage.style.opacity = '0';
    }

    // Delay navigation to allow music to start and transition to happen
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 1000);
}

// Auto-scroll for memory pages
document.addEventListener('DOMContentLoaded', () => {
    // Check if auto-scroll is disabled for this specific page
    if (window.location.pathname.includes('memory') && typeof autoScrollDisabled === 'undefined') {
        startAutoScroll();
    }
});

function startAutoScroll() {
    let scrollInterval;
    const scrollSpeed = 1; // px per tick
    const scrollDelay = 50; // ms per tick

    // Slight delay before starting auto-scroll
    setTimeout(() => {
        scrollInterval = setInterval(() => {
            // Stop scrolling if at the bottom
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                clearInterval(scrollInterval);
                return;
            }
            window.scrollBy(0, scrollSpeed);
        }, scrollDelay);
    }, 2000);

    // Continuous scroll: removed interaction listeners that stopped it.

    adjustLandscapeImages();
}

function adjustLandscapeImages() {
    const images = document.querySelectorAll('.diary-entry img');
    images.forEach(img => {
        // Check if image is already loaded
        if (img.complete) {
            checkOrientation(img);
        } else {
            // Wait for load
            img.onload = () => checkOrientation(img);
        }
    });
}

function checkOrientation(img) {
    // If width > height, it's landscape
    if (img.naturalWidth > img.naturalHeight) {
        const entry = img.closest('.diary-entry');
        if (entry) {
            entry.classList.add('landscape');
        }
    }
}

// Proposal Page Logic
let noTexts = ["Please?", "Please think again", "Are you really sure?", "Have a heart!", "Don't do this!", "I'm sad now :(", "You can't catch me!"];
let noClickCount = 0;

function moveButton(btn) {
    // Change text first to get accurate new dimensions
    if (noClickCount < noTexts.length) {
        btn.innerText = noTexts[noClickCount];
        noClickCount++;
    } else {
        btn.innerText = noTexts[Math.floor(Math.random() * noTexts.length)];
    }

    // Wait a tiny bit for the button to resize with new text
    setTimeout(() => {
        const yesBtn = document.querySelector('.yes-btn');
        const yesBtnRect = yesBtn.getBoundingClientRect();

        // Get current button dimensions after text change
        const btnRect = btn.getBoundingClientRect();
        const btnWidth = btnRect.width;
        const btnHeight = btnRect.height;

        // Use viewport dimensions for boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const padding = 20;
        let attempts = 0;
        let newX, newY;
        let isValidPosition = false;

        while (!isValidPosition && attempts < 100) {
            // Generate random position within viewport bounds
            newX = padding + Math.random() * (viewportWidth - btnWidth - 2 * padding);
            newY = padding + Math.random() * (viewportHeight - btnHeight - 2 * padding);

            // Check if position overlaps with Yes button (with padding)
            const overlapMargin = 10;
            const noOverlap = (
                newX + btnWidth + overlapMargin < yesBtnRect.left ||
                newX > yesBtnRect.right + overlapMargin ||
                newY + btnHeight + overlapMargin < yesBtnRect.top ||
                newY > yesBtnRect.bottom + overlapMargin
            );

            // Check if position is fully within viewport
            const withinBounds = (
                newX >= padding &&
                newY >= padding &&
                newX + btnWidth <= viewportWidth - padding &&
                newY + btnHeight <= viewportHeight - padding
            );

            if (noOverlap && withinBounds) {
                isValidPosition = true;
            }

            attempts++;
        }

        // Apply the position
        btn.style.position = 'fixed'; // Use fixed to position relative to viewport
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
    }, 10);
}

function sayYes() {
    const successOverlay = document.getElementById('success-message');
    if (successOverlay) {
        successOverlay.classList.add('visible');
        createHeartExplosion();
        // Set flag in localStorage that proposal was accepted
        localStorage.setItem('proposalAccepted', 'true');
    }
}

function createHeartExplosion() {
    for (let i = 0; i < 100; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = (Math.random() * 30 + 10) + 'px';
        heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        heart.style.transition = 'all 1s ease-out';
        heart.style.zIndex = 10001;
        document.body.appendChild(heart);

        setTimeout(() => {
            const destX = (Math.random() - 0.5) * window.innerWidth;
            const destY = (Math.random() - 0.5) * window.innerHeight;
            heart.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = 0;
        }, 10);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}
