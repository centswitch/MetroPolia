/**
 * MetroPolia - Städtebau-Simulation
 * ================================
 * Ein einfaches Städtebau-Spiel mit Gebäuden, Bevölkerung,
 * Einkommen, Strom und Verschmutzung.
 */

/* ============================================================
   1. BAUWERK DEFINITIONEN
   ============================================================ */

/**
 * Alle Gebäude-Typen mit ihren Eigenschaften.
 *
 * @typedef {Object} BuildingType
 * @property {string} id - Eindeutige Kennung
 * @property {number} cost - Baukosten
 * @property {string} name - Anzeigename
 * @property {string} color - Farbe im Spiel
 * @property {Function} calculateIncome - Berechnet das Einkommen
 * @property {Function} increasePopulation - Erhöht die Bevölkerung
 * @property {Function} increaseCapacity - Erhöht die Stromkapazität
 * @property {Function} increasePollution - Erhöht/verringert Verschmutzung
 */

/* --- Grundlegende Gebäude --- */
const EMPTY = {
    id: "EMPTY",
    cost: 10,
    name: "Löschen",
    color: "#333",
    category: "basic",
    calculateIncome: () => 0,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => 0,
};

const ROAD = {
    id: "ROAD",
    cost: 20,
    name: "Straße",
    color: "#777",
    category: "basic",
    calculateIncome: () => 0,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => 0,
};

/* --- Wohngebäude --- */
const RESIDENTIAL = {
    id: "RES",
    cost: 60,
    name: "Wohnhaus",
    color: "#2ecc71",
    image: "img/elemente/Zeichnung_Seite 10.png",
    category: "residential",
    calculateIncome: () => 0,
    increasePopulation: (level) => level * 6,
    increaseCapacity: () => 0,
    increasePollution: () => 0,
};

const HIGHRISE = {
    id: "HIGH",
    cost: 300,
    name: "Hochhaus",
    color: "#1abc9c",
    category: "residential",
    image: "img/elemente/Zeichnung_Seite 5.png",
    calculateIncome: () => 0,
    increasePopulation: () => 20,
    increaseCapacity: () => 0,
    increasePollution: () => 0,
};

/* --- Gewerbegebäude (bringen Geld) --- */
const COMMERCIAL = {
    id: "COM",
    cost: 250,
    name: "Gewerbe",
    color: "#3498db",
    category: "commercial",
    calculateIncome: (_, isNearRoad) => isNearRoad ? 10 : 5,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => 0,
};


const HOTEL = {
    id: "HOTEL",
    cost: 300,
    name: "Hotel",
    color: "#e67e22",
    category: "commercial",
    calculateIncome: () => 1,
    increasePopulation: () => 4,
    increaseCapacity: () => 0,
    increasePollution: () => 0,
};


/* --- Industriegebäude --- */
const INDUSTRY = {
    id: "IND",
    cost: 180,
    name: "Industrie",
    color: "#e67e22",
    category: "industrial",
    calculateIncome: () => 3,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => 3,
};

const INDUSTRIAL_PARK = {
    id: "INDPARK",
    cost: 300,
    name: "Industriepark",
    color: "#d35400",
    category: "industrial",
    calculateIncome: () => 5,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => 5,
};

const FARM = {
    id: "FARM",
    cost: 180,
    name: "Farm",
    color: "#27ae60",
    category: "industrial",
    calculateIncome: () => 1,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => -3,
};

/* --- Stromversorgung (erhöhen Kapazität) --- */
const POWER_PLANT = {
    id: "POWER",
    cost: 220,
    name: "Kraftwerk",
    color: "#f1c40f",
    category: "power",
    calculateIncome: () => 0,
    increasePopulation: () => 0,
    increaseCapacity: () => 100,
    increasePollution: () => 5,
};


const WIND_PARK = {
    id: "WIND",
    cost: 250,
    name: "Windpark",
    color: "#7f8c8d",
    category: "power",
    calculateIncome: () => 100000000000000000000,
    increasePopulation: () => 0,
    increaseCapacity: () => 100,
    increasePollution: () => 0,
};

/* --- Öffentliche Gebäude --- */
const PARK = {
    id: "PARK",
    cost: 30,
    name: "Park",
    color: "#27ae60",
    category: "public",
    calculateIncome: () => 0,
    increasePopulation: () => 0,
    increaseCapacity: () => 0,
    increasePollution: () => -5,
};

