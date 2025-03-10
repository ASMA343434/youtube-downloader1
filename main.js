const modeBtn = document.querySelector('.mode button');
const header = document.querySelector('header');
const headerAnchors = header.querySelectorAll('a');
const home = document.querySelector('.home');

function changeMode() {
    const elementsToAnimate = document.querySelectorAll('.home *');
    
    // Add animation class to all elements
    elementsToAnimate.forEach(element => {
        element.classList.add('mode-transition');
    });

    if (localStorage.getItem('data-theme') === 'dark') {
        localStorage.setItem('data-theme', 'light');
        modeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        localStorage.setItem('data-theme', 'dark');
        modeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    addModeFunc(document.body);
    addModeFunc(modeBtn);
    addModeFunc(header);
    addModeFunc(home);

    // Remove animation class after transition
    setTimeout(() => {
        elementsToAnimate.forEach(element => {
            element.classList.remove('mode-transition');
        });
    }, 500);
}

modeBtn.addEventListener('click', () => {
    changeMode();
    saveSiteState();
});

// window DOMContentLoaded event listener
window.addEventListener("DOMContentLoaded", () => {
    // automatically sets the default theme if not set.
    localStorage.getItem('data-theme') === null ? localStorage.setItem('data-theme', 'dark') : localStorage.setItem('data-theme', localStorage.getItem('data-theme'));


    if (localStorage.getItem('data-theme') === 'dark') {
        modeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        modeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    addModeFunc(document.body);
    addModeFunc(modeBtn);
    addModeFunc(header);
    addModeFunc(home);
})


function addModeFunc(element) {
    if (localStorage.getItem('data-theme') === 'dark') {
        element.classList.add('dark');
        element.classList.remove('light');
    } else {
        element.classList.add('light');
        element.classList.remove('dark');
    }
}

function setActiveLink(anchor) {
    headerAnchors.forEach(a => a.classList.remove('active'));
    anchor.classList.add('active');
    localStorage.setItem('activeLink', anchor.getAttribute('href'));
}

headerAnchors.forEach(anchor => {
    anchor.addEventListener('click', function () {
        setActiveLink(this);
        header.classList.remove('open');
        saveSiteState();
    });
});

// Check for active link in local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeLink = localStorage.getItem('activeLink');
    if (activeLink) {
        headerAnchors.forEach(anchor => {
            if (anchor.getAttribute('href') === activeLink) {
                setActiveLink(anchor);
            }
        });
    }
});

// Loading screen and animation functionality
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Add active class to animated elements with cascading delay
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('active');
            }, 200 * (index + 1)); // Cascade effect with 200ms delay between each element
        });
    }, 1500); // Reduced loading time to 1.5 seconds
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('header');
let isNavVisible = false; // Changed to false by default

menuToggle.addEventListener('click', () => {
    isNavVisible = !isNavVisible;
    headerNav.classList.toggle('show');
    menuToggle.classList.toggle('active');
    menuToggle.innerHTML = isNavVisible ? 
        '<i class="fas fa-times"></i>' : 
        '<i class="fas fa-bars"></i>';
    saveSiteState();
});

// Hide nav when clicking a link
headerAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            headerNav.classList.remove('show');
            menuToggle.classList.remove('active');
            isNavVisible = false;
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            saveSiteState();
        }
    });
});

// Save site state function
function saveSiteState() {
    const siteState = {
        theme: localStorage.getItem('data-theme'),
        activeLink: localStorage.getItem('activeLink'),
        navVisible: isNavVisible,
        menuToggleState: menuToggle.classList.contains('active'),
        headerState: headerNav.classList.contains('show')
    };
    localStorage.setItem('siteState', JSON.stringify(siteState));
}

// Restore site state function
function restoreSiteState() {
    const savedState = localStorage.getItem('siteState');
    if (savedState) {
        const state = JSON.parse(savedState);
        
        // Restore theme
        localStorage.setItem('data-theme', state.theme);
        addModeFunc(document.body);
        addModeFunc(modeBtn);
        addModeFunc(header);
        addModeFunc(home);
        
        // Restore active link
        if (state.activeLink) {
            headerAnchors.forEach(anchor => {
                if (anchor.getAttribute('href') === state.activeLink) {
                    setActiveLink(anchor);
                }
            });
        }

        // Restore mobile menu state
        if (window.innerWidth <= 768) {
            isNavVisible = state.navVisible;
            if (state.menuToggleState) {
                menuToggle.classList.add('active');
            }
            if (state.headerState) {
                headerNav.classList.add('show');
            }
            menuToggle.innerHTML = isNavVisible ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        }
    }
}

