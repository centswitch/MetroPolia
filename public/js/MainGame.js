/**
 * MainGame class - Main controller that ties all systems together
 */
class MainGame {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     * @param {object} config - Game configuration
     */
    constructor(canvas, ctx, config = {}) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.config = {
            grid: config.grid || 30,
            startMoney: config.startMoney || 2500,
            startPopulation: config.startPopulation || 50,
            panSpeed: config.panSpeed || 8,
            tileSizeMultiplier: config.tileSizeMultiplier || 3.5
        };

        // Game state
        this.state = {
            current: null,
            money: this.config.startMoney,
            population: this.config.startPopulation,
            pollution: 0,
            gameOver: false,
            warning: false
        };

        // Calculate tile size based on canvas
        this.tileSize = this.canvas.width * this.config.tileSizeMultiplier / this.config.grid;

        // Systems
        this.camera = null;
        this.gameMap = null;
        this.renderer = null;
        this.simulation = null;
        this.inputHandler = null;
        this.entityManager = null;
        this.uiManager = null;

        // Preloaded images
        this.loadedImages = {};

        // Animation frame ID
        this.animationFrameId = null;

        // Bind methods
        this.loop = this.loop.bind(this);
    }

    /**
     * Initialize the game
     */
    async init() {
        // Preload images
        await this.preloadImages();

        // Initialize map
        this.gameMap = new GameMap(this.config.grid, this.config.grid);
        this.setupStartingCity();

        // Initialize camera
        const mapWidth = this.config.grid * this.tileSize;
        const mapHeight = this.config.grid * this.tileSize;
        this.camera = new Camera(this.canvas.width, this.canvas.height, mapWidth, mapHeight);
        this.camera.centerOn(10 * this.tileSize, 10 * this.tileSize);

        // Initialize renderer
        this.renderer = new Renderer(this.canvas, this.ctx, this.loadedImages);

        // Initialize simulation
        this.simulation = new Simulation(this.gameMap, ELEMENT);

        // Initialize entity manager
        this.entityManager = new EntityManager(this.gameMap, ELEMENT);
        this.entityManager.spawnPeople(this.state.population);

        // Initialize input handler
        this.inputHandler = new InputHandler(this.canvas, this.camera, { panSpeed: this.config.panSpeed });
        this.inputHandler.setPlaceCallback(this.handlePlace.bind(this));

        // Initialize UI manager
        this.uiManager = new UIManager(this);

        // Set default building
        this.state.current = ELEMENT.RES.id;
        this.updateSelectionDisplay();
    }

    /**
     * Preload all building images
     */
    preloadImages() {
        return new Promise((resolve) => {
            let loaded = 0;
            const total = Object.keys(ELEMENT).length;

            for (const key in ELEMENT) {
                const elem = ELEMENT[key];
                if (elem.image) {
                    const img = new Image();
                    img.onload = () => {
                        loaded++;
                        if (loaded === total) resolve();
                    };
                    img.onerror = () => {
                        loaded++;
                        if (loaded === total) resolve();
                    };
                    img.src = elem.image;
                    this.loadedImages[key] = img;
                } else {
                    loaded++;
                    if (loaded === total) resolve();
                }
            }

            // Resolve immediately if no images to load
            if (total === 0) resolve();
        });
    }

    /**
     * Setup the starting city
     */
    setupStartingCity() {
        // Starting buildings
        this.gameMap.setTile(10, 10, ELEMENT.RES.id);
        this.gameMap.setTile(10, 11, ELEMENT.RES.id);
        this.gameMap.setTile(11, 10, ELEMENT.RES.id);
        this.gameMap.setTile(11, 11, ELEMENT.RES.id);
        this.gameMap.setTile(9, 10, ELEMENT.ROAD.id);
        this.gameMap.setTile(9, 11, ELEMENT.ROAD.id);
        this.gameMap.setTile(12, 10, ELEMENT.COM.id);
        this.gameMap.setTile(13, 10, ELEMENT.POWER.id);
    }

    /**
     * Handle building placement
     */
    handlePlace(e) {
        if (this.state.gameOver || !this.camera || !this.gameMap) return;

        const rect = this.canvas.getBoundingClientRect();
        const worldPos = this.camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
        const x = Math.floor(worldPos.x / this.tileSize);
        const y = Math.floor(worldPos.y / this.tileSize);

        if (!this.gameMap.isValidPosition(x, y)) return;

        const cost = ELEMENT[this.state.current].cost;

        if (this.state.current === ELEMENT.EMPTY.id) {
            if (this.gameMap.getTile(x, y) !== ELEMENT.EMPTY.id && this.state.money >= cost) {
                this.gameMap.setTile(x, y, ELEMENT.EMPTY.id);
                this.state.money -= cost;
            }
        } else {
            if (this.state.money >= cost) {
                this.gameMap.setTile(x, y, this.state.current);
                this.gameMap.setLevel(x, y, 1);
                this.state.money -= cost;
            }
        }
    }

    /**
     * Set the current building type
     */
    setType(type) {
        this.state.current = type;
        this.updateSelectionDisplay();
    }

    /**
     * Update the selection display in UI
     */
    updateSelectionDisplay() {
        const el = ELEMENT[this.state.current];
        if (el) {
            const display = document.getElementById("selection");
            if (display) {
                display.innerText = `${el.icon} ${el.name} - ${el.cost}$`;
            }
        }
    }

    /**
     * Main game loop
     */
    loop() {
        // Handle input
        if (this.inputHandler) {
            this.inputHandler.handleKeyboardPanning();
        }

        // Run simulation
        this.updateSimulation();

        // Check for crisis
        this.checkCrisis();

        // Render
        this.render();

        // Continue loop
        if (!this.state.gameOver) {
            this.animationFrameId = requestAnimationFrame(this.loop);
        }
    }

    /**
     * Update simulation
     */
    updateSimulation() {
        if (!this.simulation || !this.entityManager) return;

        const simState = this.simulation.update({
            money: this.state.money,
            population: this.state.population,
            pollution: this.state.pollution
        });

        this.state.money = simState.money;
        this.state.population = simState.population;
        this.state.pollution = simState.pollution;

        // Update entities
        this.entityManager.update();
    }

    /**
     * Check for crisis/warning state
     */
    checkCrisis() {
        if (!this.simulation || !this.uiManager) return;

        if (this.simulation.isCrisis(this.state.population, this.state.money) && !this.state.warning) {
            this.state.warning = true;
            this.uiManager.showWarning("⚠️ Krise! Bevölkerung oder Geld kritisch!<br>Du hast 1 Minute Zeit!");

            setTimeout(() => {
                if (this.simulation.isCrisis(this.state.population, this.state.money)) {
                    this.state.gameOver = true;
                    this.uiManager.showGameOver();
                }
                this.state.warning = false;
                this.uiManager.hideWarning();
            }, 60000);
        }
    }

    /**
     * Render the game
     */
    render() {
        if (!this.renderer || !this.camera || !this.gameMap || !this.entityManager) return;

        this.renderer.render(
            this.gameMap,
            this.camera,
            this.entityManager.getCars(),
            this.entityManager.getPeople(),
            this.tileSize,
            ELEMENT,
            {
                money: this.state.money,
                population: this.state.population,
                pollution: this.state.pollution
            }
        );
    }

    /**
     * Start the game loop
     */
    start() {
        if (!this.animationFrameId) {
            this.loop();
        }
    }

    /**
     * Stop the game loop
     */
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Save the game
     */
    save() {
        if (!this.gameMap || !this.entityManager) return;
        localStorage.setItem("cityMap", JSON.stringify(this.gameMap.export()));
        localStorage.setItem("cityMoney", this.state.money);
        localStorage.setItem("cityEntities", JSON.stringify(this.entityManager.export()));
    }

    /**
     * Load the game
     */
    load() {
        if (!this.gameMap || !this.entityManager) return;

        const mapData = localStorage.getItem("cityMap");
        const moneyData = localStorage.getItem("cityMoney");
        const entitiesData = localStorage.getItem("cityEntities");

        if (mapData) {
            this.gameMap.import(JSON.parse(mapData));
        }
        if (moneyData) {
            this.state.money = parseFloat(moneyData);
        }
        if (entitiesData) {
            this.entityManager.import(JSON.parse(entitiesData));
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        if (this.inputHandler) {
            this.inputHandler.destroy();
        }
        if (this.uiManager) {
            this.uiManager.destroy();
        }
    }

    /**
     * Get current game state (for external access)
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get game statistics
     */
    getStatistics() {
        return {
            money: this.state.money,
            population: this.state.population,
            pollution: this.state.pollution,
            peopleCount: this.entityManager ? this.entityManager.getPeopleCount() : 0,
            carsCount: this.entityManager ? this.entityManager.getCarsCount() : 0,
            mapStats: this.gameMap ? this.gameMap.getStatistics() : {}
        };
    }
}