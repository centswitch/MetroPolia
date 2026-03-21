/**
 * Simulation class - Manages game logic and economy
 */
class Simulation {
    /**
     * @param {GameMap} gameMap - The game map instance
     * @param {object} elements - Element definitions (ELEMENT object)
     */
    constructor(gameMap, elements) {
        this.gameMap = gameMap;
        this.elements = elements;
        this.lastIncomeTime = Date.now();
    }

    /**
     * Calculate all game statistics for the current state
     * @returns {object} - { income, pollution, basePopulation, capacity }
     */
    calculateStatistics() {
        let income = 0;
        let pollution = 0;
        let basePopulation = 0;
        let capacity = 0;

        for (let y = 0; y < this.gameMap.height; y++) {
            for (let x = 0; x < this.gameMap.width; x++) {
                const type = this.gameMap.getTile(x, y);
                const level = this.gameMap.getLevel(x, y);
                const element = this.elements[type];

                income += element.calculateIncome(level, this.gameMap.isNearRoad(x, y));
                pollution += element.increasePollution(level);
                basePopulation += element.increasePopulation(level);
                capacity += element.increaseCapacity(level);
            }
        }

        return { income, pollution, basePopulation, capacity };
    }

    /**
     * Update the economy based on time elapsed
     * @param {number} currentMoney - Current money amount
     * @param {number} intervalMs - Income interval in milliseconds (default: 1000)
     * @returns {number} - New money amount
     */
    updateEconomy(currentMoney, intervalMs = 1000) {
        const stats = this.calculateStatistics();
        const now = Date.now();

        if (now - this.lastIncomeTime >= intervalMs) {
            currentMoney += stats.income;
            this.lastIncomeTime = now;
        }

        return currentMoney;
    }

    /**
     * Trigger a random natural disaster
     * @param {number} chance - Probability of disaster (default: 0.000005)
     * @returns {object|null} - Disaster info {x, y} or null
     */
    triggerDisaster(chance = 0.000005) {
        if (Math.random() < chance) {
            const x = Math.floor(Math.random() * this.gameMap.width);
            const y = Math.floor(Math.random() * this.gameMap.height);
            this.gameMap.setTile(x, y, this.elements.EMPTY.id);
            console.log("Katastrophe bei", x, y);
            return { x, y };
        }
        return null;
    }

    /**
     * Main update function - runs one simulation step
     * @param {object} state - Current game state { money, population, pollution }
     * @returns {object} - Updated game state
     */
    update(state) {
        const stats = this.calculateStatistics();

        // Update economy
        state.money = this.updateEconomy(state.money);

        // Update population
        state.population = Math.min(stats.basePopulation, stats.capacity);
        state.pollution = Math.max(0, stats.pollution);

        // Check for disasters
        this.triggerDisaster();

        return state;
    }

    /**
     * Check if game should be in warning state
     * @param {number} population - Current population
     * @param {number} money - Current money
     * @returns {boolean}
     */
    isCrisis(population, money) {
        return population <= 0 || money <= 0;
    }
}