/* --- Alle Gebäude zusammenfassen --- */
const ELEMENT = {
    EMPTY,
    ROAD,
    RES: RESIDENTIAL,
    HIGH: HIGHRISE,
    COM: COMMERCIAL,
    IND: INDUSTRY,
    INDPARK: INDUSTRIAL_PARK,
    PARK,
    POWER: POWER_PLANT,
    HOTEL,
    FARM,
    WIND: WIND_PARK,
};

/* ============================================================
   2. KONSTANTEN & KONFIGURATION
   ============================================================ */

const CONFIG = {
    GRID_SIZE: 40,
    ZOOM_FACTOR: 1,
    CANVAS_ID: "game",
    INCOME_INTERVAL_MS: 1000,
    WARNING_TIMEOUT_MS: 60000,
    DISASTER_CHANCE: 0.000005,
    INITIAL_MONEY: 250.00,
    INITIAL_POPULATION: 50,
    START_CITY: {
        buildings: [
            { x: 11, y: 11, type: RESIDENTIAL.id },
            { x: 11, y: 10, type: ROAD.id },
            { x: 10, y: 10, type: COMMERCIAL.id },
            { x: 10, y: 11, type: POWER_PLANT.id },
        ]
    }
};

/**
 * Richtungsvektoren für die Bewegung von Personen und Autos.
 *
 *               N (y-1)
 *     W (x-1)      ✛      E (x+1)
 *               S (y+1)
 * @type {{EAST: number[], WEST: number[], SOUTH: number[], NORTH: number[]}}
 */

const DIRECTION = {
    EAST: [1, 0],
    WEST: [-1, 0],
    SOUTH: [0, 1],
    NORTH: [0, -1],
};

const LOADED_IMAGES = {}

/* ============================================================
   3. SPIELSTATUS (GAME STATE)
   ============================================================ */

const canvas = document.getElementById(CONFIG.CANVAS_ID);
const ctx = canvas.getContext("2d");
const tileSize = canvas.width / CONFIG.GRID_SIZE * CONFIG.ZOOM_FACTOR;

let currentBuildingType = ELEMENT.RES.id;
let map = []; // Die Spielkarte
let level = []; // Gebäudelevel
let money = CONFIG.INITIAL_MONEY;
let population = CONFIG.INITIAL_POPULATION;
let pollution = 0;
let mouseDown = false;
let gameOver = false;
let warningActive = false;
let lastIncomeTime = Date.now();
let people = [];
let cars = [];

/* ============================================================
   4. INITIALISIERUNG
   ============================================================ */

/**
 * Initialisiert die Spielkarte mit leeren Feldern.
 */
function initMap() {
    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
        map[y] = [];
        level[y] = [];
        for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
            map[y][x] = ELEMENT.EMPTY.id;
            level[y][x] = 1;
        }
    }
}

/**
 * Baut die Startstadt.
 */
function buildStartCity() {
    CONFIG.START_CITY.buildings.forEach(building => {
        map[building.y][building.x] = ELEMENT[building.type].id;
    });
}

/**
 * Initialisiert die Bevölkerung.
 */
// function initPeople() {
//     for (let i = 0; i < population; i++) {
//         people.push({
//             x: Math.floor(Math.random() * CONFIG.GRID_SIZE),
//             y: Math.floor(Math.random() * CONFIG.GRID_SIZE)
//         });
//     }
// }

/**
 * Initialisiert die Autos.
 * Es fügt so viele Autos wie Straßen vorhanden sind.
 */
function initCars() {
    const roads = [];
    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
        for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
            if (map[y][x] === ROAD.id) {
                roads.push({ x, y, type: ROAD.id });
            }
        }
    }

    roads.forEach(cell => {
        cars.push({
            x: cell.x,
            y: cell.y,
            dir: DIRECTION.EAST,
        });
    });
}

function preloadImages() {
    for (const key in ELEMENT) {
        const elem = ELEMENT[key];
        if (elem.image) {
            const img = new Image();
            img.src = elem.image;
            LOADED_IMAGES[key] = img;
        }
    }

}

/* ============================================================
   5. KERNFUNKTIONEN
   ============================================================ */

/**
 * Wählt das aktuelle Gebäude aus, das gebaut werden soll.
 * @param {string} typeId - Die ID des Gebäudetyps
 */
