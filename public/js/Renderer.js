/**
 * Renderer class - Handles all canvas drawing operations
 */
class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     * @param {object} loadedImages - Preloaded image cache
     */
    constructor(canvas, ctx, loadedImages) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.loadedImages = loadedImages;
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw a single tile
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {number} size - Tile size in pixels
     * @param {object} element - Element definition
     */
    drawTile(x, y, size, element) {
        // Draw background color as fallback
        this.ctx.fillStyle = element.color || "#333";
        this.ctx.fillRect(x * size, y * size, size, size);

        // Draw image if available
        if (element.image && this.loadedImages[element.id]) {
            const img = this.loadedImages[element.id];
            if (img.complete) {
                this.ctx.drawImage(img, x * size, y * size, size, size);
            }
        }

        // Draw grid border
        this.ctx.strokeStyle = "#222";
        this.ctx.strokeRect(x * size, y * size, size, size);
    }

    /**
     * Draw the visible portion of the map
     * @param {GameMap} gameMap - The game map instance
     * @param {Camera} camera - The camera instance
     * @param {number} tileSize - Size of each tile in pixels
     * @param {object} elements - Element definitions (ELEMENT object)
     */
    drawMap(gameMap, camera, tileSize, elements) {
        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);

        // Get visible tile range for optimization
        const range = camera.getVisibleTileRange(tileSize);

        for (let y = range.startY; y < range.endY; y++) {
            for (let x = range.startX; x < range.endX; x++) {
                const type = gameMap.getTile(x, y);
                const element = elements[type];
                this.drawTile(x, y, tileSize, element);
            }
        }

        this.ctx.restore();
    }

    /**
     * Draw cars on the map
     * @param {Array} cars - Array of car objects with x, y properties
     * @param {number} tileSize - Size of each tile in pixels
     */
    drawCars(cars, tileSize) {
        // this.ctx.fillStyle = "red";
        for (const car of cars) {
            if (car && car.x !== undefined && car.y !== undefined) {

                // Draw image if available
                if (car.dir && this.loadedImages[`car_${car.dir}`]) {
                    const img = this.loadedImages[`car_${car.dir}`];
                    if (img.complete) {
                        this.ctx.drawImage(
                            img,
                            car.x * tileSize + tileSize / 4,
                            car.y * tileSize + tileSize / 4,
                            tileSize / 2,
                            tileSize / 2
                        );
                    }
                }
            }
        }
    }

    /**
     * Draw people on the map
     * @param {Array} people - Array of person objects with x, y properties
     * @param {number} tileSize - Size of each tile in pixels
     */
    drawPeople(people, tileSize) {
        this.ctx.fillStyle = "#fff";
        for (const p of people) {
            this.ctx.beginPath();
            this.ctx.arc(
                p.x * tileSize + tileSize / 2,
                p.y * tileSize + tileSize / 2,
                tileSize / 4,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        }
    }

    /**
     * Draw all entities (cars and people)
     * @param {Array} cars - Array of car objects
     * @param {Array} people - Array of person objects
     * @param {Camera} camera - The camera instance
     * @param {number} tileSize - Size of each tile in pixels
     */
    drawEntities(cars, people, camera, tileSize) {
        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);

        this.drawCars(cars, tileSize);
        this.drawPeople(people, tileSize);

        this.ctx.restore();
    }

    /**
     * Update the HUD display
     * @param {number} money - Current money
     * @param {number} population - Current population
     * @param {number} pollution - Current pollution level
     */
    updateHUD(money, population, pollution) {
        const moneyEl = document.getElementById('money');
        const popEl = document.getElementById('population');
        const pollEl = document.getElementById('pollution');

        if (moneyEl) moneyEl.innerText = Math.floor(money);
        if (popEl) popEl.innerText = Math.floor(population);
        if (pollEl) pollEl.innerText = Math.floor(pollution);
    }

    /**
     * Main render function - draws everything
     * @param {GameMap} gameMap - The game map instance
     * @param {Camera} camera - The camera instance
     * @param {Array} cars - Array of car objects
     * @param {Array} people - Array of person objects
     * @param {number} tileSize - Size of each tile in pixels
     * @param {object} elements - Element definitions (ELEMENT object)
     * @param {object} gameState - Game state {money, population, pollution}
     */
    render(gameMap, camera, cars, people, tileSize, elements, gameState) {
        // Update camera bounds on resize
        camera.setCanvasSize(this.canvas.width, this.canvas.height);

        // Clear canvas
        this.clear();

        // Draw map
        this.drawMap(gameMap, camera, tileSize, elements);

        // Draw entities
        this.drawEntities(cars, people, camera, tileSize);

        // Update HUD
        this.updateHUD(gameState.money, gameState.population, gameState.pollution);
    }
}