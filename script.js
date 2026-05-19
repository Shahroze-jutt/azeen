// ===================================
// Retell Widget Integration - FIXED
// ===================================

// Function to open Retell widget with retries
function openRetellWidget() {
    // Try multiple approaches to find and open the widget
    
    // Approach 1: Use Retell's global API if available
    if (window.retellWidget && typeof window.retellWidget.open === 'function') {
        window.retellWidget.open();
        return;
    }
    
    // Approach 2: Try to click the floating button that Retell creates
    const fabButtons = [
        document.querySelector('[data-testid="retell-fab"]'),
        document.querySelector('button[aria-label*="Bookify"]'),
        document.querySelector('button[aria-label*="Chat"]'),
        document.querySelector('button[aria-label*="support"]'),
        document.querySelector('[class*="retell"][class*="fab"]'),
        Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Chat') || 
            btn.textContent.includes('Bookify') ||
            btn.getAttribute('aria-label')?.includes('Chat')
        )
    ];
    
    for (const btn of fabButtons) {
        if (btn) {
            btn.click();
            return;
        }
    }
    
    // Approach 3: If widget hasn't loaded yet, wait and retry
    if (!window.retellWidgetAttempts) {
        window.retellWidgetAttempts = 0;
    }
    
    if (window.retellWidgetAttempts < 3) {
        window.retellWidgetAttempts++;
        console.log('Retell widget not found, retrying... (attempt ' + window.retellWidgetAttempts + ')');
        setTimeout(() => openRetellWidget(), 500);
        return;
    }
    
    // Fallback: Show message if nothing works
    console.error('Could not open Retell widget. Make sure your Retell credentials are correct in index.html');
    alert('Chat widget is loading. Please wait a moment and try again, or check the browser console for errors.');
}

// Attach to button when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const demoButton = document.getElementById('openRetellChat');
    if (demoButton) {
        demoButton.addEventListener('click', (e) => {
            e.preventDefault();
            openRetellWidget();
        });
    }
});

// Also handle if button is clicked before DOMContentLoaded
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'openRetellChat') {
        e.preventDefault();
        openRetellWidget();
    }
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default for hash links, not external links
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// Chat Widget Functionality
// ===================================
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Predefined bot responses for demo
const botResponses = {
    default: [
        "I'd be happy to help you with that! Could you provide me with more details?",
        "Great! Let me help you schedule that. What date works best for you?",
        "Perfect! I can assist with booking. What time would you prefer?",
    ],
    greeting: [
        "Hello! I'm here to help you book appointments. What would you like to schedule today?",
        "Hi there! Ready to help you with your booking. What can I assist you with?",
    ],
    appointment: [
        "Excellent! I can help schedule an appointment. What service are you looking for?",
        "I'd be happy to book that for you. Which day works best for you?",
        "Great choice! Let me check availability. How many people will be attending?",
    ],
    table: [
        "Perfect! I can reserve a table for you. What date and time would you like?",
        "I'd love to help with your reservation. For how many guests?",
    ],
    thanks: [
        "You're welcome! Is there anything else I can help you with?",
        "My pleasure! Feel free to ask if you need anything else.",
    ]
};

// Add message to chat
function addMessage(content, isBot = true) {
    if (!chatMessages) return; // Exit if no chat container
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get bot response based on user input
function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
        return botResponses.appointment[Math.floor(Math.random() * botResponses.appointment.length)];
    } else if (lowerMessage.includes('table') || lowerMessage.includes('reservation') || lowerMessage.includes('reserve')) {
        return botResponses.table[Math.floor(Math.random() * botResponses.table.length)];
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return botResponses.thanks[Math.floor(Math.random() * botResponses.thanks.length)];
    } else {
        return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
}

// Send message function
function sendMessage() {
    if (!chatInput || !chatMessages) return; // Exit if no chat elements
    
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, false);
    chatInput.value = '';
    
    // Simulate bot typing delay
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, true);
    }, 800);
}

// Event listeners for sending messages
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Suggestion chips functionality
if (suggestionChips && suggestionChips.length > 0) {
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const message = chip.getAttribute('data-message');
            if (chatInput) {
                chatInput.value = message;
                sendMessage();
            }
        });
    });
}

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.step-card, .pricing-card, .demo-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Header Scroll Effect
// ===================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (!header) return;
    
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.8)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// CTA Button Interactions
// ===================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', (e) => {
        // Don't apply ripple if it's a link (has href)
        if (button.tagName === 'A') return;
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Stats Counter Animation
// ===================================
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-number');
            stats.forEach((stat, index) => {
                const text = stat.textContent;
                if (text.includes('%')) {
                    animateCounter(stat, parseInt(text), '%');
                } else if (text.includes('S')) {
                    animateCounter(stat, parseInt(text), 'S');
                } else if (text.includes('+')) {
                    animateCounter(stat, parseInt(text), '+');
                } else if (text.includes('/')) {
                    stat.textContent = '24/7';
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===================================
// Mobile Menu Toggle
// ===================================
const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';
    
    if (window.innerWidth <= 768) {
        menuButton.style.display = 'block';
    }
};

window.addEventListener('resize', () => {
    createMobileMenu();
});

// ===================================
// Pricing Plan Selection Highlight
// ===================================
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 60px rgba(0, 255, 148, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
    });
});

// ===================================
// Console Messages
// ===================================
console.log('%c🤖 Bookify', 'font-size: 24px; font-weight: bold; color: #00ff94;');
console.log('%cYour 24/7 Booking Agent Never Sleeps', 'font-size: 14px; color: #999;');
console.log('%cBuilt with ❤️ and AI', 'font-size: 12px; color: #00ff94;');

// Debug: Log Retell widget status
console.log('Retell Widget Status:', {
    scriptLoaded: !!document.getElementById('retell-widget'),
    windowRetellWidget: !!window.retellWidget,
    timestamp: new Date().toLocaleTimeString()
});

// ===================================
// Performance Optimization
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
}

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bookify website loaded successfully!');
    console.log('Retell Widget Status on Load:', {
        scriptLoaded: !!document.getElementById('retell-widget'),
        windowRetellWidget: !!window.retellWidget,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any additional features
    createMobileMenu();
});
