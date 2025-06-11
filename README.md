# FiveM License System

Ein professionelles Lizenzverwaltungssystem für FiveM Server mit modernem Liquid Glass Design und erweiterten Admin-Funktionen.

## 🚀 Installation und Setup

### Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass die folgenden Voraussetzungen auf Ihrem System installiert sind:

-   **Node.js** (Version 18 oder höher)
-   **MySQL Server** (oder eine kompatible Datenbank wie MariaDB)
-   **npm** oder **yarn** (als Paketmanager)

### 1. Projekt klonen/herunterladen

Erstellen Sie zuerst einen Ordner für Ihr Projekt und kopieren Sie alle Projektdateien dorthin. Wenn Sie Git verwenden, können Sie das Repository klonen:

```bash 
# Projekt-Ordner erstellen (falls noch nicht geschehen)
mkdir fivem-license-system
cd fivem-license-system

# Dateien in den Ordner kopieren oder Repository klonen
# Beispiel: git clone https://github.com/ZeroLayerbot/fivem-license-system.git .
```

### 2. Abhängigkeiten installieren

Navigieren Sie im Terminal in das Projektverzeichnis und installieren Sie alle erforderlichen Node.js-Abhängigkeiten:

```bash
npm install --legacy-peer-deps
# oder
yarn install
```

### 3. Datenbank einrichten

Das System verwendet MySQL als Datenbank. Führen Sie die folgenden Schritte aus, um Ihre Datenbank vorzubereiten:

1.  **MySQL Server starten:** Stellen Sie sicher, dass Ihr MySQL-Server läuft und auf dem Standardport (3306) erreichbar ist.
2.  **Datenbank und Benutzer erstellen:** Verbinden Sie sich als Root-Benutzer mit Ihrem MySQL-Server und führen Sie die folgenden SQL-Befehle aus, um die Datenbank `lic` und einen dedizierten Benutzer `lic` mit dem Passwort `YOURPASSWORD` zu erstellen. Sie können das Passwort natürlich anpassen.

    ```sql
    -- Verbinden Sie sich als Root-Benutzer mit MySQL
    CREATE DATABASE lic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE USER 'lic'@'localhost' IDENTIFIED BY 'YOURPASSWORD';
    GRANT ALL PRIVILEGES ON lic.* TO 'lic'@'localhost';
    FLUSH PRIVILEGES;
    ```

3.  **Tabellen erstellen und Seed-Daten einfügen:** Die notwendigen SQL-Skripte (`01-create-tables.sql`, `02-seed-data.sql`, `03-update-script-licenses.sql`) werden automatisch über die Weboberfläche ausgeführt, sobald Sie die Anwendung starten und die entsprechenden Schritte in der Benutzeroberfläche befolgen. Alternativ können Sie diese Skripte auch manuell über ein MySQL-Client-Tool ausführen.

### 4. Umgebungsvariablen (Optional, aber empfohlen)

Erstellen Sie eine `.env.local`-Datei im Hauptverzeichnis Ihres Projekts. Diese Datei wird von Next.js automatisch geladen und ist ideal für sensible Daten wie den JWT-Secret.

```env
JWT_SECRET=ihr-geheimer-jwt-schluessel-hier # Ersetzen Sie dies durch einen langen, zufälligen String (in putty: `openssl rand -hex 64`)
NODE_ENV=development
```

### 5. Entwicklungsserver starten

Um die Anwendung im Entwicklungsmodus zu starten, führen Sie den folgenden Befehl aus:

```bash
npm run dev
# oder
yarn dev
```

Die Anwendung ist nun unter `http://localhost:3000` erreichbar.

### 6. Produktionsserver starten

Für den Einsatz in einer Produktionsumgebung müssen Sie die Anwendung zuerst bauen und dann starten:

```bash
# Projekt für Produktion bauen
npm run build

# Produktionsserver starten
npm start
```

## 📊 Datenbank-Setup über die Weboberfläche

Nachdem Sie den Entwicklungsserver gestartet haben (`npm run dev`), können Sie die Datenbank-Skripte über die integrierte Ausführung in der Anwendung ausführen:

1.  Öffnen Sie Ihren Browser und navigieren Sie zu `http://localhost:3000`.
2.  Folgen Sie den Anweisungen in der Anwendung, um die SQL-Skripte auszuführen.
3.  Führen Sie zuerst `01-create-tables.sql` aus, um die grundlegenden Tabellen zu erstellen.
4.  Führen Sie dann `02-seed-data.sql` aus, um Beispieldaten (einschließlich Admin- und Testbenutzer) einzufügen.
5.  Führen Sie abschließend `03-update-script-licenses.sql` aus, um die Datenbank für Script-Lizenzen zu aktualisieren.

## 👤 Standard-Anmeldedaten

