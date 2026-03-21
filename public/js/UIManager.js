/**
 * UIManager class - Manages all UI interactions and state
 */
class UIManager {
    /**
     * @param {MainGame} game - The main game instance
     */
    constructor(game) {
        this.game = game;

        // UI State
        this.paletteOpen = false;
        this.selectedBuilding = null;
        this.selectedEmoji = '';
        this.selectedName = '';

        // D-Pad state
        this.panInterval = null;
        this.panSpeed = 8;

        // Elements
        this.palette = null;
        this.paletteButton = null;
        this.selectionWrapper = null;
        this.selectionDisplay = null;

        // Bind methods
        this.togglePalette = this.togglePalette.bind(this);
        this.switchCategory = this.switchCategory.bind(this);
        this.selectBuilding = this.selectBuilding.bind(this);
        this.resetSelection = this.resetSelection.bind(this);
        this.startPan = this.startPan.bind(this);
        this.stopPan = this.stopPan.bind(this);
        this.centerCamera = this.centerCamera.bind(this);

        this.init();
    }

    /**
     * Initialize UI elements and event listeners
     */
    init() {
        // Cache DOM elements
        this.palette = document.getElementById('palette');
        this.paletteButton = document.getElementById('fab');
        this.selectionWrapper = document.getElementById('selection-wrapper');
        this.selectionDisplay = document.getElementById('selection');

        // Setup canvas touch to close palette
        const canvas = document.getElementById('game');
        if (canvas) {
            canvas.addEventListener('touchstart', () => {
                if (this.paletteOpen) {
                    this.togglePalette();
                }
            });
        }

        // Setup visibility change to stop panning
        document.addEventListener('visibilitychange', this.stopPan);
        window.addEventListener('blur', this.stopPan);

        // Expose methods globally for HTML onclick attributes
        window.uiManager = this;
    }

    /**
     * Toggle the building palette open/closed
     */
    togglePalette() {
        this.paletteOpen = !this.paletteOpen;

        if (this.paletteOpen) {
            this.palette.classList.add('open');
            this.paletteButton.style.display = 'none';
        } else {
            this.palette.classList.remove('open');
            this.paletteButton.style.display = 'flex';
        }
    }

    /**
     * Switch to a different building category
     * @param {string} category - Category ID (e.g., 'basic', 'residential')
     */
    switchCategory(category) {
        // Update tabs
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.category-content').forEach(content => content.classList.remove('active'));
        const categoryContent = document.getElementById('cat-' + category);
        if (categoryContent) {
            categoryContent.classList.add('active');
        }
    }

    /**
     * Select a building type
     * @param {string} id - Building element ID
     */
    selectBuilding(id) {
        // Update UI - remove selected class from all buttons
        document.querySelectorAll('.building-btn').forEach(btn => btn.classList.remove('selected'));

        // Add selected class to clicked button
        if (event && event.target) {
            const btn = event.target.closest('.building-btn');
            if (btn) {
                btn.classList.add('selected');
            }
        }

        // Show selection indicator
        if (this.selectionWrapper) {
            this.selectionWrapper.style.display = 'flex';
            if (this.selectionDisplay) {
                const element = ELEMENT[id]
                this.selectionDisplay.textContent = `${element.emoji} ${element.name}`;
            }
        }

        // Set the game building type
        if (this.game) {
            this.game.setType(id);
        }

        // Close palette after selection
        setTimeout(() => {
            this.togglePalette();
        }, 200);
    }

    /**
     * Reset the building selection
     */
    resetSelection() {
        if (this.selectionWrapper) {
            this.selectionWrapper.style.display = 'none';
        }

        // Remove selected class from all buttons
        document.querySelectorAll('.building-btn').forEach(btn => btn.classList.remove('selected'));
    }

    /**
     * Start panning in a direction (for D-Pad)
     * @param {string} direction - Direction to pan ('up', 'down', 'left', 'right')
     */
    startPan(direction) {
        this.stopPan();
        this.panInterval = setInterval(() => {
            if (this.game && this.game.inputHandler) {
                this.game.inputHandler.pan(direction, this.panSpeed);
            }
        }, 16); // ~60fps
    }

    /**
     * Stop panning
     */
    stopPan() {
        if (this.panInterval) {
            clearInterval(this.panInterval);
            this.panInterval = null;
        }
    }

    /**
     * Center the camera
     */
    centerCamera() {
        if (this.game && this.game.inputHandler) {
            this.game.inputHandler.resetCamera();
        }
    }

    /**
     * Update the selection display with current building info
     * @param {string} emoji - Building emoji
     * @param {string} name - Building name
     * @param {number} cost - Building cost
     */
    updateSelectionDisplay(emoji, name, cost) {
        if (this.selectionDisplay) {
            this.selectionDisplay.textContent = `${emoji} ${name} - ${cost}$`;
        }
    }

    /**
     * Show a warning message
     * @param {string} message - Warning message to display
     */
    showWarning(message) {
        const warningEl = document.getElementById("warning");
        if (warningEl) {
            warningEl.innerHTML = message;
            warningEl.style.display = "block";
        }
    }

    /**
     * Hide warning message
     */
    hideWarning() {
        const warningEl = document.getElementById("warning");
        if (warningEl) {
            warningEl.style.display = "none";
        }
    }

    /**
     * Show game over screen
     */
    showGameOver() {
        const gameOverEl = document.getElementById("gameOver");
        if (gameOverEl) {
            gameOverEl.style.display = "flex";
        }
    }

    /**
     * Update HUD display
     * @param {object} state - Game state { money, population, pollution }
     */
    updateHUD(state) {
        const moneyEl = document.getElementById('money');
        const popEl = document.getElementById('population');
        const pollEl = document.getElementById('pollution');

        if (moneyEl) moneyEl.innerText = Math.floor(state.money);
        if (popEl) popEl.innerText = Math.floor(state.population);
        if (pollEl) pollEl.innerText = Math.floor(state.pollution);
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        this.stopPan();
        document.removeEventListener('visibilitychange', this.stopPan);
        window.removeEventListener('blur', this.stopPan);

        if (window.uiManager === this) {
            delete window.uiManager;
        }
    }
}