function setType(typeId) {
    currentBuildingType = typeId;
    document.getElementById("current").innerText = ELEMENT[typeId].name;
    document.getElementById("cost").innerText = ELEMENT[typeId].cost;
}

/**
 * Prüft, ob ein Feld an einer Straße liegt.
 * @param {number} x - X-Koordinate
 * @param {number} y - Y-Koordinate
 * @returns {boolean} True, wenn an einer Straße
 */
function nearRoad(x, y) {
    const directions = Object.values(DIRECTION);

    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && ny >= 0 && nx < CONFIG.GRID_SIZE && ny < CONFIG.GRID_SIZE) {
            if (map[ny][nx] === ELEMENT.ROAD.id) {
                return true;
            }
        }
    }
    return false;
}

/* ============================================================
   6. EINGABE-BEHANDLUNG (INPUT HANDLING)
   ============================================================ */

/**
 * Platziert ein Gebäude an der geklickten Position.
 * @param {MouseEvent} event - Das Maus-Event
 */
function place(event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / tileSize);
    const y = Math.floor((event.clientY - rect.top) / tileSize);

    // Prüfen, ob die Position gültig ist
    if (x < 0 || y < 0 || x >= CONFIG.GRID_SIZE || y >= CONFIG.GRID_SIZE) return;

    const cost = ELEMENT[currentBuildingType].cost;

    // Löschen
    if (currentBuildingType === ELEMENT.EMPTY.id) {
        if (map[y][x] !== ELEMENT.EMPTY.id && money >= cost) {
            map[y][x] = ELEMENT.EMPTY.id;
            money -= cost;
        }
        return;
    }

    // Bauen
    if (money >= cost) {
        map[y][x] = currentBuildingType;
        money -= cost;
        level[y][x] = 1;
    }
}

// Event-Listener für die Maus
canvas.addEventListener("mousedown", () => mouseDown = true);
canvas.addEventListener("mouseup", () => mouseDown = false);
canvas.addEventListener("mouseleave", () => mouseDown = false);
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) place(e);
});
canvas.addEventListener("click", place);

/* ============================================================
   7. SIMULATION
   ============================================================ */

/**
 * Bewegt eine Person zufällig auf benachbarte Felder.
 * @param {Object} person - Die Person mit x und y Koordinaten
 */
function movePerson(person) {
    const directions = Object.values(DIRECTION);
    const dir = directions[Math.floor(Math.random() * 4)];
    const nx = person.x + dir[0];
    const ny = person.y + dir[1];

    if (nx >= 0 && ny >= 0 && nx < CONFIG.GRID_SIZE && ny < CONFIG.GRID_SIZE) {
        const validTiles = [ELEMENT.ROAD.id, ELEMENT.PARK.id, ELEMENT.RES.id];
        if (validTiles.includes(map[ny][nx])) {
            person.x = nx;
            person.y = ny;
        }
    }
}

/**
 * Bewegt ein Auto zufällig auf Straßen.
 * @param {Object} car - Das Auto mit x und y Koordinaten
 */
function moveCar(car) {
    const directions = Object.values(DIRECTION);
    const dir = directions[Math.floor(Math.random() * 4)];
    const nx = car.x + dir[0];
    const ny = car.y + dir[1];

    if (nx >= 0 && ny >= 0 && nx < CONFIG.GRID_SIZE && ny < CONFIG.GRID_SIZE) {
        if (map[ny][nx] === ELEMENT.ROAD.id) {
            car.x = nx;
            car.y = ny;
            car.dir = dir;
        }
    }
}

/**
 * Löst eine Naturkatastrophe aus (sehr selten).
 */
function triggerDisaster() {
    if (Math.random() < CONFIG.DISASTER_CHANCE) {
        const x = Math.floor(Math.random() * CONFIG.GRID_SIZE);
        const y = Math.floor(Math.random() * CONFIG.GRID_SIZE);
        map[y][x] = ELEMENT.EMPTY.id;
        console.log("⚠️ Katastrophe bei", x, y);
    }
}

/**
 * Prüft auf kritische Zustände und zeigt Warnungen an.
 */
