/**
 * InputHandler class - Manages all user input
 */
class InputHandler {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Camera} camera - The camera instance
     * @param {object} config - Configuration options
     */
    constructor(canvas, camera, config = {}) {
        this.canvas = canvas;
        this.camera = camera;
        this.panSpeed = config.panSpeed || 8;
        this.keysPressed = {};
        this.panInterval = null;

        // Callbacks
        this.onPlace = null;
        this.onCameraMove = null;

        this.setupMouseHandlers();
        this.setupKeyboardHandlers();
    }

    /**
     * Setup mouse event handlers
     */
    setupMouseHandlers() {
        this.mouseDown = false;

        this.canvas.addEventListener("mousedown", () => this.mouseDown = true);
        this.canvas.addEventListener("mouseup", () => this.mouseDown = false);
        this.canvas.addEventListener("mouseleave", () => this.mouseDown = false);
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.mouseDown && this.onPlace) {
                this.onPlace(e);
            }
        });
        this.canvas.addEventListener("click", (e) => {
            if (this.onPlace) {
                this.onPlace(e);
            }
        });
    }

    /**
     * Setup keyboard event handlers for panning
     */
    setupKeyboardHandlers() {
        document.addEventListener("keydown", (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
                e.preventDefault();
                this.keysPressed[e.key] = true;
            }
        });

        document.addEventListener("keyup", (e) => {
            this.keysPressed[e.key] = false;
        });
    }

    /**
     * Handle keyboard panning (call this in game loop)
     */
    handleKeyboardPanning() {
        if (this.keysPressed["ArrowUp"] || this.keysPressed["w"]) {
            this.pan("up", this.panSpeed);
        }
        if (this.keysPressed["ArrowDown"] || this.keysPressed["s"]) {
            this.pan("down", this.panSpeed);
        }
        if (this.keysPressed["ArrowLeft"] || this.keysPressed["a"]) {
            this.pan("left", this.panSpeed);
        }
        if (this.keysPressed["ArrowRight"] || this.keysPressed["d"]) {
            this.pan("right", this.panSpeed);
        }
    }

    /**
     * Pan camera in a direction
     * @param {string} direction - Direction to pan ('up', 'down', 'left', 'right')
     * @param {number} speed - Pixels to move
     */
    pan(direction, speed) {
        if (!this.camera) return;

        switch(direction) {
            case 'up':
                this.camera.move(0, -speed);
                break;
            case 'down':
                this.camera.move(0, speed);
                break;
            case 'left':
                this.camera.move(-speed, 0);
                break;
            case 'right':
                this.camera.move(speed, 0);
                break;
        }

        if (this.onCameraMove) {
            this.onCameraMove();
        }
    }

    /**
     * Start continuous panning (for D-pad hold)
     * @param {string} direction - Direction to pan
     */
    startPan(direction) {
        this.stopPan();
        this.panInterval = setInterval(() => {
            this.pan(direction, this.panSpeed);
        }, 16); // ~60fps
    }

    /**
     * Stop continuous panning
     */
    stopPan() {
        if (this.panInterval) {
            clearInterval(this.panInterval);
            this.panInterval = null;
        }
    }

    /**
     * Reset camera to center
     */
    resetCamera() {
        if (this.camera) {
            this.camera.reset();
            if (this.onCameraMove) {
                this.onCameraMove();
            }
        }
    }

    /**
     * Set the place callback function
     * @param {function} callback - Function to call when placing
     */
    setPlaceCallback(callback) {
        this.onPlace = callback;
    }

    /**
     * Set the camera move callback function
     * @param {function} callback - Function to call when camera moves
     */
    setCameraMoveCallback(callback) {
        this.onCameraMove = callback;
    }

    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {object} - {x, y} world coordinates
     */
    screenToWorld(screenX, screenY) {
        if (!this.camera) return { x: screenX, y: screenY };
        return this.camera.screenToWorld(screenX, screenY);
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        this.stopPan();
        // Remove event listeners if needed
    }
}