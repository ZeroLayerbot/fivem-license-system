-- Beispieldaten einfügen
USE lic;

-- Admin-Benutzer erstellen (Passwort: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@fivem-license.de', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin');

-- Test-User erstellen (Passwort: user123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('testuser', 'user@fivem-license.de', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'user');

-- Beispiel-Lizenzen
INSERT INTO licenses (license_key, user_id, server_name, server_ip, max_players, expires_at) VALUES 
('FVM-2024-ABCD-1234-EFGH', 2, 'Test Roleplay Server', '127.0.0.1:30120', 64, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FVM-2024-WXYZ-5678-IJKL', 2, 'Community Server', '192.168.1.100:30120', 32, DATE_ADD(NOW(), INTERVAL 60 DAY));

-- Server-Status initialisieren
INSERT INTO server_status (license_id, is_online, current_players) VALUES 
(1, TRUE, 12),
(2, FALSE, 0);