function checkWarnings() {
    if ((population <= 0 || money <= 0) && !warningActive) {
        warningActive = true;
        document.getElementById("warning").style.display = "block";

        setTimeout(() => {
            if (population <= 0 || money <= 0) {
                gameOver = true;
                document.getElementById("gameOver").style.display = "block";
            }
            warningActive = false;
            document.getElementById("warning").style.display = "none";
        }, CONFIG.WARNING_TIMEOUT_MS);
    }
}

/**
 * Haupt-Simulationsfunktion: Berechnet alles, was im Spiel passiert.
 */
function simulate() {
    let basePop = 0;
    let capacity = 0;
    let income = 0;
    let pollutionTotal = 0;

    // Alle Felder berechnen
    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
        for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
            const type = map[y][x];

            income += ELEMENT[type].calculateIncome(level[y][x], nearRoad(x, y));
            pollutionTotal += ELEMENT[type].increasePollution(level[y][x]);
            basePop += ELEMENT[type].increasePopulation(level[y][x]);
            capacity += ELEMENT[type].increaseCapacity(level[y][x]);
        }
    }

    // Werte anpassen
    population = Math.min(basePop, capacity);
    pollution = Math.max(0, pollutionTotal);

    // Einkommen alle X Sekunden
    const now = Date.now();
    if (now - lastIncomeTime >= CONFIG.INCOME_INTERVAL_MS) {
        money += income;
        lastIncomeTime = now;
    }

    // Menschen und Autos bewegen
    people.forEach(movePerson);
    cars.forEach(moveCar);

    // Katastrophen und Warnungen
    triggerDisaster();
    checkWarnings();
}

/* ============================================================
   8. DARSTELLUNG (RENDERING)
   ============================================================ */

/**
 * Zeichnet das gesamte Spielfeld.
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Alle Felder zeichnen
    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
        for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
            const type = map[y][x];
            ctx.fillStyle = ELEMENT[type].color || "#333";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

            // Draw image if available
            if (ELEMENT[type].image && LOADED_IMAGES[type]) {
                const img = LOADED_IMAGES[type];
                if (img.complete) {
                    ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }


            ctx.strokeStyle = "#222";
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // Autos zeichnen
    for (const car of cars) {
        if (car && car.x !== undefined && car.y !== undefined) {
            ctx.fillStyle = "red";
            ctx.fillRect(
                car.x * tileSize + tileSize / 4,
                car.y * tileSize + tileSize / 4,
                tileSize / 2,
                tileSize / 2
            );
        }
    }

    // Menschen zeichnen (optional - auskommentiert für bessere Performance)
    // for (const person of people) {
    //     ctx.fillStyle = "#fff";
    //     ctx.beginPath();
    //     ctx.arc(
    //         person.x * tileSize + tileSize / 2,
    //         person.y * tileSize + tileSize / 2,
    //         tileSize / 4,
    //         0,
    //         2 * Math.PI
    //     );
    //     ctx.fill();
    // }

    // Statistiken anzeigen
    document.getElementById("stats").innerText =
        "Bevölkerung: " + Math.floor(population) +
        " | Geld: " + Math.floor(money) +
        " | Verschmutzung: " + pollution;
}

/* ============================================================
   9. SPEICHERN & LADEN
   ============================================================ */

/**
 * Speichert den aktuellen Spielstand im LocalStorage.
 */
function saveGame() {
    try {
        localStorage.setItem("cityMap", JSON.stringify(map));
        localStorage.setItem("cityMoney", money.toString());
        localStorage.setItem("cityPeople", JSON.stringify(people));
        console.log("Spiel gespeichert!");
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
    }
}

/**
 * Lädt einen gespeicherten Spielstand aus dem LocalStorage.
 */
function loadGame() {
    try {
        const savedMap = localStorage.getItem("cityMap");
        const savedMoney = localStorage.getItem("cityMoney");
        const savedPeople = localStorage.getItem("cityPeople");

        if (savedMap) {
            map = JSON.parse(savedMap);
            money = parseFloat(savedMoney);
            people = JSON.parse(savedPeople);
            console.log("Spiel geladen!");
        }
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

/* ============================================================
   10. HAUPTSCHLEIFE (GAME LOOP)
   ============================================================ */

/**
 * Die Haupt-Spielschleife.
 */
function gameLoop() {
    simulate();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

/* --- Start --- */
initMap();
buildStartCity();
// initPeople();
initCars();
setType(currentBuildingType);
preloadImages();
draw();
gameLoop();