// Save state when page is about to unload
window.addEventListener('beforeunload', saveSiteState);

// Restore state when page loads
window.addEventListener('DOMContentLoaded', restoreSiteState);

// Scroll Animation Observer
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-show');
        }
    });
});

// After DOM Content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animation classes to elements
    const infoItems = document.querySelectorAll('.info-item');
    const statItems = document.querySelectorAll('.stat-item');
    const progressItems = document.querySelectorAll('.progress-item');

    infoItems.forEach((item, index) => {
        item.classList.add('scroll-hidden');
        item.classList.add(`delay-${(index % 4) + 1}`);
        observer.observe(item);
    });

    statItems.forEach((item, index) => {
        item.classList.add('scroll-hidden');
        item.classList.add(`delay-${(index % 4) + 1}`);
        observer.observe(item);
    });

    progressItems.forEach((item, index) => {
        item.classList.add('scroll-hidden');
        item.classList.add(`delay-${(index % 4) + 1}`);
        observer.observe(item);
    });
});

// Enhanced Scroll Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Initial Load Animation
function initialLoadAnimation() {
    const elements = document.querySelectorAll('.initial-load');
    elements.forEach((el, index) => {
        el.classList.add(`delay-${(index + 1) * 100}`);
        setTimeout(() => {
            el.classList.add('show');
        }, 100);
    });
}

// Event Listeners
window.addEventListener('scroll', reveal);
window.addEventListener('load', initialLoadAnimation);

// Add animation classes to elements on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal classes to elements
    const infoItems = document.querySelectorAll('.info-item');
    const statItems = document.querySelectorAll('.stat-item');
    const progressItems = document.querySelectorAll('.progress-item');
    
    infoItems.forEach(item => {
        item.classList.add('reveal', 'fade-left', 'initial-load');
    });
    
    statItems.forEach(item => {
        item.classList.add('reveal', 'fade-bottom', 'initial-load');
    });
    
    progressItems.forEach(item => {
        item.classList.add('reveal', 'fade-right', 'initial-load');
    });
    
    // Trigger initial animations
    reveal();
});

// Enhanced Scroll Animation
function handleScroll() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 300;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            // Update navigation
            const currentId = section.getAttribute('id');
            updateNavigation(currentId);
            
            // Animate section content
            section.classList.add('section-active');
            
            // Animate items within section
            animateSectionItems(section);
        }
    });
}

function animateSectionItems(section) {
    const infoItems = section.querySelectorAll('.info-item');
    const statItems = section.querySelectorAll('.stat-item');
    const progressItems = section.querySelectorAll('.progress-item');

    infoItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 100);
    });

    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 200);
    });

    progressItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 300);
    });
}

function updateNavigation(currentId) {
    headerAnchors.forEach(anchor => {
        anchor.classList.remove('active');
        if (anchor.getAttribute('href') === `#${currentId}`) {
            anchor.classList.add('active');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', () => {
    setTimeout(handleScroll, 1000);
});

// Smooth scroll for navigation
headerAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced Scroll Animation with Hide/Show on Scroll Direction
let lastScrollTop = 0;

function handleScrollDirection() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionItems = section.querySelectorAll('.info-item, .stat-item, .progress-item');
        
        if (scrollTop > lastScrollTop) {
            // Scrolling DOWN
            sectionItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        } else {
            // Scrolling UP
            sectionItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(50px)';
                }, index * 100);
            });
        }
    });
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Add scroll event listener for direction
window.addEventListener('scroll', handleScrollDirection);

// Apply initial styles to elements
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.info-item, .stat-item, .progress-item');
    items.forEach(item => {
        item.style.transition = 'all 0.5s ease';
    });
});

let lastScrollY = window.scrollY;
let ticking = false;

