/**
 * GameMap class - Manages the game grid and tile operations
 */
class GameMap {
    /**
     * @param {number} width - Grid width in tiles
     * @param {number} height - Grid height in tiles
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.levels = [];
        this.initialize();
    }

    /**
     * Initialize empty map
     */
    initialize() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            this.levels[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = "EMPTY";
                this.levels[y][x] = 1;
            }
        }
    }

    /**
     * Get tile type at position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {string} - Element ID (e.g., "RES", "ROAD")
     */
    getTile(x, y) {
        if (!this.isValidPosition(x, y)) return null;
        return this.tiles[y][x];
    }

    /**
     * Set tile type at position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {string} elementId - Element ID to set
     * @returns {boolean} - Success
     */
    setTile(x, y, elementId) {
        if (!this.isValidPosition(x, y)) return false;
        this.tiles[y][x] = elementId;
        return true;
    }

    /**
     * Get tile level at position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {number} - Tile level
     */
    getLevel(x, y) {
        if (!this.isValidPosition(x, y)) return 1;
        return this.levels[y][x];
    }

    /**
     * Set tile level at position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {number} level - Level to set
     * @returns {boolean} - Success
     */
    setLevel(x, y, level) {
        if (!this.isValidPosition(x, y)) return false;
        this.levels[y][x] = level;
        return true;
    }

    /**
     * Check if position is within map bounds
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean}
     */
    isValidPosition(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    /**
     * Check if position is adjacent to a road
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean}
     */
    isNearRoad(x, y) {
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];
        for (const dir of directions) {
            const nx = x + dir[0];
            const ny = y + dir[1];
            if (this.isValidPosition(nx, ny) && this.tiles[ny][nx] === "ROAD") {
                return true;
            }
        }
        return false;
    }

    /**
     * Get all tiles of a specific type
     * @param {string} elementId - Element ID to search for
     * @returns {Array} - Array of {x, y} positions
     */
    getTilesByType(elementId) {
        const results = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === elementId) {
                    results.push({ x, y });
                }
            }
        }
        return results;
    }

    /**
     * Count tiles of a specific type
     * @param {string} elementId - Element ID to count
     * @returns {number}
     */
    countTiles(elementId) {
        let count = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === elementId) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Export map data for saving
     * @returns {object}
     */
    export() {
        return {
            tiles: this.tiles,
            levels: this.levels,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Import map data from saved state
     * @param {object} data - Saved map data
     */
    import(data) {
        if (data.tiles && data.levels) {
            this.tiles = data.tiles;
            this.levels = data.levels;
            this.width = data.width || this.width;
            this.height = data.height || this.height;
        }
    }

    /**
     * Get map statistics
     * @returns {object} - Statistics object
     */
    getStatistics() {
        const stats = {};
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const type = this.tiles[y][x];
                stats[type] = (stats[type] || 0) + 1;
            }
        }
        return stats;
    }
}