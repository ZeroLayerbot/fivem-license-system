````markdown
# 🎮 FiveM License System

Ein professionelles Lizenzverwaltungssystem für FiveM-Server – mit modernem Liquid-Glass-Design, reaktiver Oberfläche und erweiterten Admin-Funktionen.

---

## 🚀 Installation & Setup

### ✅ Voraussetzungen

- **Node.js** v18+
- **MySQL** oder MariaDB
- **npm** oder **yarn**

---

### 📁 Projekt klonen

```bash
mkdir fivem-license-system && cd fivem-license-system
# Falls mit Git:
# git clone https://github.com/ZeroLayerbot/fivem-license-system.git .
````

---

### 📦 Abhängigkeiten installieren

```bash
npm install --legacy-peer-deps
# oder
yarn install
```

---

### 🛢️ Datenbank einrichten

1. MySQL starten und mit Root verbinden
2. SQL-Befehle ausführen:

```sql
CREATE DATABASE lic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lic'@'localhost' IDENTIFIED BY 'YOURPASSWORD';
GRANT ALL PRIVILEGES ON lic.* TO 'lic'@'localhost';
FLUSH PRIVILEGES;
```

3. SQL-Skripte (`01-create-tables.sql`, `02-seed-data.sql`, `03-update-script-licenses.sql`) über die Weboberfläche oder manuell ausführen.

---

### ⚙️ Umgebungsvariablen

Erstelle `.env.local`:

```env
JWT_SECRET=openssl rand -hex 64 # <- ersetzen!
NODE_ENV=development
```

---

### 🧪 Entwicklungsmodus starten

```bash
npm run dev
# oder
yarn dev
```

📍 Webinterface: [http://localhost:3000](http://localhost:3000)

---

### 📦 Produktionsmodus starten

```bash
npm run build && npm start
```

---

## 📊 Datenbank-Setup über Webinterface

1. Starte den Dev-Server
2. Öffne `http://localhost:3000`
3. Führe Schritt für Schritt aus:

   * `01-create-tables.sql`
   * `02-seed-data.sql`
   * `03-update-script-licenses.sql`

---

## 👤 Standard-Anmeldedaten

**Admin:**

* Benutzer: `admin`
* Passwort: `admin123`

**Test-User:**

* Benutzer: `testuser`
* Passwort: `user123`

---

## 🎨 Features

### ✨ UI

* Liquid Glass Design (Blur, Transparenz)
* Light/Dark Mode
* Responsive & animiert (Framer Motion)

### 🔐 Authentifizierung

* Registrierung & Login
* JWT Token
* Rollen (Admin/User)

### 📋 Lizenzverwaltung

* Eigene & globale Lizenzen einsehen
* Admin kann Lizenzen erstellen, bearbeiten, löschen
* Lizenzstatus umschaltbar

### 👥 Benutzerverwaltung

* Benutzer anzeigen, bearbeiten, erstellen
* Accounts deaktivieren oder löschen

### 📈 Statistiken

* Übersicht über User, Server, Lizenzen
* Realtime-Spielerstatus
* Admin-Dashboard

---

## 🗂️ Projektstruktur

```plaintext
fivem-license-system/
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── licenses/
│   ├── admin/
│   └── register/
├── components/
│   ├── ui/
│   ├── glass-card.tsx
│   └── navigation.tsx
├── contexts/
├── lib/
├── scripts/
└── public/
```

---

## 🔧 Konfiguration

### 📁 `lib/database.ts`

```ts
const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "lic",
  password: "YOURPASSWORD",
  database: "lic",
  charset: "utf8mb4",
};
```

### 🔑 JWT

Setze den `JWT_SECRET` in `.env.local`. Ein Fallback-Wert wird zwar verwendet, ist aber **nicht** für Produktion geeignet.

---

## 📝 API Endpoints

### 🔐 Auth

* `POST /api/auth/login`
* `POST /api/auth/register`
* `GET /api/auth/me`

### 📋 Lizenzen

* `GET /api/licenses`
* `POST /api/licenses`
* `PATCH /api/licenses/[id]`
* `DELETE /api/licenses/[id]`

### 👤 Benutzer

* `GET /api/admin/users`
* `POST /api/admin/users`
* `PATCH /api/admin/users/[id]`
* `DELETE /api/admin/users/[id]`

### 🔄 FiveM

* `POST /api/fivem/heartbeat`
* `POST /api/fivem/validate`
* `POST /api/fivem/validate-script`

---

## 🚀 Deployment

### Vercel (Empfohlen)

1. Repository pushen
2. Mit Vercel verbinden
3. `.env.local`-Werte in Vercel setzen
4. Vercel erledigt Build + Deployment automatisch

### Eigenes Hosting

```bash
npm run build &&
npm install --legacy-peer-deps &&
npm start
```

---

## 🛠️ Entwicklung

### Neue Features

* Neue APIs in `app/api/`
* React-Komponenten in `components/`
* Neue Seiten in `app/`
* SQL-Skripte im `scripts/`-Ordner

### Styling

* Tailwind CSS
* shadcn/ui
* Framer Motion
* Custom Liquid-Glass CSS

---

## 🐛 Troubleshooting

### ❌ DB-Verbindung

* Läuft MySQL?
* Richtige Daten in `lib/database.ts`?
* Firewall-Ports offen?

### ❌ JWT Fehler

* `.env.local` vorhanden?
* Browser-Cache leeren

### ❌ Build schlägt fehl?

```bash
rm -rf node_modules package-lock.json && npm install --legacy-peer-deps
```

* Node.js v18 prüfen!

---

## 📞 Support

1. Lies dieses README sorgfältig!
2. Logs prüfen (Konsole & Browser)
3. API-Endpunkte via Postman testen
4. Erstelle ein GitHub-Issue oder kontaktiere den Projektbetreuer

---

## 🔄 Updates

1. Neues Repo pullen oder Dateien aktualisieren
2. `npm install --legacy-peer-deps`
3. Neue SQL-Skripte ausführen
4. Server neu starten

---

**Viel Erfolg mit deinem FiveM License System!**
🎯 Entwickelt für maximale Kontrolle, modernes UI & volle FiveM-Kompatibilität.


