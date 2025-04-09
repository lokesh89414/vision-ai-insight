
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all common functionality
    initNavigation();
    initAccessibilityFeatures();
    initLanguageSelector();
    
    // Check which page we're on and initialize page-specific functionality
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('index') || currentPath.endsWith('/')) {
        initHomePage();
    }
});

// Navigation functionality
function initNavigation() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav && mainNav.classList.contains('active') && !event.target.closest('.main-nav') && !event.target.closest('.mobile-nav-toggle')) {
            mainNav.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Add scroll event listener for header styling
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backgroundColor = 'var(--background-light)';
        }
    });
}

// Accessibility features
function initAccessibilityFeatures() {
    const speechToTextBtn = document.getElementById('speech-to-text-btn');
    const languageSelectorBtn = document.getElementById('language-selector-btn');
    
    // Initialize speech recognition if available
    if (speechToTextBtn) {
        speechToTextBtn.addEventListener('click', function() {
            // Check if browser supports speech recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                startSpeechRecognition();
            } else {
                alert('Sorry, your browser does not support speech recognition.');
            }
        });
    }
    
    // Initialize language selector
    if (languageSelectorBtn) {
        const languageSelector = document.querySelector('.language-selector');
        const closeBtn = languageSelector.querySelector('.close-btn');
        
        languageSelectorBtn.addEventListener('click', function() {
            languageSelector.classList.add('active');
        });
        
        closeBtn.addEventListener('click', function() {
            languageSelector.classList.remove('active');
        });
        
        // Close language selector when clicking outside
        document.addEventListener('click', function(event) {
            if (languageSelector.classList.contains('active') && 
                !event.target.closest('.language-selector-content') && 
                !event.target.closest('#language-selector-btn')) {
                languageSelector.classList.remove('active');
            }
        });
    }
}

// Speech Recognition functionality
function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.start();
    
    // Create visual feedback
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'speech-feedback';
    feedbackElement.innerHTML = '<div class="speech-feedback-inner"><i class="fas fa-microphone-alt fa-pulse"></i><p>Listening...</p></div>';
    document.body.appendChild(feedbackElement);
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        // Based on transcript, navigate or perform actions
        processSpeechCommand(transcript.toLowerCase());
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        feedbackElement.remove();
    };
    
    recognition.onend = function() {
        feedbackElement.remove();
    };
}

function processSpeechCommand(command) {
    // Navigation commands
    if (command.includes('go to home') || command.includes('home page')) {
        window.location.href = 'index.html';
    } else if (command.includes('go to prediction') || command.includes('diagnose') || command.includes('diagnosis')) {
        window.location.href = 'prediction.html';
    } else if (command.includes('about disease') || command.includes('disease information')) {
        window.location.href = 'about-disease.html';
    }
    
    // Scroll commands
    if (command.includes('scroll down')) {
        window.scrollBy(0, 400);
    } else if (command.includes('scroll up')) {
        window.scrollBy(0, -400);
    } else if (command.includes('top of page') || command.includes('go to top')) {
        window.scrollTo(0, 0);
    }
}

// Language selector functionality
function initLanguageSelector() {
    const languageOptions = document.querySelectorAll('.language-selector li');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            
            // Remove active class from all options
            languageOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Set language
            changeLanguage(language);
            
            // Close language selector
            document.querySelector('.language-selector').classList.remove('active');
        });
    });
}

function changeLanguage(language) {
    console.log('Changing language to:', language);
    // In a real implementation, this would load translated content
    // This is a simple mockup that could be expanded with actual translations
    
    const translations = {
        'en': {
            'nav_home': 'Home',
            'nav_prediction': 'Prediction',
            'nav_about': 'About Disease'
        },
        'es': {
            'nav_home': 'Inicio',
            'nav_prediction': 'Predicción',
            'nav_about': 'Sobre Enfermedades'
        },
        'fr': {
            'nav_home': 'Accueil',
            'nav_prediction': 'Prédiction',
            'nav_about': 'À propos des maladies'
        },
        'de': {
            'nav_home': 'Startseite',
            'nav_prediction': 'Vorhersage',
            'nav_about': 'Über Krankheiten'
        },
        'zh': {
            'nav_home': '首页',
            'nav_prediction': '预测',
            'nav_about': '关于疾病'
        }
    };
    
    // Only implement simple navigation translation as proof of concept
    if (translations[language]) {
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks[0].textContent = translations[language].nav_home;
        navLinks[1].textContent = translations[language].nav_prediction;
        navLinks[2].textContent = translations[language].nav_about;
    }
}

// Home page specific functionality
function initHomePage() {
    initFeatureAnimations();
    initLiveStatsCounter();
    initTestimonialSlider();
}

// Animate features on scroll
function initFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const delay = card.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                    
                    // Stop observing once animation is triggered
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.2
        });
        
        featureCards.forEach(card => {
            observer.observe(card);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        featureCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
}

// Animate stats counters
function initLiveStatsCounter() {
    const statElements = {
        'analyzed-cases': { target: 12567, current: 0, increment: 125 },
        'accuracy-rate': { target: 97, current: 0, increment: 1, suffix: '%' },
        'conditions-detected': { target: 8, current: 0, increment: 1 },
        'doctors-connected': { target: 345, current: 0, increment: 5 }
    };
    
    // Animate each stat counter
    for (const id in statElements) {
        const element = document.getElementById(id);
        if (element) {
            animateCounter(element, statElements[id]);
        }
    }
}

function animateCounter(element, config) {
    const duration = 2000; // Animation duration in ms
    const frameDuration = 1000 / 60; // Duration of each frame at 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    function updateCounter() {
        const progress = frame / totalFrames;
        const currentValue = Math.round(config.current + progress * (config.target - config.current));
        
        element.textContent = config.suffix ? currentValue + config.suffix : currentValue.toLocaleString();
        
        if (frame < totalFrames) {
            frame++;
            requestAnimationFrame(updateCounter);
        }
    }
    
    // Start animation when element is in viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });
        
        observer.observe(element);
    } else {
        // Fallback
        updateCounter();
    }
}

// Initialize testimonial slider
function initTestimonialSlider() {
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots');
    
    if (!testimonialTrack || !testimonials.length) return;
    
    let currentIndex = 0;
    const testimonialCount = testimonials.length;
    
    // Create dots for each testimonial
    for (let i = 0; i < testimonialCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
        
        // Add click event to each dot
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
        });
    }
    
    // Add event listeners for navigation buttons
    prevBtn.addEventListener('click', function() {
        goToSlide((currentIndex - 1 + testimonialCount) % testimonialCount);
    });
    
    nextBtn.addEventListener('click', function() {
        goToSlide((currentIndex + 1) % testimonialCount);
    });
    
    // Function to go to a specific slide
    function goToSlide(index) {
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active dot
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Auto-advance the slider
    let slideInterval = setInterval(() => {
        goToSlide((currentIndex + 1) % testimonialCount);
    }, 5000);
    
    // Pause auto-advance on hover
    testimonialTrack.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    testimonialTrack.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            goToSlide((currentIndex + 1) % testimonialCount);
        }, 5000);
    });
    
    // Initialize touch swiping for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    testimonialTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            goToSlide((currentIndex + 1) % testimonialCount);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            goToSlide((currentIndex - 1 + testimonialCount) % testimonialCount);
        }
    }
}
