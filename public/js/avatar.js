/**
 * Avatar & Nickname Generator
 * ===========================
 * Generiert automatische Spielernamen für MetroPolia
 *
 * Format: [Emoji] [Farbe] [Tier] [Eigenschaft] [Zahl]
 * Beispiel: 🦁 Goldener Löwe Mutig 123
 */

/* ============================================================
   KONFIGURATION
   ============================================================ */

const NICKNAME_CONFIG = {
    // Verfügbare Emojis
    emojis: [

        '😀', '🤪', '🤓', '🤩', '🤑', '😮', '😬',
        '😵‍💫', '🤯', '😎', '🧐', '😇', '🤠', '🥴',
        '🥳', '👻', '👽', '🤖', '🎃', '🤠', '🥺',
        '😍', '😶‍🌫️', '😤', '😡', '😭', '😢', '😥',
        '😓', '😴', '😷', '🤒', '🤕', '🤧', '🥶',
    ],

    // Farben
    colors: [
        'Gold', 'Silber', 'Bronze',
        'Rot', 'Blau', 'Grün', 'Gelb',
        'Orange', 'Lila', 'Rosa', 'Türkis',
        'Weiß', 'Schwarz', 'Braun',
        'Himmelblaue', 'Smaragd', 'Rubin',
        'Saphir', 'Diamant',
    ],

    // Tier-Namen
    animals: [
        'Löwe', 'Tiger', 'Bär', 'Panda', 'Fuchs', 'Hase',
        'Einhorn', 'Drache', 'Adler', 'Eule', 'Wolf', 'Schmetterling',
        'Delphin', 'Hai', 'Oktopus', 'Dino', 'Schildkröte', 'Papagei',
        'Delfin', 'Flamingo', 'Biene', 'Marienkäfer', 'Skorpion',
        'Schlange', 'Echse', 'Elefant', 'Giraffe', 'Zebra',
        'Pinguin', 'Känguru', 'Koala', 'Nashorn',
    ],

    // Positive Eigenschaften
    attributes: [
        'Mutig', 'Stark', 'Klug', 'Schnell', 'Freundlich',
        'Tapfer', 'Weise', 'Fröhlich', 'Tapfer', 'Furchtlos',
        'Brav', 'Toll', 'Super', 'Cool', 'Epic',
        'Legendär', 'Mächtig', 'Heldenhaft', 'Großartig',
        'Fantastisch', 'Wunderbar', 'Ruhig', 'Friedlich',
        'Energiegeladen', 'Cheerful', 'Fröhlich', 'Glücklich',
        'Optimistisch', 'Kreativ', 'Abenteuerlustig',
    ],

    // Min/Max für Zufallszahl
    minNumber: 100,
    maxNumber: 999
};

/* ============================================================
   FUNKTIONEN
   ============================================================ */

/**
 * Generiert einen zufälligen Nicknamen/Identifikation
 *
 * @returns {Object} - Enthält den vollständigen Namen und einzelne Teile
 * @returns {string} return.nickname - Der vollständige Nickname
 * @returns {string} return.emoji - Das Emoji
 * @returns {string} return.color - Die Farbe
 * @returns {string} return.animal - Das Tier
 * @returns {string} return.attribute - Die Eigenschaft
 * @returns {number} return.number - Die Zahl
 */
function generateNickname() {
    const emoji = randomItem(NICKNAME_CONFIG.emojis);
    const color = randomItem(NICKNAME_CONFIG.colors);
    const animal = randomItem(NICKNAME_CONFIG.animals);
    const attribute = randomItem(NICKNAME_CONFIG.attributes);
    const number = randomNumber(NICKNAME_CONFIG.minNumber, NICKNAME_CONFIG.maxNumber);

    const nickname = [emoji, color, attribute, animal, number].join('-');

    return {
        nickname,
        emoji,
        color,
        animal,
        attribute,
        number
    };
}

/**
 * Generiert mehrere einzigartige Nicknamen
 *
 * @param {number} count - Anzahl der zu generierenden Nicknamen
 * @returns {Array<Object>} - Array von Nickname-Objekten
 */
function generateNicknames(count) {
    const nicknames = [];
    const usedNames = new Set();

    let attempts = 0;
    const maxAttempts = count * 10; // Vermeidet Endlosschleife

    while (nicknames.length < count && attempts < maxAttempts) {
        const nicknameObj = generateNickname();

        // Prüfen, ob der Name bereits verwendet wurde
        if (!usedNames.has(nicknameObj.nickname)) {
            usedNames.add(nicknameObj.nickname);
            nicknames.push(nicknameObj);
        }

        attempts++;
    }

    return nicknames;
}

