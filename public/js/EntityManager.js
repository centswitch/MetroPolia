/**
 * EntityManager class - Manages game entities (people and cars)
 */
class EntityManager {
    /**
     * @param {GameMap} gameMap - The game map instance
     * @param {object} elements - Element definitions (ELEMENT object)
     */
    constructor(gameMap, elements) {
        this.gameMap = gameMap;
        this.elements = elements;
        this.people = [];
        this.cars = [];
    }

    /**
     * Spawn initial population
     * @param {number} count - Number of people to spawn
     */
    spawnPeople(count) {
        this.people = [];
        for (let i = 0; i < count; i++) {
            this.people.push({
                x: Math.floor(Math.random() * this.gameMap.width),
                y: Math.floor(Math.random() * this.gameMap.height)
            });
        }
    }

    /**
     * Get current people count
     * @returns {number}
     */
    getPeopleCount() {
        return this.people.length;
    }

    /**
     * Get current cars count
     * @returns {number}
     */
    getCarsCount() {
        return this.cars.length;
    }

    /**
     * Move people randomly on valid tiles
     */
    movePeople() {
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];

        for (const p of this.people) {
            const dir = directions[Math.floor(Math.random() * 4)];
            const nx = p.x + dir[0];
            const ny = p.y + dir[1];

            if (this.gameMap.isValidPosition(nx, ny)) {
                const tile = this.gameMap.getTile(nx, ny);
                if (tile === this.elements.ROAD.id ||
                    tile === this.elements.PARK.id ||
                    tile === this.elements.RES.id) {
                    p.x = nx;
                    p.y = ny;
                }
            }
        }
    }

    /**
     * Move cars randomly on roads
     */
    moveCars() {
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];

        for (const c of this.cars) {
            const dir = directions[Math.floor(Math.random() * 4)];
            const nx = c.x + dir[0];
            const ny = c.y + dir[1];

            if (this.gameMap.isValidPosition(nx, ny)) {
                if (this.gameMap.getTile(nx, ny) === this.elements.ROAD.id) {
                    c.x = nx;
                    c.y = ny;
                }
            }
        }
    }

    /**
     * Update all entities (move people and cars)
     */
    update() {
        this.movePeople();
        this.moveCars();
    }

    /**
     * Get people array (for rendering)
     * @returns {Array}
     */
    getPeople() {
        return this.people;
    }

    /**
     * Get cars array (for rendering)
     * @returns {Array}
     */
    getCars() {
        return this.cars;
    }

    /**
     * Set people array (for loading save games)
     * @param {Array} people - Array of person objects
     */
    setPeople(people) {
        this.people = people;
    }

    /**
     * Set cars array (for loading save games)
     * @param {Array} cars - Array of car objects
     */
    setCars(cars) {
        this.cars = cars;
    }

    /**
     * Export entity data for saving
     * @returns {object}
     */
    export() {
        return {
            people: this.people,
            cars: this.cars
        };
    }

    /**
     * Import entity data from saved state
     * @param {object} data - Saved entity data
     */
    import(data) {
        if (data.people) {
            this.people = data.people;
        }
        if (data.cars) {
            this.cars = data.cars;
        }
    }

    /**
     * Clear all entities
     */
    clear() {
        this.people = [];
        this.cars = [];
    }

    /**
     * Add a person at a specific position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    addPerson(x, y) {
        this.people.push({ x, y });
    }

    /**
     * Add a car at a specific position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    addCar(x, y) {
        this.cars.push({ x, y });
    }

    /**
     * Remove a person at a specific position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean} - True if person was removed
     */
    removePersonAt(x, y) {
        const index = this.people.findIndex(p => p.x === x && p.y === y);
        if (index !== -1) {
            this.people.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Remove a car at a specific position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {boolean} - True if car was removed
     */
    removeCarAt(x, y) {
        const index = this.cars.findIndex(c => c.x === x && c.y === y);
        if (index !== -1) {
            this.cars.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Get entity statistics
     * @returns {object} - Statistics object
     */
    getStatistics() {
        return {
            peopleCount: this.people.length,
            carsCount: this.cars.length
        };
    }
}