Nach dem Ausführen der Seed-Daten (`02-seed-data.sql`):

**Admin-Account:**
-   Benutzername: `admin`
-   Passwort: `admin123`

**Test-User:**
-   Benutzername: `testuser`
-   Passwort: `user123`

## 🎨 Features

### ✨ Design
-   **Liquid Glass Design** mit Transparenz und Unschärfe-Effekten
-   **Dark/Light Mode** Toggle
-   **Responsive Design** für alle Geräte
-   **Smooth Animationen** mit Framer Motion (ohne störende Hover-Verschwommenheit)

### 🔐 Authentifizierung
-   Benutzerregistrierung und -anmeldung
-   JWT-basierte Authentifizierung
-   Rollenbasierte Zugriffskontrolle (User/Admin)

### 📋 Lizenzverwaltung
-   **User:** Eigene Lizenzen anzeigen und verwalten
-   **Admin:** Alle Lizenzen verwalten, neue erstellen, **bestehende Lizenzen bearbeiten und löschen, sowie deren Aktivitätsstatus umschalten.**
-   Automatische Lizenzschlüssel-Generierung
-   Server-Status-Tracking

### 👥 Benutzerverwaltung (Admin-Panel)
-   **Admin:** Alle registrierten Benutzer anzeigen
-   **Admin:** Neue Benutzer erstellen
-   **Admin:** Bestehende Benutzer bearbeiten (Benutzername, E-Mail, Rolle)
-   **Admin:** Benutzer temporär deaktivieren/aktivieren
-   **Admin:** Benutzer vollständig löschen (inkl. aller zugehörigen Lizenzen)

### 📈 Statistiken
-   Gesamtanzahl Benutzer, Lizenzen, Server
-   Online-Server und aktive Spieler
-   Aktivitätsverlauf
-   Admin-Dashboard mit erweiterten Statistiken

## 🗂️ Projektstruktur

```
fivem-license-system/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (inkl. Admin- und Lizenz-APIs)
│   ├── dashboard/         # Dashboard Seite
│   ├── login/            # Login Seite
│   ├── licenses/         # Lizenzverwaltungsseite
│   ├── admin/            # Admin-Panel Seite
│   └── register/         # Registrierung
├── components/           # React Komponenten
│   ├── ui/              # shadcn/ui Komponenten
│   ├── glass-card.tsx   # Liquid Glass Karte (ohne Hover-Effekt)
│   └── navigation.tsx   # Navigation
├── contexts/            # React Contexts (Auth, Theme)
├── lib/                # Utility Funktionen (Datenbank, Auth, Utils)
├── scripts/            # SQL Skripte für Datenbank-Setup
└── public/             # Statische Dateien
```

## 🔧 Konfiguration

### Datenbankverbindung

Die Datenbankverbindung ist in `lib/database.ts` konfiguriert. Sie können diese Datei bearbeiten, um Ihre Datenbank-Zugangsdaten anzupassen:

```typescript
// lib/database.ts
const dbConfig = {
  host: "127.0.0.1", // Ihre Datenbank-Host-IP oder Domain (niemals localhost verwenden)
  port: 3306,        // Ihr Datenbank-Port
  user: "lic",       // Ihr Datenbank-Benutzername
  password: "YOURPASSWORD", // Ihr Datenbank-Passwort
  database: "lic",   // Ihr Datenbank-Name
  charset: "utf8mb4",
}
```

### JWT-Konfiguration

Der JWT-Secret wird für die Authentifizierung verwendet. Es wird dringend empfohlen, diesen in der `.env.local`-Datei zu setzen, wie unter Punkt 4 beschrieben. Wenn nicht gesetzt, wird ein Standardwert verwendet, der **nicht** für die Produktion geeignet ist.

## 📝 API Endpoints

Hier ist eine Übersicht der wichtigsten API-Endpunkte:

-   `POST /api/auth/login` - Benutzer anmelden
-   `POST /api/auth/register` - Benutzer registrieren
-   `GET /api/auth/me` - Aktueller Benutzer abrufen

-   `GET /api/licenses` - Lizenzen abrufen (alle für Admin, eigene für User)
-   `POST /api/licenses` - Neue Lizenz erstellen
-   `PATCH /api/licenses/[id]` - Lizenz aktualisieren (Admin oder Lizenzinhaber)
-   `DELETE /api/licenses/[id]` - Lizenz löschen (nur Admin)

-   `GET /api/admin/users` - Alle Benutzer abrufen (nur Admin)
-   `POST /api/admin/users` - Neuen Benutzer erstellen (nur Admin)
-   `PATCH /api/admin/users/[id]` - Benutzer aktualisieren (nur Admin)
-   `DELETE /api/admin/users/[id]` - Benutzer löschen (nur Admin)

