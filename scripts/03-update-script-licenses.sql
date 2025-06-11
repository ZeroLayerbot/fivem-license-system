-- Script-Lizenzen Tabelle aktualisieren
USE lic;

-- Neue Spalte für Script-Namen hinzufügen
ALTER TABLE licenses ADD COLUMN script_name VARCHAR(100) NOT NULL AFTER license_key;

-- Server-IP und Port trennen für bessere Validierung
ALTER TABLE licenses ADD COLUMN server_port INT DEFAULT 30120 AFTER server_ip;

-- Index für bessere Performance bei Script-Validierung
CREATE INDEX idx_script_validation ON licenses(script_name, server_ip, server_port, is_active);

-- Beispiel-Script-Lizenzen einfügen
INSERT INTO licenses (license_key, script_name, user_id, server_name, server_ip, server_port, max_players, expires_at) VALUES 
('FVM-2024-TEST-1234-ABCD', 'esx_banking', 2, 'Test Roleplay Server', '127.0.0.1', 30120, 64, DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FVM-2024-SHOP-5678-EFGH', 'esx_shops', 2, 'Test Roleplay Server', '127.0.0.1', 30120, 64, DATE_ADD(NOW(), INTERVAL 60 DAY)),
('FVM-2024-CARS-9012-IJKL', 'vehicle_system', 2, 'Community Server', '192.168.1.100', 30120, 32, DATE_ADD(NOW(), INTERVAL 90 DAY));
