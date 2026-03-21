/**
 * Camera class - Handles viewport/camera positioning and bounds
 */
class Camera {
    /**
     * @param {number} canvasWidth - Canvas width in pixels
     * @param {number} canvasHeight - Canvas height in pixels
     * @param {number} mapWidth - Total map width in pixels
     * @param {number} mapHeight - Total map height in pixels
     */
    constructor(canvasWidth, canvasHeight, mapWidth, mapHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.x = 0;
        this.y = 0;

        this.updateBounds();
    }

    /**
     * Update maximum camera bounds based on current dimensions
     */
    updateBounds() {
        this.maxX = Math.max(0, this.mapWidth - this.canvasWidth);
        this.maxY = Math.max(0, this.mapHeight - this.canvasHeight);
        this.clamp();
    }

    /**
     * Update canvas dimensions (call on resize)
     */
    setCanvasSize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.updateBounds();
    }

    /**
     * Update map dimensions
     */
    setMapSize(width, height) {
        this.mapWidth = width;
        this.mapHeight = height;
        this.updateBounds();
    }

    /**
     * Clamp camera position to valid bounds
     */
    clamp() {
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    }

    /**
     * Move camera by specified amounts
     * @param {number} dx - Horizontal movement
     * @param {number} dy - Vertical movement
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.clamp();
    }

    /**
     * Center camera on specific world coordinates
     * @param {number} worldX - World X coordinate in pixels
     * @param {number} worldY - World Y coordinate in pixels
     */
    centerOn(worldX, worldY) {
        this.x = worldX - this.canvasWidth / 2;
        this.y = worldY - this.canvasHeight / 2;
        this.clamp();
    }

    /**
     * Reset camera to center of map
     */
    reset() {
        this.x = Math.max(0, this.maxX / 2);
        this.y = Math.max(0, this.maxY / 2);
    }

    /**
     * Get the visible range in tile coordinates
     * @param {number} tileSize - Size of each tile in pixels
     * @returns {object} - {startX, startY, endX, endY}
     */
    getVisibleTileRange(tileSize) {
        return {
            startX: Math.floor(this.x / tileSize),
            startY: Math.floor(this.y / tileSize),
            endX: Math.min(Math.ceil((this.x + this.canvasWidth) / tileSize) + 1, this.mapWidth / tileSize),
            endY: Math.min(Math.ceil((this.y + this.canvasHeight) / tileSize) + 1, this.mapHeight / tileSize)
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {object} - {x, y} world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Check if a point is visible in the viewport
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @returns {boolean}
     */
    isVisible(x, y) {
        return x >= this.x && x < this.x + this.canvasWidth &&
               y >= this.y && y < this.y + this.canvasHeight;
    }
}