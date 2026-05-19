// ===================================
// Retell Widget Integration
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const openRetellBtn = document.getElementById('openRetellChat');
    
    if (openRetellBtn) {
        openRetellBtn.addEventListener('click', () => {
            // Trigger Retell widget to open
            // The Retell widget exposes a global object that controls it
            if (window.retellWidget) {
                window.retellWidget.openWidget();
            } else {
                // Fallback: try to click the FAB button that Retell creates
                const retellFAB = document.querySelector('[data-testid="retell-fab"]') || 
                                 document.querySelector('button[aria-label*="Bookify"]') ||
                                 document.querySelector('button[aria-label*="support"]');
                if (retellFAB) {
                    retellFAB.click();
                }
            }
        });
    }
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const message = chip.getAttribute('data-message');
        chatInput.value = message;
        sendMessage();
    });
});

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
// Mobile Menu Toggle (if needed in future)
// ===================================
const createMobileMenu = () => {
    // This can be expanded for mobile hamburger menu
    const nav = document.querySelector('.nav');
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
// Console Easter Egg
// ===================================
console.log('%c🤖 Bookify', 'font-size: 24px; font-weight: bold; color: #00ff94;');
console.log('%cYour 24/7 Booking Agent Never Sleeps', 'font-size: 14px; color: #999;');
console.log('%cBuilt with ❤️ and AI', 'font-size: 12px; color: #00ff94;');

// ===================================
// Performance Optimization
// ===================================
// Lazy load images if any are added
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Preload critical fonts
const preloadFont = (url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
};

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bookify website loaded successfully!');
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any additional features
    createMobileMenu();
});
