## 🚀 So startest du das Spiel

### Methode 1: Direkt im Browser öffnen

1. Öffne den Ordner `public`
2. Doppelklick auf `game.html`
3. Fertig! Das Spiel öffnet sich

### Methode 2: Mit einem lokalen Server (fortgeschritten)

Wenn du programmieren lernst, kannst du einen Server starten:

```bash
# Navigiere in den Projektordner
cd /path/to/MetroPolia

# Nutze einen der folgenden Befehle, um einen Server zu starten:

# Python: Starte einen einfachen Server
python3 -m http.server --directory public/ 8000

# PHP: Starte einen einfachen Server
php -S localhost:8000 -t public/ 

# NodeJS: Starte einen einfachen Server
npx http-server public/ -p 8000
```

Dann öffne im Browser: `http://localhost:8000/game.html`

---

## 📁 Wie ist das Projekt aufgebaut?

```
MetroPolia/
├── public/
│   ├── game.html          ← Die HTML-Seite mit dem Spielfeld
│   ├── index.html         ← Die Startseite
│   └── js/
│       └── game.js        ← Das Programm, das das Spiel steuert
├── scripts/
│   ├── save.sh            ← Speichert Änderungen auf Github
│   └── update.sh          ← Lädt Änderungen von Github
├── README.md              ← Informationen zum Spiel
└── CONTRIBUTE.md          ← Diese Datei!
```

### Was machen die Dateien?

- **game.html** - Das ist das Spiel! Hier sieht man das Spielfeld und alle Buttons
- **game.js** - Das "Gehirn" des Spiels. Hier steht:
    - Wie viel jedes Gebäude kostet
    - Was jedes Gebäude tut
    - Wie sich die Menschen und Autos bewegen
    - Wie Geld und Bevölkerung berechnet werden
---

## 🛠️ Für Leute, die programmieren wollen

Wenn du wissen willst, wie das Spiel funktioniert, schau dir die Datei `public/js/game.js` an!

---

### Die wichtigsten Teile im Code:

**Die Gebäude-Liste (ELEMENT)**
- Jedes Gebäude hat eine `id` (Name), `cost` (Kosten) und `color` (Farbe)
- Die Funktionen sagen, was das Gebäude tut

**Die Spielschleife (loop)**
- Läuft immer wieder und aktualisiert alles
- `simulate()` berechnet Geld, Leute und Smog
- `draw()` malt alles auf den Bildschirm

**Maus und Klicks**
- `place()` baut etwas, wenn du klickst
- `nearRoad()` prüft, ob ein Gebäude an einer Straße ist

---

### Speichern und Aktualisieren

Hast du den code verändert und möchtest deine Änderungen speichern?<br>
Benutze dieses Skript:

```sh
scripts/save.sh "Meine version: 🔨.⭐️.🍰"

# du kannst die Nachricht anpassen, damit du weißt, was du geändert hast
```

Oder wenn deine lokale Version veraltet ist. Kannst du Aktualisierungen 
herunterladen mit folgenden Skript:


```sh
scripts/update.sh
```

---

### Das ist alles....

```
Keine Angst, es ist nicht so kompliziert, wie es aussieht

Und wenn was kapput geht, kannst du im Editor immer die Änderungen rückgängig 
machen oder die Originaldatei wiederherstellen. 

Viel Spaß beim Erkunden! 🚀
```