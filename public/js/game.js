/* --- Einstellungen --- */
const grid = 30,
    canvas = document.getElementById("game"),
    ctx = canvas.getContext("2d"),
    size = canvas.width / grid;


const ELEMENT = {
    EMPTY: {
        id: "EMPTY",
        cost: 10,
        name: "Löschen",
        color: "#333",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    ROAD: {
        id: "ROAD",
        cost: 20,
        name: "Straße",
        color: "#777",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    RES: {
        id: "RES",
        cost: 60,
        name: "Wohnhaus",
        color: "#2ecc71",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => level * 6,
        increasePollution: (level) => 0,
    },
    HIGH: {
        id: "HIGH",
        cost: 300,
        name: "Hochhaus",
        color: "#1abc9c",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    COM: {
        id: "COM",
        cost: 150,
        name: "Gewerbe",
        color: "#3498db",
        calculateIncome: (level, isNearRoad) => isNearRoad == true ? 1234123 : 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    MALL: {
        id: "MALL",
        cost: 200,
        name: "Mall",
        color: "#f39c12",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    IND: {
        id: "IND",
        cost: 180,
        name: "Industrie",
        color: "#e67e22",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    INDPARK: {
        id: "INDPARK",
        cost: 300,
        name: "Industriepark",
        color: "#d35400",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    PARK: {
        id: "PARK",
        cost: 30,
        name: "Park",
        color: "#27ae60",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    POWER: {
        id: "POWER",
        cost: 220,
        name: "Kraftwerk",
        color: "#f1c40f",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    SOLAR: {
        id: "SOLAR",
        cost: 200,
        name: "Solarpark",
        color: "#f7dc6f",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    SCHOOL: {
        id: "SCHOOL",
        cost: 120,
        name: "Schule",
        color: "#9b59b6",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    HOSPITAL: {
        id: "HOSPITAL",
        cost: 150,
        name: "Krankenhaus",
        color: "#e74c3c",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    AIRPORT: {
        id: "AIRPORT",
        cost: 500,
        name: "Flughafen",
        color: "#95a5a6",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    PORT: {
        id: "PORT",
        cost: 400,
        name: "Hafen",
        color: "#2980b9",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    SUBWAY: {
        id: "SUBWAY",
        cost: 250,
        name: "U-Bahn",
        color: "#bdc3c7",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    RESEARCH: {
        id: "RESEARCH",
        cost: 400,
        name: "Forschung",
        color: "#8e44ad",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    STADIUM: {
        id: "STADIUM",
        cost: 600,
        name: "Stadion",
        color: "#c0392b",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    MUSEUM: {
        id: "MUSEUM",
        cost: 350,
        name: "Museum",
        color: "#d35400",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    POLICE: {
        id: "POLICE",
        cost: 200,
        name: "Polizeistation",
        color: "#34495e",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    FIRE: {
        id: "FIRE",
        cost: 200,
        name: "Feuerwache",
        color: "#e74c3c",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    LIBRARY: {
        id: "LIBRARY",
        cost: 150,
        name: "Bibliothek",
        color: "#f1c40f",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    MARKET: {
        id: "MARKET",
        cost: 250,
        name: "Markt",
        color: "#16a085",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    HOTEL: {
        id: "HOTEL",
        cost: 300,
        name: "Hotel",
        color: "#e67e22",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    FARM: {
        id: "FARM",
        cost: 180,
        name: "Farm",
        color: "#27ae60",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
    WIND: {
        id: "WIND",
        cost: 250,
        name: "Windpark",
        color: "#7f8c8d",
        calculateIncome: (level, isNearRoad) => 0,
        increasePopulation: (level) => 0,
        increasePollution: (level) => 0,
    },
};


let current = ELEMENT.RES.id,
    map = [],
    level = [],
    money = 50.00,
    population = 50,
    pollution = 0,
    mouseDown = false,
    gameOver = false,
    warning = false,
    lastIncomeTime = Date.now(),
    people = [],
    cars = [,];

/* --- Init Map --- */
for (let y = 0; y < grid; y++) {
    map[y] = [];
    level[y] = [];
    for (let x = 0; x < grid; x++) {
        map[y][x] = ELEMENT.EMPTY.id;
        level[y][x] = 1;
    }
}

/* Startcity */
map[10][10] = ELEMENT.RES.id;
map[10][11] = ELEMENT.RES.id;
map[11][10] = ELEMENT.RES.id;
map[11][11] = ELEMENT.RES.id;
map[9][10] = ELEMENT.ROAD.id;
map[9][11] = ELEMENT.ROAD.id;
map[12][10] = ELEMENT.COM.id;
map[13][10] = ELEMENT.POWER.id;

/* --- SetType --- */
function setType(t) {
    current = t;
    document.getElementById("current").innerText = ELEMENT[t].name;
    document.getElementById("cost").innerText = ELEMENT[t].cost;
}
setType(current,);

/* --- Mouse --- */
canvas.addEventListener("mousedown", () => mouseDown = true);
canvas.addEventListener("mouseup", () => mouseDown = false);
canvas.addEventListener("mouseleave", () => mouseDown = false);
canvas.addEventListener("mousemove", e => { if (mouseDown) place(e) });
canvas.addEventListener("click", place);

function place(e) {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / size);
    const y = Math.floor((e.clientY - rect.top) / size);
    if (x < 0 || y < 0 || x >= grid || y >= grid) return;
    let cost = ELEMENT[current].cost;
    if (current === ELEMENT.EMPTY.id) {
        if (map[y][x] != ELEMENT.EMPTY.id && money >= cost) {
            map[y][x] = ELEMENT.EMPTY.id;
            money -= cost;
        }
        return;
    }
    if (money >= cost) {
        map[y][x] = current;
        money -= cost;
        level[y][x] = 1;
    }
}

/* --- Road Check --- */
function nearRoad(x, y) {
    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
    for (let d of dirs) {
        let nx = x + d[0],
            ny = y + d[1];
        if (nx >= 0 && ny >= 0 && nx < grid && ny < grid) { if (map[ny][nx] === ELEMENT.ROAD.id) return true; }
    }
    return false;
}

/* --- Draw --- */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
            const type = map[y][x];
            ctx.fillStyle = ELEMENT[type].color || "#333"
            ctx.fillRect(x * size, y * size, size, size);
            ctx.strokeStyle = "#222";
            ctx.strokeRect(x * size, y * size, size, size);
        }
    }
    for (let car of cars) {
        if (car && car.x && car.y) {
            ctx.fillStyle = "red";
            ctx.fillRect(car.x * size + size / 4, car.y * size + size / 4, size / 2, size / 2);
        }
    }
    for (let p of people) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x * size + size / 2, p.y * size + size / 2, size / 4, 0, 2 * Math.PI);
        ctx.fill();
    }
    document.getElementById("stats").innerText = "Bevölkerung: " + Math.floor(population) + " | Geld: " + Math.floor(money) + " | Verschmutzung: " + pollution;
}

/* --- Simulation --- */
function simulate() {
    let basePop = 0,
        capacity = 0,
        income = 0,
        poll = 0;
    for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
            let type = map[y][x];

            income += ELEMENT[type].calculateIncome(level[y][x], nearRoad(x, y));
            poll += ELEMENT[type].increasePollution(level[y][x]);
            basePop += ELEMENT[type].increasePopulation(level[y][x]);

            // if (t === ELEMENT.RES.id) basePop += 6 * level[y][x];
            // if (t === ELEMENT.HIGH.id) basePop += 3099999999999999999999999999999999999999999999999 * level[y][x];
            // if (t === ELEMENT.POWER.id) capacity += 300;
            // if (t === ELEMENT.SOLAR.id) capacity += 150;
            // /* Einkommen pro Gebäude */
            // if (t === ELEMENT.COM.id && nearRoad(x, y)) income += 9999999999999999999999999999999;
            // if (t === ELEMENT.MALL.id) income += 2;
            // if (t === ELEMENT.IND.id && nearRoad(x, y)) income += 1.5;
            // if (t === ELEMENT.INDPARK.id) income += 3;
            // if (t === ELEMENT.HIGH.id && nearRoad(x, y)) income += 0.5;
            // if (t === ELEMENT.AIRPORT.id) income += 5;
            // if (t === ELEMENT.PORT.id) income += 4;
            // /* Neue Gebäude Einkommen */
            // if (t === ELEMENT.RESEARCH) income += 3;
            // if (t === ELEMENT.STADIUM.id) income += 4;
            // if (t === ELEMENT.MUSEUM.id) income += 2;
            // if (t === ELEMENT.POLICE.id) income += 0;
            // if (t === ELEMENT.FIRE.id) income += 0;
            // if (t === ELEMENT.LIBRARY.id) income += 1;
            // if (t === ELEMENT.MARKET.id) income += 2;
            // if (t === ELEMENT.HOTEL.id) income += 3;
            // if (t === ELEMENT.FARM.id) income += 1;
            // if (t === ELEMENT.WIND.id) income += 2;
            // /* Verschmutzung */
            // if (t === ELEMENT.IND.id) poll += 4;
            // if (t === ELEMENT.PARK.id) poll -= 3;
            // if (t === ELEMENT.SOLAR.id) poll -= 2;
        }
    }
    population = basePop;
    if (population > capacity) population = capacity;
    pollution = Math.max(0, poll);
    /* Income alle 10s */
    let now = Date.now();
    if (now - lastIncomeTime >= 1000) {
        money += income;
        lastIncomeTime = now;
    }
    /* Menschen bewegen */
    people.forEach(p => {
        let dir = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        let d = dir[Math.floor(Math.random() * 4)];
        let nx = p.x + d[0],
            ny = p.y + d[1];
        if (nx >= 0 && ny >= 0 && nx < grid && ny < grid) { if (map[ny][nx] === ELEMENT.ROAD.id || map[ny][nx] === ELEMENT.PARK.id || map[ny][nx] === ELEMENT.RES.id) p.x = nx, p.y = ny; }
    });
    /* Autos bewegen */
    cars.forEach(c => {
        let dir = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        let d = dir[Math.floor(Math.random() * 4)];
        let nx = c.x + d[0],
            ny = c.y + d[1];
        if (nx >= 0 && ny >= 0 && nx < grid && ny < grid) {
            if (map[ny][nx] === ELEMENT.ROAD.id) {
                c.x = nx;
                c.y = ny;
            }
        }
    });
    /* Naturkatastrophen */
    if (Math.random() < 0.0005) {
        let x = Math.floor(Math.random() * grid),
            y = Math.floor(Math.random() * grid);
        map[y][x] = ELEMENT.EMPTY.id;
        console.log("Katastrophe!");
    }
    /* Warnung */
    if ((population <= 0 || money <= 0) && !warning) {
        warning = true;
        document.getElementById("warning").style.display = "block";
        setTimeout(() => {
            if (population <= 0 || money <= 0) {
                gameOver = true;
                document.getElementById("gameOver").style.display = "block";
            }
            warning = false;
            document.getElementById("warning").style.display = "none";
        }, 60000);
    }
}
/* --- Init People --- */
for (let i = 0; i < population; i++) { people.push({ x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) }); }
/* --- Loop --- */
function loop() {
    simulate();
    draw();
    if (!gameOver) requestAnimationFrame(loop);
}
draw();
loop();
/* --- Save/Load --- */
function saveGame() {
    localStorage.setItem("cityMap", JSON.stringify(map));
    localStorage.setItem("cityMoney", money);
    localStorage.setItem("cityPeople", JSON.stringify(people));
}

function loadGame() {
    let m = localStorage.getItem("cityMap"),
        mo = localStorage.getItem("cityMoney"),
        p = localStorage.getItem("cityPeople");
    if (m) {
        map = JSON.parse(m);
        money = parseFloat(mo);
        people = JSON.parse(p);
    }
}