function handleScrollAnimation() {
    const sections = document.querySelectorAll('section');
    const currentScrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const isScrollingDown = currentScrollY > lastScrollY;
        
        // Add animation classes
        if (!section.classList.contains('section-animate')) {
            section.classList.add('section-animate');
        }
        
        if (currentScrollY + window.innerHeight > sectionTop 
            && currentScrollY < sectionTop + sectionHeight) {
            // Section is in view
            section.classList.remove('section-hidden-up', 'section-hidden-down');
            section.classList.add('section-visible');
            
            // Animate section content
            const items = section.querySelectorAll('.info-item, .stat-item, .progress-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('scroll-down');
                    item.classList.remove('scroll-up');
                }, index * 100);
            });
        } else {
            // Section is out of view
            if (isScrollingDown) {
                section.classList.add('section-hidden-up');
                section.classList.remove('section-visible', 'section-hidden-down');
            } else {
                section.classList.add('section-hidden-down');
                section.classList.remove('section-visible', 'section-hidden-up');
            }
            
            const items = section.querySelectorAll('.info-item, .stat-item, .progress-item');
            items.forEach(item => {
                item.classList.add('scroll-up');
                item.classList.remove('scroll-down');
            });
        }
    });
    
    lastScrollY = currentScrollY;
    ticking = false;
}

// Optimize scroll performance
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScrollAnimation();
            ticking = false;
        });
        ticking = true;
    }
});

// Initialize elements on page load
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.info-item, .stat-item, .progress-item');
    items.forEach(item => {
        item.classList.add('scroll-item', 'scroll-up');
    });
    
    // Initial animation check
    handleScrollAnimation();
});

// Control Panel Functions
const controlPanel = document.querySelector('.control-panel');
const controlToggle = document.querySelector('.control-toggle');
const fontDecrease = document.querySelector('.font-decrease');
const fontIncrease = document.querySelector('.font-increase');
const fontSizeValue = document.querySelector('.font-size-value');
const primaryColorPicker = document.querySelector('#primary-color');
const animationToggle = document.querySelector('#animation-switch');

// Control Panel Toggle
controlToggle.addEventListener('click', () => {
    controlPanel.classList.toggle('open');
});

// Font Size Control
let baseFontSize = 16;
fontDecrease.addEventListener('click', () => {
    if (baseFontSize > 12) {
        baseFontSize -= 1;
        updateFontSize();
    }
});

fontIncrease.addEventListener('click', () => {
    if (baseFontSize < 24) {
        baseFontSize += 1;
        updateFontSize();
    }
});

function updateFontSize() {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
    fontSizeValue.textContent = baseFontSize;
    localStorage.setItem('fontSize', baseFontSize);
}

// Color Control
primaryColorPicker.addEventListener('change', (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
    localStorage.setItem('primaryColor', e.target.value);
});

// Animation Control
animationToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('reduce-motion', !e.target.checked);
    localStorage.setItem('reduceMotion', !e.target.checked);
});

// Load Saved Settings
document.addEventListener('DOMContentLoaded', () => {
    // Load font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        baseFontSize = parseInt(savedFontSize);
        updateFontSize();
    }

    // Load color
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary-color', savedColor);
        primaryColorPicker.value = savedColor;
    }

    // Load animation preference
    const reduceMotion = localStorage.getItem('reduceMotion') === 'true';
    document.body.classList.toggle('reduce-motion', reduceMotion);
    animationToggle.checked = !reduceMotion;
});

// Enhanced Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.service-card, .info-card, .testimonial-card').forEach(el => {
    scrollObserver.observe(el);
});

// Remove or comment out the slider related code
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.classList.add('active');
    });
});

// تحريك الأرقام في قسم الإنجازات
function animateNumbers() {
    const numbers = document.querySelectorAll('.achievement-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const isMobile = window.innerWidth <= 768;
        const increment = isMobile ? target : target / 50;
        const duration = isMobile ? 1000 : 2000;
        let current = 0;

        const updateNumber = () => {
            if (current < target) {
                current += increment;
                number.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };

        if (isMobile) {
            // على الهاتف، نعرض الرقم مباشرة بدون حركة
            number.textContent = target;
        } else {
            updateNumber();
        }
    });
}

