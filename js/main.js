// Carousel functionality
let currentIndex = 0;
let isAnimating = false;
let autoPlayInterval;
const itemsPerView = 4; // Number of items visible at once

function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const itemWidth = items[0].offsetWidth + 32; // 32px is the gap between items
    
    // Clone first and last items for infinite scroll
    const firstItems = Array.from(items).slice(0, itemsPerView);
    const lastItems = Array.from(items).slice(-itemsPerView);
    
    lastItems.forEach(item => {
        const clone = item.cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    });
    
    firstItems.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Set initial position
    currentIndex = itemsPerView;
    updateCarouselPosition();
    
    // Start auto-play
    startAutoPlay();
    
    // Update button states
    updateButtonStates();
}

function updateCarouselPosition() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const itemWidth = items[0].offsetWidth + 32;
    
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

function moveCarousel(direction) {
    if (isAnimating) return;
    
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const itemWidth = items[0].offsetWidth + 32;
    
    isAnimating = true;
    currentIndex += direction;
    
    // Smooth transition
    track.style.transition = 'transform 0.5s ease';
    updateCarouselPosition();
    
    // Check if we need to reset position
    setTimeout(() => {
        const totalItems = items.length;
        
        if (currentIndex <= 0) {
            track.style.transition = 'none';
            currentIndex = totalItems - (itemsPerView * 2);
            updateCarouselPosition();
        } else if (currentIndex >= totalItems - itemsPerView) {
            track.style.transition = 'none';
            currentIndex = itemsPerView;
            updateCarouselPosition();
        }
        
        isAnimating = false;
        updateButtonStates();
    }, 500);
}

function updateButtonStates() {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const items = document.querySelectorAll('.carousel-item');
    
    // Disable buttons during animation
    if (isAnimating) {
        prevButton.disabled = true;
        nextButton.disabled = true;
    } else {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Move every 5 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            moveCarousel(1); // Swipe left
        } else if (touchEndX > touchStartX + swipeThreshold) {
            moveCarousel(-1); // Swipe right
        }
    }
});

// Menu functions
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const body = document.body;

    menuOverlay.classList.toggle('active');
    menuBackdrop.classList.toggle('active');
    body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const body = document.body;

    menuOverlay.classList.remove('active');
    menuBackdrop.classList.remove('active');
    body.style.overflow = '';
}

// Add keyboard support for menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

// Initialize menu functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to menu links to close menu when clicked
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
});

// Favorites functionality
document.addEventListener('DOMContentLoaded', function() {
    const removeButtons = document.querySelectorAll('.remove-button');
    if (removeButtons) {
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookCard = this.closest('.book-card');
                if (bookCard) {
                    bookCard.remove();
                }
            });
        });
    }
});

// Funções do Carrossel
let currentPosition = 0;
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const itemWidth = items[0].offsetWidth;
const gap = parseInt(getComputedStyle(items[0]).marginRight);
const initialItemsPerView = Math.floor(window.innerWidth / (itemWidth + gap));
const maxPosition = items.length - initialItemsPerView;

function updateCarouselButtons() {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    prevButton.disabled = currentPosition === 0;
    nextButton.disabled = currentPosition >= maxPosition;

    prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
    nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
}

function moveCarousel(direction) {
    const newPosition = currentPosition + direction;
    
    if (newPosition >= 0 && newPosition <= maxPosition) {
        currentPosition = newPosition;
        const offset = -(currentPosition * (itemWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        updateCarouselButtons();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateCarouselButtons();

    // Ajuste do carrossel em redimensionamento
    window.addEventListener('resize', () => {
        const newItemWidth = items[0].offsetWidth;
        const newGap = parseInt(getComputedStyle(items[0]).marginRight);
        const newItemsPerView = Math.floor(window.innerWidth / (newItemWidth + newGap));
        const newMaxPosition = items.length - newItemsPerView;

        if (currentPosition > newMaxPosition) {
            currentPosition = newMaxPosition;
            const offset = -(currentPosition * (newItemWidth + newGap));
            track.style.transform = `translateX(${offset}px)`;
        }

        updateCarouselButtons();
    });

    // Fechar menu ao clicar em um link
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}); 