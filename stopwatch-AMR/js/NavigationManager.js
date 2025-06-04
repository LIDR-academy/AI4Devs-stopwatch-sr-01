/**
 * NavigationManager class
 * Single Responsibility: Manages page navigation and transitions
 * Open/Closed Principle: Easy to extend with new page types
 */
export class NavigationManager {
    constructor() {
        this.currentPage = 'home-page';
        this.pages = {
            'home-page': document.getElementById('home-page'),
            'stopwatch-page': document.getElementById('stopwatch-page'),
            'timer-page': document.getElementById('timer-page')
        };
    }

    /**
     * Navigate to a specific page with smooth transition
     * @param {string} targetPageId - ID of the target page
     * @param {string} direction - 'left' or 'right' for slide direction
     */
    navigateTo(targetPageId, direction = 'right') {
        if (targetPageId === this.currentPage) {
            return;
        }

        const currentPageElement = this.pages[this.currentPage];
        const targetPageElement = this.pages[targetPageId];

        if (!currentPageElement || !targetPageElement) {
            console.error('Page not found:', targetPageId);
            return;
        }

        // Start transition
        this.startTransition(currentPageElement, targetPageElement, direction);

        // Update current page
        this.currentPage = targetPageId;
    }

    /**
     * Start the slide transition between pages
     * @param {HTMLElement} currentPage 
     * @param {HTMLElement} targetPage 
     * @param {string} direction 
     */
    startTransition(currentPage, targetPage, direction) {
        // Prepare target page for animation
        targetPage.classList.remove('active');
        targetPage.style.display = 'block';
        
        if (direction === 'right') {
            targetPage.style.transform = 'translateX(100%)';
        } else {
            targetPage.style.transform = 'translateX(-100%)';
        }

        // Force reflow
        targetPage.offsetHeight;

        // Start animation
        requestAnimationFrame(() => {
            // Slide current page out
            if (direction === 'right') {
                currentPage.style.transform = 'translateX(-100%)';
            } else {
                currentPage.style.transform = 'translateX(100%)';
            }
            currentPage.style.opacity = '0';

            // Slide target page in
            targetPage.style.transform = 'translateX(0)';
            targetPage.style.opacity = '1';

            // Clean up after animation
            setTimeout(() => {
                this.completeTransition(currentPage, targetPage);
            }, 400); // Match CSS transition duration
        });
    }

    /**
     * Complete the transition and clean up
     * @param {HTMLElement} currentPage 
     * @param {HTMLElement} targetPage 
     */
    completeTransition(currentPage, targetPage) {
        // Hide current page
        currentPage.classList.remove('active');
        currentPage.style.display = 'none';
        currentPage.style.transform = '';
        currentPage.style.opacity = '';

        // Show target page
        targetPage.classList.add('active');
        targetPage.style.transform = '';
        targetPage.style.opacity = '';
    }

    /**
     * Go back to home page
     */
    goHome() {
        this.navigateTo('home-page', 'left');
    }

    /**
     * Go to stopwatch page
     */
    goToStopwatch() {
        this.navigateTo('stopwatch-page', 'right');
    }

    /**
     * Go to timer page
     */
    goToTimer() {
        this.navigateTo('timer-page', 'right');
    }

    /**
     * Get current page ID
     * @returns {string}
     */
    getCurrentPage() {
        return this.currentPage;
    }
} 