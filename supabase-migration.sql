-- Migration: aggiunge supporto per Menu Proteico (weekly), Young Menu (buffet)
-- e basePrice/day per sezioni/piatti speciali

-- Aggiungi colonne a category_order
ALTER TABLE category_order ADD COLUMN IF NOT EXISTS section_type TEXT DEFAULT 'ala_carte' CHECK (section_type IN ('ala_carte', 'weekly', 'buffet'));
ALTER TABLE category_order ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2);

-- Aggiungi colonna day a menu_items (per Menu Proteico)
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS day TEXT;

-- Aggiorna RLS policies per le nuove colonne (già coperte dalle policy esistenti)

-- Rimuovi NOT NULL da type (la nuova UI non usa più la suddivisione cibo/vini)
ALTER TABLE category_order ALTER COLUMN "type" DROP NOT NULL;
ALTER TABLE category_order ALTER COLUMN "type" SET DEFAULT 'cibo';

-- Seed: popola le categorie ISIDE (rimuovi vecchie righe, inserisci nuove)
TRUNCATE category_order CASCADE;
TRUNCATE menu_items CASCADE;

INSERT INTO category_order (name, section_type, base_price, "order") VALUES
  ('Antipasto', 'ala_carte', NULL, 0),
  ('Primi', 'ala_carte', NULL, 1),
  ('Secondi', 'ala_carte', NULL, 2),
  ('Contorni', 'ala_carte', NULL, 3),
  ('Insalata da comporre', 'ala_carte', NULL, 4),
  ('Bar & Colazione', 'ala_carte', NULL, 5),
  ('Piadine', 'ala_carte', NULL, 6),
  ('Dolci', 'ala_carte', NULL, 7),
  ('Menu Proteico', 'weekly', 5.50, 8),
  ('Young Menu', 'buffet', NULL, 9),
  ('Vini', 'ala_carte', NULL, 10),
  ('Cocktail', 'ala_carte', NULL, 11),
  ('Bevande', 'ala_carte', NULL, 12);

