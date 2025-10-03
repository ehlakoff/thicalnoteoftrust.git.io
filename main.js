// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('enot-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle buttons
    const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(toggle => {
        if (savedTheme === 'dark') {
            toggle.classList.add('active');
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('enot-theme', newTheme);
    
    // Update all toggle buttons
    const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(toggle => {
        toggle.classList.toggle('active', newTheme === 'dark');
    });
}

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

// Mobile Menu
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.remove('active');
}

// Popup Functions
const addresses = {
    contract: {
        title: "Контракт ENOT",
        address: "EQC0-zpECP910bW-FD2moGSAgwHaC9rqiNH3G4vBBkpq0N9O",
        explorer: "https://tonscan.org/address/EQC0-zpECP910bW-FD2moGSAgwHaC9rqiNH3G4vBBkpq0N9O"
    },
    liquidity: {
        title: "Блокировка ликвидности",
        address: "EQD1234567890abcdefghijklmnopqrstuvwxyzABCDEF",
        explorer: "https://tonscan.org/address/EQD1234567890abcdefghijklmnopqrstuvwxyzABCDEF"
    },
    creator: {
        title: "Токены создателя",
        address: "EQC0-zpECP910bW-FD2moGSAgwHaC9rqiNH3G4vBBkpq0N9O",
        explorer: "https://tonraffles.app/lock/EQC0-zpECP910bW-FD2moGSAgwHaC9rqiNH3G4vBBkpq0N9O"
    },
    burn: {
        title: "Адрес для сжигания",
        address: "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ",
        explorer: "https://tonscan.org/address/UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ"
    }
};

function openPopup(type) {
    const data = addresses[type];
    if (!data) return;

    document.getElementById('popupTitle').textContent = data.title;
    document.getElementById('popupAddress').textContent = data.address;
    document.getElementById('popupLink').href = data.explorer;
    document.getElementById('popup').classList.add('active');
}

function closePopup() {
    document.getElementById('popup').classList.remove('active');
}

function copyAddress() {
    const address = document.getElementById('popupAddress').textContent;
    
    // Fallback method for copying to clipboard
    const textArea = document.createElement('textarea');
    textArea.value = address;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        // Show success message
        showNotification('Адрес скопирован в буфер обмена');
    } catch (err) {
        console.error('Failed to copy: ', err);
        // Fallback: show address for manual copy
        showNotification('Не удалось скопировать. Адрес: ' + address);
    }
    
    document.body.removeChild(textArea);
}

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--black);
        color: var(--white);
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 3000;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close popup on overlay click
document.getElementById('popup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Theme toggle event listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('mobileThemeToggle').addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNav = document.getElementById('mobileNav');
        const mobileBtn = document.getElementById('mobileMenuBtn');
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Add active class to nav links on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});