-   `GET /api/stats` - Systemstatistiken abrufen

-   `POST /api/fivem/heartbeat` - FiveM Server Heartbeat senden
-   `POST /api/fivem/validate` - FiveM Server Lizenz validieren (Legacy)
-   `POST /api/fivem/validate-script` - FiveM Script-Lizenz validieren

## 🚀 Deployment

### Vercel (Empfohlen)

1.  Pushen Sie Ihr Projekt zu einem Git-Repository (z.B. GitHub, GitLab, Bitbucket).
2.  Verbinden Sie Ihr Repository mit Vercel.
3.  Konfigurieren Sie Ihre Umgebungsvariablen (insbesondere `JWT_SECRET`) in den Vercel-Projekteinstellungen.
4.  Vercel wird das Projekt automatisch bauen und deployen.

### Eigener Server

1.  Bauen Sie das Projekt für die Produktion: `npm run build`
2.  Kopieren Sie die generierten Dateien (`.next`-Ordner, `node_modules`, `package.json`, `public`-Ordner und Ihre `.env.local`-Datei) auf Ihren Server.
3.  Führen Sie auf dem Server `npm install --legacy-peer-deps` aus, um nur die benötigten Abhängigkeiten zu installieren.
4.  Starten Sie den Produktionsserver mit `npm start`.

## 🛠️ Entwicklung

### Neue Features hinzufügen

1.  Erstellen Sie neue API-Routen in `app/api/`.
2.  Entwickeln Sie wiederverwendbare React-Komponenten in `components/`.
3.  Fügen Sie neue Seiten in `app/` hinzu.
4.  Dokumentieren Sie alle Datenbankänderungen in neuen SQL-Skripten im Ordner `scripts/`.

### Styling

Das Projekt verwendet:
-   **Tailwind CSS** für schnelles und flexibles Styling.
-   **shadcn/ui** für vorgefertigte, anpassbare UI-Komponenten.
-   **Framer Motion** für flüssige Animationen.
-   **Custom CSS** für die Liquid Glass Effekte.

## 🐛 Troubleshooting

### Häufige Probleme

1.  **Datenbankverbindung fehlgeschlagen:**
    -   Stellen Sie sicher, dass Ihr MySQL-Server läuft.
    -   Überprüfen Sie die Anmeldedaten in `lib/database.ts`.
    -   Prüfen Sie Firewall-Einstellungen, die den Zugriff auf den MySQL-Port blockieren könnten.

2.  **JWT-Fehler (z.B. "Ungültiger Token"):**
    -   Stellen Sie sicher, dass `JWT_SECRET` in Ihrer `.env.local`-Datei gesetzt ist und dass es sich um einen langen, komplexen String handelt.
    -   Leeren Sie den Browser-Cache oder verwenden Sie den Inkognito-Modus.

3.  **Build-Fehler:**
    -   Löschen Sie den `node_modules`-Ordner und die `package-lock.json` (oder `yarn.lock`), und führen Sie dann `npm install --legacy-peer-depsl` erneut aus.
    -   Überprüfen Sie, ob Ihre Node.js-Version mindestens 18 ist.

### Logs

Der Entwicklungsserver zeigt alle Fehler in der Konsole an. Für die Produktion können Sie `console.log`-Statements für Debugging-Zwecke hinzufügen oder ein dediziertes Logging-System einrichten.

## 📞 Support

Bei Problemen oder Fragen:

1.  Lesen Sie diese `README.md`-Datei sorgfältig durch.
2.  Überprüfen Sie die Server-Logs und die Browser-Konsole auf Fehlermeldungen.
3.  Testen Sie die Datenbankverbindung und die API-Endpunkte manuell (z.B. mit Postman oder cURL).
4.  Wenn das Problem weiterhin besteht, erstellen Sie ein Issue in Ihrem GitHub-Repository (falls verfügbar) oder kontaktieren Sie den Support.

## 🔄 Updates

Um das System auf dem neuesten Stand zu halten:

1.  Laden Sie die neuesten Projektdateien herunter oder pullen Sie die Änderungen aus Ihrem Repository.
2.  Führen Sie `npm install --legacy-peer-deps` aus, falls neue Abhängigkeiten hinzugefügt wurden.
3.  Führen Sie alle neuen Datenbankmigrationen aus (z.B. neue SQL-Skripte im `scripts/`-Ordner).
4.  Starten Sie den Server neu.

---

**Viel Erfolg mit Ihrem FiveM License System! 🎮**

---

* ![Bild 1](/bilder/1.png)
* ![Bild 2](/bilder/2.png)
* ![Bild 3](/bilder/3.png)
* ![Bild 4](/bilder/4.png)
* ![Bild 5](/bilder/5.png)
* ![Bild 6](/bilder/6.png)
* ![Bild 7](/bilder/7.png)