/**
 * Speichert den Nicknamen im LocalStorage
 *
 * @param {Object} nicknameObj - Das Nickname-Objekt
 */
function saveNickname(nicknameObj) {
    try {
        localStorage.setItem('metropolia_nickname', JSON.stringify(nicknameObj));
        console.log('Nickname gespeichert:', nicknameObj.nickname);
    } catch (error) {
        console.error('Fehler beim Speichern des Nicknamens:', error);
    }
}

/**
 * Lädt den gespeicherten Nicknamen aus dem LocalStorage
 *
 * @returns {Object|null} - Das gespeicherte Nickname-Objekt oder null
 */
function loadNickname() {
    try {
        const saved = localStorage.getItem('metropolia_nickname');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Fehler beim Laden des Nicknamens:', error);
    }
    return null;
}

/**
 * Prüft, ob bereits ein Nickname gespeichert ist.
 * Wenn nicht, wird ein neuer generiert und gespeichert.
 *
 * @returns {Object} - Das Nickname-Objekt
 */
function getOrCreateNickname() {
    let nickname = loadNickname();

    if (!nickname) {
        nickname = generateNickname();
        saveNickname(nickname);
    }

    return nickname;
}

/**
 * Generiert ein Unique User Identifier (UID) und
 * speichert es ihn im LocalStorage, falls noch nicht vorhanden...
 *
 * @returns {Object} - UID-String
 */
function getOrCreateUid() {
    let uid = localStorage.getItem('metropolia_uid');

    if (!uid) {
        uid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
        localStorage.setItem('metropolia_uid', uid);
    }

    return uid;
}

/**
 * Löscht den gespeicherten Nicknamen
 */
function clearNickname() {
    localStorage.removeItem('metropolia_nickname');
    console.log('Nickname gelöscht');
}

/**
 * Generiert einen neuen Nicknamen und überschreibt den alten
 *
 * @returns {Object} - Das neue Nickname-Objekt
 */
function regenerateNickname() {
    const newNickname = generateNickname();
    saveNickname(newNickname);
    return newNickname;
}

/* ============================================================
   HILFSFUNKTIONEN
   ============================================================ */

/**
 * Wählt ein zufälliges Element aus einem Array
 *
 * @param {Array} array - Das Array
 * @returns {*} - Ein zufälliges Element
 */
function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generiert eine zufällige Zahl zwischen min und max (inklusive)
 *
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number} - Die zufällige Zahl
 */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Zeigt den Nicknamen auf der Seite an
 *
 * @param {Object} nicknameObj - Das Nickname-Objekt
 * @param {string} elementId - Die ID des HTML-Elements
 */
function displayNickname(nicknameObj, elementId = 'nickname-display') {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = nicknameObj.nickname;
        element.dataset.nickname = JSON.stringify(nicknameObj);
    } else {
        console.warn(`Element mit ID "${elementId}" nicht gefunden`);
    }
}

/**
 * Fügt einen Button hinzu, um einen neuen Nicknamen zu generieren
 *
 * @param {string} containerId - Die ID des Container-Elements
 * @param {string} displayId - Die ID des Anzeige-Elements
 */
function addNicknameButton(containerId, displayId = 'nickname-display') {
    const container = document.getElementById(containerId);

    if (!container) {
        console.warn(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }

    // Prüfen, ob Button bereits existiert
    if (document.getElementById('regenerate-nickname-btn')) {
        return;
    }

    const button = document.createElement('button');
    button.id = 'regenerate-nickname-btn';
    button.textContent = '🎲 Neuer Nickname';
    button.style.marginLeft = '10px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', () => {
        const newNickname = regenerateNickname();
        displayNickname(newNickname, displayId);
    });

    container.appendChild(button);
}

/* ============================================================
   EXPORT
   ============================================================ */

// Exportiere für die Verwendung in anderen Dateien
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateNickname,
        generateNicknames,
        saveNickname,
        loadNickname,
        getOrCreateNickname,
        clearNickname,
        regenerateNickname,
        displayNickname,
        addNicknameButton
    };
}

/* ============================================================
   AUTO-INIT (optional)
   ============================================================ */

// Automatisch einen Nicknamen generieren beim Laden der Seite
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const nickname = getOrCreateNickname();
        console.log('Dein Nickname:', nickname.nickname);

        // Show the nickname
        const nick = getOrCreateNickname();
        displayNickname(nick);

        // Add regenerate button
        addNicknameButton('nickname-container', 'nickname-display');

        getOrCreateUid();
    });
}