INSERT INTO menu_items (category, name, description, price, day) VALUES
  -- Menu Proteico
  ('Menu Proteico', 'Uova sode', 'Con contorno di zucchine e riso bianco', 0, 'Lunedì'),
  ('Menu Proteico', 'Pennette integrali', 'Con tagliata di pollo e pomodorino fresco', 0, 'Martedì'),
  ('Menu Proteico', 'Salmone al forno', 'Con fagiolino e riso', 0, 'Mercoledì'),
  ('Menu Proteico', 'Insalata mista', 'Lattuga, carote e tonno, pane integrale', 0, 'Giovedì'),
  ('Menu Proteico', 'Pizza', 'Margherita / Prosciutto e funghi / Margherita con crudo', 0, 'Venerdì'),

  -- Young Menu
  ('Young Menu', 'Aperitivo Cocktail Bar', 'Chips, Cocktail analcolici, Succhi, Acqua, Coca Cola', 0, NULL),
  ('Young Menu', 'Cena a Buffet', 'Arancinette, Pizzette miste, Paninetti farciti, Paninetto hamburger vitello, Nugget pollo, Panino cotoletta', 0, NULL),
  ('Young Menu', 'Dessert', 'Crepes o Pancake in bella vista', 0, NULL),

  -- Antipasto
  ('Antipasto', 'Piatto di bresaola con scaglie di grana', NULL, 8.00, NULL),
  ('Antipasto', 'Polpettine di carne al sugo di pomodoro', NULL, 7.00, NULL),
  ('Antipasto', 'Insalata Caprese', NULL, 5.00, NULL),
  ('Antipasto', 'Crudo e melone', 'Secondo disponibilità', 7.00, NULL),
  ('Antipasto', 'Roast Beef con scaglie di grana', 'Riduzione al Cerasuolo', 8.00, NULL),

  -- Primi
  ('Primi', 'Tagliatelle con pesto alla siciliana', NULL, 6.00, NULL),
  ('Primi', 'Ravioli di brasato di manzo', 'Burro fuso e salvia', 6.50, NULL),
  ('Primi', 'Risotto alla milanese', 'Con guanciale croccante', 7.00, NULL),

  -- Secondi
  ('Secondi', 'Petto di pollo alla griglia', NULL, 6.00, NULL),
  ('Secondi', 'Scaloppa al limone o funghi', NULL, 7.00, NULL),
  ('Secondi', 'Salmone alla griglia', NULL, 8.00, NULL),
  ('Secondi', 'Omelette con prosciutto cotto e formaggio', NULL, 5.00, NULL),
  ('Secondi', 'Uova sode', NULL, 4.00, NULL),
  ('Secondi', 'Bistecca alla palermitana', NULL, 8.00, NULL),

  -- Contorni
  ('Contorni', 'Pomodori e capperi', NULL, 4.00, NULL),
  ('Contorni', 'Patate al forno', NULL, 4.00, NULL),
  ('Contorni', 'Verdure grigliate', 'Zucchine, melanzana, pomodoro', 5.00, NULL),
  ('Contorni', 'Insalata di finocchio', NULL, 3.00, NULL),
  ('Contorni', 'Insalata di cetriolo', NULL, 3.00, NULL),
  ('Contorni', 'Insalata mista', NULL, 4.00, NULL),

  -- Insalata da comporre
  ('Insalata da comporre', 'Insalata Mista Personalizzata', 'Base: lattuga, misticanza, carota, mais, pomodoro. Proteina: tonno, uovo, pollo.', 6.00, NULL),

  -- Bar & Colazione
  ('Bar & Colazione', 'Caffè', NULL, 1.00, NULL),
  ('Bar & Colazione', 'Cappuccino', NULL, 2.00, NULL),
  ('Bar & Colazione', 'Croissant', 'Gocce di cioccolato, Cereali e miele, Vuoto, Treccia alle noci', 1.50, NULL),
  ('Bar & Colazione', 'Crostata', 'Al cioccolato, Albicocca o Ciliegia', 2.50, NULL),
  ('Bar & Colazione', 'Torta di mele', NULL, 2.50, NULL),
  ('Bar & Colazione', 'Toast', 'Prosciutto cotto/crudo e formaggio, Bresaola, Uovo, Tacchino', 2.50, NULL),

  -- Piadine
  ('Piadine', 'Piadina P.Cotto', 'Formaggio, lattuga e pomodoro', 6.50, NULL),
  ('Piadine', 'Piadina P.Crudo', 'Formaggio, lattuga e pomodoro', 6.50, NULL),
  ('Piadine', 'Piadina Bresaola', 'Formaggio, scaglie di grana, lattuga e pomodoro', 7.00, NULL),
  ('Piadine', 'Piadina Petto di Pollo', 'Formaggio, lattuga e pomodoro', 8.00, NULL),
  ('Piadine', 'Piadina P.Cotto e Formaggio', NULL, 5.00, NULL),
  ('Piadine', 'Piadina P.Crudo e Formaggio', NULL, 5.00, NULL),

  -- Dolci
  ('Dolci', 'Torta di mela', NULL, 3.00, NULL),
  ('Dolci', 'Torta di ricotta e pera', NULL, 3.00, NULL),
  ('Dolci', 'Crostata di frutta', NULL, 3.00, NULL),
  ('Dolci', 'Crostata ai frutti rossi', NULL, 3.00, NULL),
  ('Dolci', 'Gelato confezionato', 'Vari prezzi', 0.00, NULL),
  ('Dolci', 'Granita di limone', NULL, 2.50, NULL),

  -- Vini
  ('Vini', 'Barone Montalto - Nero d''Avola', NULL, 18.00, NULL),
  ('Vini', 'Barone Montalto - Grillo', NULL, 16.00, NULL),
  ('Vini', 'Spumante extra dry', NULL, 16.00, NULL),
  ('Vini', 'Mionetto - Prosecco', NULL, 18.00, NULL),

  -- Cocktail
  ('Cocktail', 'Cocktail Classici', NULL, 7.00, NULL),

  -- Bevande
  ('Bevande', 'Acqua 0,5 l', NULL, 1.00, NULL),
  ('Bevande', 'Acqua 1 l', NULL, 2.00, NULL),
  ('Bevande', 'Bevanda in vetro 33 cl', NULL, 2.50, NULL),
  ('Bevande', 'Bevanda in lattina 33 cl', NULL, 2.00, NULL),
  ('Bevande', 'Birra Messina 33 cl', NULL, 3.00, NULL);
