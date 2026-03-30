(function () {
    'use client';

    /**
     * Kuzzle HTTP Client
     * ==================
     * Einfacher HTTP-Client für Kuzzle im Browser (ohne SDK)
     * Verwendet die native Kuzzle HTTP API
     */

    /**
     * Kuzzle-Konfiguration
     */
    const KUZZLE_CONFIG = {
        baseUrl: "https://kuzzle.iriarte-mendez.de",
        index: "metropolia",
        collection: "player_stats",
        collectionMappings: {
            mappings: {
                dynamic: false,
                _meta: {
                    version: "1.0.0"
                },
                properties: {
                    player: {
                        type: "text"
                    },
                    population: {
                        type: "integer"
                    },
                    money: {
                        type: "integer"
                    },
                    pollution: {
                        type: "integer"
                    },
                    timestamp: {
                        type: "long"
                    },
                    updatedAt: {
                        type: "text"
                    }
                }
            }
        },
        collectionQuery: {
            query: {
                match_all: {}
            },
            sort: [
                {population: 'desc'},
                {money: 'desc'}
            ],
            size: 50
        },
        pushStatsIntervallMs: 10000,
        pullStatsIntervallMs: 4000,
    };

    /**
     * App-Zustand - Standardwerten
     */
    const state = {
        isConnected: false,
        // Für spätere Authentifizierung
        authToken: null,
    };

    class KuzzleRequest {
        /**
         * @param {string} endpoint - API-Endpunkt
         * @param {string} method - HTTP-Methode
         * @param {Object} body - Request-Body
         * @param {Object} headers - Request-Headers
         */
        constructor(endpoint, method = 'GET', body = null, headers = {}) {
            this.endpoint = endpoint;
            this.method = method;
            this.body = body;
            this.headers = {
                'Content-Type': 'application/json',
                ...headers
            };
        }

        serializedBody() {
            return this.body !== null ? JSON.stringify(this.body) : null;
        }
    }

    class KuzzleClient {
        state = {};

        constructor(state) {
            this.state = {...state};
        }

        isConnected() {
            return this.state.isConnected;
        }

        /**
         * Sendet eine Anfrage an Kuzzle
         *
         * @param {KuzzleRequest} request
         */
        async send(request) {
            const url = `${KUZZLE_CONFIG.baseUrl}${request.endpoint}`;
            const headers = request.headers;
            const method = request.method;

            if (this.state.authToken) {
                headers['Authorization'] = `Bearer ${this.state.authToken}`;
            }

            const options = {
                method,
                headers
            };

            if (request.body) {
                options.body = request.serializedBody();
            }

            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                console.error('Kuzzle Request Fehler:', error);
                throw error;
            }
        }

        /**
         * Initialisiert die Kuzzle-Verbindung
         */
        async init() {
            await this.checkConnection();
            if (this.isConnected()) {
                await this.setupStorage();
            }
        }

        /**
         * Prüft die Verbindung zu Kuzzle
         * @returns {boolean}
         */
        async checkConnection() {
            try {
                // Verwende einen einfachen API-Call zur Verbindungsprüfung
                const result = await this.send(new KuzzleRequest('/_serverInfo'));

                if (result && result.status === 200) {
                    this.state.isConnected = true;
                    return true;
                }

                return false;
            } catch (error) {
                this.state.isConnected = false;

                return false;
            }
        }

        /**
         * Erstellt den Index und die Collection (falls nicht vorhanden)
         */
        async setupStorage() {
            try {
                // Index & Collection erstellen
                try {
                    await this.send(new KuzzleRequest(
                        `/${KUZZLE_CONFIG.index}/${KUZZLE_CONFIG.collection}`,
                        'PUT',
                        KUZZLE_CONFIG.collectionMappings
                    ));
                } catch (e) {
                    // Collection existiert bereits - das ist okay
                    console.log("Collection existiert bereits");
                }

                return true;
            } catch (error) {
                console.error("Fehler beim Setup:", error);
                return false;
            }
        }
    }

    class GameStatsPublisher {
        /**
         * @param {string} uid
         * @param {KuzzleClient} client
         */
        constructor(uid, client) {
            this.uid = uid;
            this.client = client
        }

        getBuildings(map) {
            const buildings = [];
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    const type = map[y][x];
                    if (type !== 'EMPTY') {
                        buildings.push({x, y, type});
                    }
                }
            }

            return buildings;
        }

        collectStats() {
            const documentId = this.uid;
            const nickname = getOrCreateNickname();

            return {
                player: nickname?.nickname || 'Mr. X',
                buildings: this.getBuildings(map),
                population: population,
                money: money,
                pollution: pollution,
                timestamp: Date.now(),
                updatedAt: new Date().toISOString()
            };
        }

        async publishStats() {
            if (!this.client.isConnected()) {
                console.warn("Nicht mit Kuzzle verbunden!");
                return Promise.reject("Nicht mit Kuzzle verbunden!");
            }

            try {
                const document = this.collectStats();
                const result = await this.client.send(new KuzzleRequest(
                    `/${KUZZLE_CONFIG.index}/${KUZZLE_CONFIG.collection}/${this.uid}`,
                    'PUT',
                    document
                ));

                return Promise.resolve(result);
            } catch (error) {
                console.error("❌ Player stats nicht gespeichert!", error);

                return Promise.reject("❌ Player stats nicht gespeichert!");
            }
        }
    }

    class HighscoreLoader {
        /**
         * @param {KuzzleClient} client
         */
        constructor(client) {
            this.client = client
        }

        async loadHighscores() {
            try {
                const documents = await this.client.send(new KuzzleRequest(
                    `/${KUZZLE_CONFIG.index}/${KUZZLE_CONFIG.collection}/_search`,
                    'POST',
                    KUZZLE_CONFIG.collectionQuery
                ));

                return documents.result?.hits
                    .map((doc) => doc._source)
                    .sort((a, b) => {
                        if (b.population !== a.population) {
                            return b.population - a.population;
                        }

                        return b.money - a.money;
                    }) || [];
            } catch (error) {
                return [];
            }
        }
    }

    // Display highscores in the table
    function displayHighscores(highscores) {
        const tbody = document.getElementById('highscores-body');

        if (highscores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="no-scores">Noch keine Einträge. Spiele jetzt und sei der Erste!</td></tr>';
            return;
        }

        tbody.innerHTML = highscores.map((score, index) => `
                <tr>
                    <td class="rank">${index + 1}</td>
                    <td>${score.player}</td>
                    <td>${score.population.toLocaleString('de-DE')}</td>
                    <td>${score.money.toLocaleString('de-DE')} €</td>
                    <td>${score.updatedAt}</td>
                </tr>
            `).join('');
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', async () => {
            const client = new KuzzleClient(state);

            if (window.location.pathname.includes('/game')) {
                const handler = new GameStatsPublisher(getOrCreateUid(), client);

                client.init().then(() => {
                    console.log("{PlayerMode} Kuzzle-Client bereit!");

                    setInterval(async () => {
                        await handler.publishStats();
                    }, KUZZLE_CONFIG.pushStatsIntervallMs);
                });

            } else {
                const handler = new HighscoreLoader(client);

                client.init().then(() => {
                    console.log("{BoardMode} Kuzzle-Client bereit!");

                    setInterval(async () => {
                        await handler.loadHighscores().then((highscores) => displayHighscores(highscores));
                    }, KUZZLE_CONFIG.pullStatsIntervallMs);
                });

            }
        });
    }
})();