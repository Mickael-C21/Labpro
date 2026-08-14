-- =====================================================================
-- LabConnect / Call_center_API -- Export SQL (schéma + données de démo)
-- Base cible : PostgreSQL 14+
-- Généré à partir des modèles SQLAlchemy (Call_center_API/model.py)
-- et des données de démo (Call_center_API/seed_products.py)
-- =====================================================================

BEGIN;

DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 👤 Utilisateurs (clients + administrateurs)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR,
    phone VARCHAR,
    role VARCHAR DEFAULT 'client'
);

-- 📦 Produits catalogue
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    category VARCHAR,
    price INTEGER,
    image VARCHAR,
    long_description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    brand VARCHAR,
    model VARCHAR,
    condition VARCHAR,
    year INTEGER,
    features TEXT
);

-- 🧑‍💼 Agents du call center
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    email VARCHAR
);

-- 📞 Appels / demandes de rendez-vous
CREATE TABLE calls (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    agent_id INTEGER REFERENCES agents(id),
    call_type VARCHAR,
    name VARCHAR,
    phone VARCHAR,
    email VARCHAR,
    subject TEXT,
    scheduled_at TIMESTAMP,
    status VARCHAR DEFAULT 'pending',
    feedback TEXT,
    result VARCHAR,
    created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- =====================================================================
-- Données de démo
-- =====================================================================

-- Agents par défaut (créés automatiquement au démarrage de l'API, voir main.py)
INSERT INTO agents (name, email) VALUES
('Agent Thomas', 'thomas@labconnect.fr'),
('Agent Sophie', 'sophie@labconnect.fr');

-- Compte administrateur de test (back-office /admin)
-- Identifiants : admin@test.fr / admin123
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin LabConnect', 'admin@test.fr', '$2b$12$Gk3VIEJ9kDUS3kFz0mMZn.qotvWdsKbqS5fEpG79rGSsrM9PultjS', '0000000000', 'admin');

-- Compte client de test (espace client)
-- Identifiants : client@test.fr / client123
INSERT INTO users (name, email, password, phone, role) VALUES
('Client Test', 'client@test.fr', '$2b$12$gzQc1MXAz6/LecmC/9aMSeKJd2Zy2Efz.V6DAs8g2ndQSixkW/TXC', '0600000000', 'client');

-- Produits catalogue (données de démo issues de seed_products.py)
INSERT INTO products (name, description, category, price, image, long_description, in_stock, brand, model, condition, year, features) VALUES
('Autoclave de Laboratoire Vertical 50L', 'Autoclave à vapeur pour la stérilisation d''instruments et de milieux de culture.', 'autoclaves', 2490, 'https://images.unsplash.com/photo-1531340246822-65e19c2e121f?auto=format&fit=crop&w=1024&q=80', 'Autoclave vertical en acier inoxydable 304 avec cuve de 50 litres, conçu pour la stérilisation fiable des instruments de laboratoire, de la verrerie et des milieux de culture. Cycles programmables et sécurité renforcée.', TRUE, 'LabSteril', 'AV-50', 'Neuf', 2024, '["Cuve inox 304", "Capacité 50 L", "Écran de contrôle digital", "Cycles programmables", "Système de sécurité double porte"]'),
('Autoclave de Paillasse 24L', 'Autoclave compact pour petits laboratoires et cabinets dentaires.', 'autoclaves', 1290, 'https://images.unsplash.com/photo-1556228452-6e5d8c0a9e80?auto=format&fit=crop&w=1024&q=80', 'Autoclave de paillasse compact, idéal pour les cabinets dentaires, vétérinaires et petits laboratoires. Cycle rapide et faible encombrement.', TRUE, 'LabSteril', 'AP-24', 'Neuf', 2024, '["Capacité 24 L", "Cycle rapide", "Faible encombrement", "Séchage automatique", "Imprimante de traçabilité en option"]'),
('Autoclave Industriel 100L', 'Autoclave de grande capacité pour la stérilisation industrielle.', 'autoclaves', 4890, 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1024&q=80', 'Autoclave de grande capacité destiné aux laboratoires industriels et hospitaliers nécessitant des volumes de stérilisation importants.', TRUE, 'LabSteril', 'AI-100', 'Neuf', 2023, '["Capacité 100 L", "Usage intensif", "Panneau de contrôle avancé", "Registre de traçabilité", "Sécurité renforcée"]'),
('Réfrigérateur de Laboratoire 300L', 'Réfrigérateur médical à température régulée pour réactifs et échantillons.', 'refrigeration', 1690, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1024&q=80', 'Réfrigérateur de laboratoire à régulation précise de température, adapté à la conservation de réactifs, vaccins et échantillons biologiques.', TRUE, 'LabCold', 'RL-300', 'Neuf', 2024, '["Capacité 300 L", "Régulation +2°C à +8°C", "Alarme de température", "Porte vitrée verrouillable", "Enregistreur de données"]'),
('Congélateur -40°C Vertical 200L', 'Congélateur basse température pour la conservation longue durée d''échantillons.', 'refrigeration', 2990, 'https://images.unsplash.com/photo-1571168547429-5abfc36d5987?auto=format&fit=crop&w=1024&q=80', 'Congélateur vertical atteignant -40°C, conçu pour la conservation longue durée d''échantillons biologiques et de réactifs sensibles.', TRUE, 'LabCold', 'CV-40-200', 'Neuf', 2024, '["Température jusqu''à -40°C", "Capacité 200 L", "Isolation renforcée", "Alarme sonore et visuelle", "Batterie de secours en option"]'),
('Chambre Froide de Paillasse 50L', 'Petite enceinte réfrigérée pour la conservation d''échantillons au poste de travail.', 'refrigeration', 890, 'https://images.unsplash.com/photo-1470123808288-9a0418d7c5b6?auto=format&fit=crop&w=1024&q=80', 'Enceinte réfrigérée compacte destinée à la conservation immédiate d''échantillons directement au poste de travail.', TRUE, 'LabCold', 'CF-50', 'Neuf', 2023, '["Capacité 50 L", "Compact", "Faible bruit", "Régulation précise", "Idéal paillasse"]'),
('Balance Analytique de Précision 0,1mg', 'Balance analytique haute précision pour la pesée en laboratoire.', 'balances', 890, 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1024&q=80', 'Balance analytique offrant une précision de 0,1 mg, adaptée aux laboratoires de chimie, pharmacie et contrôle qualité.', TRUE, 'LabWeight', 'BA-01', 'Neuf', 2024, '["Précision 0,1 mg", "Portée 220 g", "Calibration automatique", "Pare-brise en verre", "Écran LCD rétroéclairé"]'),
('Balance de Précision 0,01g', 'Balance robuste pour les pesées courantes en laboratoire.', 'balances', 349, 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1024&q=80', 'Balance de précision destinée aux pesées courantes en laboratoire, robuste et facile à utiliser au quotidien.', TRUE, 'LabWeight', 'BP-02', 'Neuf', 2024, '["Précision 0,01 g", "Portée 2000 g", "Plateau inox", "Fonction tare", "Alimentation secteur ou batterie"]'),
('Balance Compteuse Industrielle', 'Balance dédiée au comptage de pièces et composants.', 'balances', 590, 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1024&q=80', 'Balance compteuse permettant le dénombrement rapide et précis de petites pièces en environnement industriel ou de laboratoire.', TRUE, 'LabWeight', 'BC-10', 'Neuf', 2023, '["Fonction de comptage", "Portée 3000 g", "Plateau large", "Mémoire multi-produits", "Interface RS-232"]'),
('Banc de Travail de Laboratoire Inox', 'Table de travail en acier inoxydable pour paillasse de laboratoire.', 'mobilier', 790, 'https://images.unsplash.com/photo-1558981285-8b8e3ad2f09f?auto=format&fit=crop&w=1024&q=80', 'Banc de travail en acier inoxydable, résistant à la corrosion et facile à nettoyer, adapté à un usage intensif en laboratoire.', TRUE, 'LabFurn', 'BT-150', 'Neuf', 2024, '["Acier inoxydable 304", "Surface facile à nettoyer", "Structure renforcée", "Étagère basse incluse", "Dimensions 150x60 cm"]'),
('Armoire de Stockage de Sécurité', 'Armoire ventilée pour le stockage de produits chimiques.', 'mobilier', 1190, 'https://images.unsplash.com/photo-1581092322736-2f0e860c5ccb?auto=format&fit=crop&w=1024&q=80', 'Armoire de sécurité ventilée destinée au stockage conforme de produits chimiques et de réactifs sensibles.', TRUE, 'LabFurn', 'AS-90', 'Neuf', 2023, '["Ventilation intégrée", "Portes verrouillables", "Bac de rétention", "Conforme aux normes de stockage", "Structure métallique renforcée"]'),
('Chaise Ergonomique de Laboratoire', 'Siège réglable pensé pour un usage prolongé en laboratoire.', 'mobilier', 219, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1024&q=80', 'Chaise ergonomique réglable en hauteur, conçue pour le confort du personnel de laboratoire lors de sessions prolongées.', TRUE, 'LabFurn', 'CH-05', 'Neuf', 2024, '["Réglage de hauteur", "Assise anti-acide", "Roulettes verrouillables", "Dossier ergonomique", "Facile à désinfecter"]'),
('Centrifugeuse de Laboratoire 4000 RPM', 'Centrifugeuse polyvalente pour la séparation d''échantillons.', 'analyseurs', 1590, 'https://images.unsplash.com/photo-1581093458791-9d42e3f6b0f7?auto=format&fit=crop&w=1024&q=80', 'Centrifugeuse de laboratoire atteignant 4000 tr/min, adaptée à la séparation d''échantillons biologiques et chimiques.', TRUE, 'LabSpin', 'CL-4000', 'Neuf', 2024, '["Vitesse jusqu''à 4000 RPM", "Rotor interchangeable", "Minuterie programmable", "Freinage automatique", "Faible niveau sonore"]'),
('Incubateur de Laboratoire 150L', 'Incubateur à température régulée pour cultures cellulaires et microbiologiques.', 'analyseurs', 1990, 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=1024&q=80', 'Incubateur offrant une régulation précise de température et d''humidité, adapté aux cultures cellulaires et microbiologiques.', TRUE, 'LabGrow', 'IN-150', 'Neuf', 2024, '["Capacité 150 L", "Régulation de température précise", "Contrôle d''humidité", "Alarme intégrée", "Intérieur inox"]'),
('Bain-Marie de Laboratoire Numérique', 'Bain-marie à régulation numérique pour incubations et réactions contrôlées.', 'analyseurs', 490, 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=1024&q=80', 'Bain-marie de laboratoire à régulation numérique de température, adapté aux incubations et réactions contrôlées.', TRUE, 'LabGrow', 'BM-20', 'Neuf', 2023, '["Régulation numérique", "Capacité 20 L", "Cuve inox", "Couvercle inclus", "Plage 5°C à 99°C"]'),
('Analyseur TOC de Laboratoire', 'Analyseur de carbone organique total pour le contrôle qualité de l''eau.', 'analyseurs', 6990, 'https://images.unsplash.com/photo-1568667256549-09482d0c5fe6?auto=format&fit=crop&w=1024&q=80', 'Analyseur TOC destiné au contrôle qualité de l''eau, utilisé en pharmacie, agroalimentaire et environnement.', TRUE, 'LabAnalyse', 'TOC-200', 'Neuf', 2024, '["Mesure du carbone organique total", "Interface logicielle dédiée", "Haute sensibilité", "Étalonnage automatique", "Connectivité USB"]'),
('Analyseur d''Humidité Infrarouge', 'Analyseur de taux d''humidité par dessiccation infrarouge.', 'analyseurs', 990, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1024&q=80', 'Analyseur d''humidité par dessiccation infrarouge, rapide et précis, adapté aux contrôles qualité en agroalimentaire et pharmacie.', TRUE, 'LabAnalyse', 'AH-IR', 'Neuf', 2024, '["Chauffage infrarouge", "Résultats rapides", "Écran tactile", "Mémoire multi-méthodes", "Plateau amovible"]'),
('Système de Purification d''Eau Type II', 'Purificateur d''eau de laboratoire pour usages courants.', 'purification', 1390, 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1024&q=80', 'Système de purification d''eau de type II, adapté à la préparation de réactifs et au nettoyage de verrerie en laboratoire.', TRUE, 'LabPure', 'PE-II', 'Neuf', 2024, '["Eau type II", "Débit continu", "Cartouches remplaçables", "Compact", "Faible maintenance"]'),
('Système de Purification d''Eau Ultra-Pure Type I', 'Purificateur haute performance pour applications analytiques exigeantes.', 'purification', 2790, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1024&q=80', 'Système de purification d''eau ultra-pure de type I, destiné aux applications analytiques et de recherche les plus exigeantes.', TRUE, 'LabPure', 'PE-I', 'Neuf', 2024, '["Eau type I ultra-pure", "Résistivité 18,2 MΩ·cm", "Écran de suivi qualité", "Cartouches haute capacité", "Robinet ergonomique"]'),
('Osmoseur de Laboratoire', 'Système d''osmose inverse pour la préproduction d''eau de laboratoire.', 'purification', 990, 'https://images.unsplash.com/photo-1555255396-3561c197e64c?auto=format&fit=crop&w=1024&q=80', 'Système d''osmose inverse permettant la préproduction d''eau à partir de l''eau du réseau, en amont des systèmes de purification.', TRUE, 'LabPure', 'OS-100', 'Neuf', 2023, '["Membrane osmose inverse", "Réservoir de stockage", "Compact", "Faible consommation", "Installation simple"]');

COMMIT;