// تشغيل حركة الأرقام عند الوصول للقسم
const aboutSection = document.querySelector('.about-section');
const aboutSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                animateNumbers();
            }
            aboutSectionObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: isMobile ? 0.1 : 0.5
});


aboutSectionObserver.observe(aboutSection);

// Chat functionality
// Duplicate declarations removed

// Toggle chat modal
chatButton.addEventListener('click', () => {
    chatModal.classList.add('active');
    if (chatBody.children.length === 0) {
        addBotMessage(welcomeMessage.text);
    }
});

closeChat.addEventListener('click', () => {
    chatModal.classList.remove('active');
});

// Send message functionality
function sendUserMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = generateResponse(message);
            addBotMessage(response);
        }, 500);
    }
}

sendMessage.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendUserMessage();
    }
});

// Add message to chat
function addMessage(text, isUser = false) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text) {
    addMessage(text, false);
}

// Generate bot response
function generateResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('هاتف') || message.includes('اتصال') || message.includes('رقم')) {
        return `يمكنك الاتصال بنا على الرقم: ${welcomeMessage.contactInfo.phone}`;
    }
    else if (message.includes('واتس') || message.includes('واتساب') || message.includes('whatsapp')) {
        return `يمكنك التواصل معنا على WhatsApp: ${welcomeMessage.contactInfo.whatsapp}`;
    }
    else if (message.includes('ايميل') || message.includes('بريد')) {
        return `يمكنك مراسلتنا على البريد الإلكتروني: ${welcomeMessage.contactInfo.email}`;
    }
    else if (message.includes('تسجيل') || message.includes('دخول')) {
        return 'يمكنك تسجيل الدخول من خلال الزر الموجود في الصفحة الرئيسية';
    }
    else {
        return 'يمكنك الاستفسار عن:\n- رقم الهاتف للاتصال\n- رقم الواتساب\n- البريد الإلكتروني\n- تسجيل الدخول';
    }
}

// Close chat when clicking outside
document.addEventListener('click', (e) => {
    if (!chatModal.contains(e.target) && !chatButton.contains(e.target)) {
        chatModal.classList.remove('active');
    }
});

// Testimonials Slider Navigation
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cardWidth = 330; // card width + gap

    function slideNext() {
        slider.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    }

    function slidePrev() {
        slider.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', slidePrev);
    nextBtn.addEventListener('click', slideNext);
});

// تحسين وظائف سلايدر الطلاب
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cardWidth = 330; // عرض الكارد + المسافة
    let isAnimating = false;

    function slideNext() {
        if (isAnimating) return;
        isAnimating = true;
        
        const firstCard = slider.firstElementChild;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(${cardWidth}px)`;

        setTimeout(() => {
            slider.style.transition = 'none';
            slider.appendChild(firstCard);
            slider.style.transform = 'translateX(0)';
            isAnimating = false;
        }, 500);
    }

    function slidePrev() {
        if (isAnimating) return;
        isAnimating = true;
        
        const lastCard = slider.lastElementChild;
        slider.style.transition = 'none';
        slider.prepend(lastCard);
        slider.style.transform = `translateX(${cardWidth}px)`;

        requestAnimationFrame(() => {
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = 'translateX(0)';
            setTimeout(() => isAnimating = false, 500);
        });
    }

    prevBtn.addEventListener('click', slidePrev);
    nextBtn.addEventListener('click', slideNext);

    // التنقل باستخدام لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') slideNext();
        if (e.key === 'ArrowRight') slidePrev();
    });

     let autoSlide = setInterval(slideNext, 5000);
     slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
     slider.addEventListener('mouseleave', () => {
         autoSlide = setInterval(slideNext, 5000);
     });
});

// Chat functionality
const chatButton = document.getElementById('chatButton');
const chatModal = document.getElementById('chatModal');
const closeChat = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');

// Initial welcome message
const welcomeMessage = {
    text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    contactInfo: {
        phone: '+201126130559',
        whatsapp: '+201155115584',
        email: 'mohammed.teacher@example.com'
    }
};

// Toggle chat modal
chatButton.addEventListener('click', () => {
    chatModal.classList.add('active');
    if (chatBody.children.length === 0) {
        addBotMessage(welcomeMessage.text);
    }
});

closeChat.addEventListener('click', () => {
    chatModal.classList.remove('active');
});

// Send message functionality
function sendUserMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = generateResponse(message);
            addBotMessage(response);
        }, 500);
    }
}

sendMessage.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendUserMessage();
    }
});

// Add message to chat
function addMessage(text, isUser = false) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text) {
    addMessage(text, false);
}

// Generate bot response
function generateResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('هاتف') || message.includes('اتصال') || message.includes('رقم')) {
        return `يمكنك الاتصال بنا على الرقم: ${welcomeMessage.contactInfo.phone}`;
    }
    else if (message.includes('واتس') || message.includes('واتساب') || message.includes('whatsapp')) {
        return `يمكنك التواصل معنا على WhatsApp: ${welcomeMessage.contactInfo.whatsapp}`;
    }
    else if (message.includes('ايميل') || message.includes('بريد')) {
        return `يمكنك مراسلتنا على البريد الإلكتروني: ${welcomeMessage.contactInfo.email}`;
    }
    else if (message.includes('تسجيل') || message.includes('دخول')) {
        return 'يمكنك تسجيل الدخول من خلال الزر الموجود في الصفحة الرئيسية';
    }
    else {
        return 'يمكنك الاستفسار عن:\n- رقم الهاتف للاتصال\n- رقم الواتساب\n- البريد الإلكتروني\n- تسجيل الدخول';
    }
}

// Close chat when clicking outside
document.addEventListener('click', (e) => {
    if (!chatModal.contains(e.target) && !chatButton.contains(e.target)) {
        chatModal.classList.remove('active');
    }
});

// تحسين وظائف سلايدر الطلاب
function initializeTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideInterval;

    // إضافة أزرار التنقل
    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    controls.innerHTML = `
        <button class="nav-btn prev-btn"><i class="fas fa-arrow-left"></i></button>
        <button class="nav-btn next-btn"><i class="fas fa-arrow-right"></i></button>
    `;
    slider.parentElement.appendChild(controls);

    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    function updateSlider() {
        slider.style.transform = `translateX(${-currentIndex * 100}%)`;
        
        // تحديث الكارد النشط
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // تنقل كل 5 ثواني
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // إضافة مستمعي الأحداث للأزرار
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide(); // إعادة تشغيل التنقل التلقائي
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide(); // إعادة تشغيل التنقل التلقائي
    });

    // التنقل باستخدام لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
        if (e.key === 'ArrowRight') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });

    // إيقاف التنقل التلقائي عند تحريك الماوس فوق السلايدر
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // بدء التنقل التلقائي
    startAutoSlide();
}

// تشغيل السلايدر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeTestimonialsSlider);

// ...existing code...

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function moveSlider(direction) {
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % cards.length;
        } else {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        }
        
        const offset = -currentIndex * 100;
        slider.style.transform = `translateX(${offset}%)`;

        // تحديث حالة الكروت
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
    }

    // إضافة مستمعي الأحداث للأزرار
    prevBtn.addEventListener('click', () => moveSlider('prev'));
    nextBtn.addEventListener('click', () => moveSlider('next'));

    // التنقل التلقائي كل 5 ثواني
    setInterval(() => moveSlider('next'), 5000);

    // وقف التنقل التلقائي عند تحريك الماوس فوق السلايدر
    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => moveSlider('next'), 5000);
    });
});

// ...existing code...

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.testimonials-slider');
    const cards = slider.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateSlider() {
        cards.forEach((card, index) => {
            card.style.transform = `translateX(${-currentIndex * 100}%)`;
            card.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    // تشغيل التنقل التلقائي
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // تغيير كل 5 ثواني
    }

    // إيقاف التنقل التلقائي
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // أزرار التنقل
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide(); // إعادة تشغيل العد التلقائي
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide(); // إعادة تشغيل العد التلقائي
    });

    // إيقاف التنقل التلقائي عند تحريك الماوس فوق السلايدر
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // بدء التنقل التلقائي
    startAutoSlide();
    updateSlider();
});

// ...existing code...