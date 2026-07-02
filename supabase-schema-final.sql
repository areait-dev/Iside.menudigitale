-- =====================================================================
-- supabase-schema-final.sql
-- Stato finale consolidato del database, equivalente all'esecuzione in
-- sequenza di:
--   supabase-schema.sql -> supabase-migration.sql ->
--   supabase-migration-allergens.sql -> supabase-migration-buffet.sql ->
--   supabase-dipendente.sql -> supabase-fix.sql -> supabase-fix-giorni.sql ->
--   supabase-oggi.sql -> supabase-prezzo.sql -> supabase-proteico.sql ->
--   supabase-cleanup.sql
--
-- Le versioni intermedie/duplicate di "Menu Dipendente" (create da
-- supabase-dipendente.sql e supabase-fix.sql) NON sono incluse: qui c'è
-- solo la versione finale prodotta da supabase-cleanup.sql
-- (section_type='employee', base_price=NULL, con descrizioni sui giorni).
--
-- Idempotente: rieseguibile senza errori grazie a IF NOT EXISTS e
-- ON CONFLICT DO UPDATE/NOTHING. Per abilitare ON CONFLICT su menu_items
-- (che non ha una chiave naturale) viene introdotto un indice UNIQUE su
-- (category, name, COALESCE(day, '')).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABELLE BASE
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS category_order (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'cibo',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. COLONNE AGGIUNTE DALLE MIGRATION (menu proteico/buffet, allergeni)
-- ---------------------------------------------------------------------

ALTER TABLE category_order
  ADD COLUMN IF NOT EXISTS section_type TEXT DEFAULT 'ala_carte';

ALTER TABLE category_order
  ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2);

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS day TEXT;

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}';

-- Constraint finale su section_type (include 'employee', aggiunto da
-- supabase-dipendente.sql). DROP + ADD per idempotenza.
ALTER TABLE category_order DROP CONSTRAINT IF EXISTS category_order_section_type_check;
ALTER TABLE category_order ADD CONSTRAINT category_order_section_type_check
  CHECK (section_type IN ('ala_carte', 'weekly', 'buffet', 'employee'));

-- ---------------------------------------------------------------------
-- 3. VINCOLI DI UNICITA' (necessari per ON CONFLICT idempotente)
-- ---------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS ux_category_order_name
  ON category_order (name);

CREATE UNIQUE INDEX IF NOT EXISTS ux_menu_items_category_name_day
  ON menu_items (category, name, COALESCE(day, ''));

CREATE INDEX IF NOT EXISTS idx_menu_items_category_name
  ON menu_items (category, name);

-- ---------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_order ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Chiunque può leggere il menu"
    ON menu_items FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Chiunque può leggere le categorie"
    ON category_order FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Utenti autenticati possono inserire menu_items"
    ON menu_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Utenti autenticati possono aggiornare menu_items"
    ON menu_items FOR UPDATE
    USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Utenti autenticati possono eliminare menu_items"
    ON menu_items FOR DELETE
    USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Utenti autenticati possono inserire category_order"
    ON category_order FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Utenti autenticati possono aggiornare category_order"
    ON category_order FOR UPDATE
    USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Utenti autenticati possono eliminare category_order"
    ON category_order FOR DELETE
    USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ---------------------------------------------------------------------
-- 5. CATEGORIE (stato finale, ordine corretto post supabase-fix.sql /
--    supabase-cleanup.sql). Menu Proteico e Menu Dipendente sono
--    'employee' (post supabase-proteico.sql / supabase-cleanup.sql),
--    entrambi con base_price finale: Menu Proteico 5.50, Menu Dipendente
--    NULL (sovrascritto dal reinsert di cleanup.sql, eseguito per ultimo).
-- ---------------------------------------------------------------------

INSERT INTO category_order (name, section_type, base_price, "order") VALUES
  ('Antipasto',             'ala_carte', NULL, 0),
  ('Primi',                 'ala_carte', NULL, 1),
  ('Secondi',                'ala_carte', NULL, 2),
  ('Contorni',               'ala_carte', NULL, 3),
  ('Insalata da comporre',   'ala_carte', NULL, 4),
  ('Bar & Colazione',        'ala_carte', NULL, 5),
  ('Croissant',              'ala_carte', NULL, 6),
  ('Crostata',               'ala_carte', NULL, 7),
  ('Toast',                  'ala_carte', NULL, 8),
  ('Piadine',                'ala_carte', NULL, 9),
  ('Dolci',                  'ala_carte', NULL, 10),
  ('Menu Proteico',          'employee',  5.50, 11),
  ('Young Menu',             'buffet',    NULL, 12),
  ('Menu Dipendente',        'employee',  5.50, 13),
  ('Buffet Menu',            'buffet',    35.00, 13),
  ('Vini',                   'ala_carte', NULL, 14),
  ('Cocktail',               'ala_carte', NULL, 15),
  ('Bevande',                'ala_carte', NULL, 16)
ON CONFLICT (name) DO UPDATE SET
  section_type = EXCLUDED.section_type,
  base_price   = EXCLUDED.base_price,
  "order"      = EXCLUDED."order";

-- NOTA: 'Menu Dipendente' e 'Buffet Menu' condividono order=13 nello
-- stato finale reale (nessun vincolo di unicità su "order" nei file
-- originali). Fedele al comportamento osservato, non corretto qui.

-- ---------------------------------------------------------------------
-- 6. PIATTI - Menu Proteico (settimanale, da supabase-migration.sql)
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Menu Proteico', 'Uova sode', 'Con contorno di zucchine e riso bianco', 0, 'Lunedì'),
  ('Menu Proteico', 'Pennette integrali', 'Con tagliata di pollo e pomodorino fresco', 0, 'Martedì'),
  ('Menu Proteico', 'Salmone al forno', 'Con fagiolino e riso', 0, 'Mercoledì'),
  ('Menu Proteico', 'Insalata mista', 'Lattuga, carote e tonno, pane integrale', 0, 'Giovedì'),
  ('Menu Proteico', 'Pizza', 'Margherita / Prosciutto e funghi / Margherita con crudo', 0, 'Venerdì')
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 7. PIATTI - Young Menu
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Young Menu', 'Aperitivo Cocktail Bar', 'Chips, Cocktail analcolici, Succhi, Acqua, Coca Cola', 0, NULL),
  ('Young Menu', 'Cena a Buffet', 'Arancinette, Pizzette miste, Paninetti farciti, Paninetto hamburger vitello, Nugget pollo, Panino cotoletta', 0, NULL),
  ('Young Menu', 'Dessert', 'Crepes o Pancake in bella vista', 0, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 8. PIATTI - Antipasto / Primi / Secondi / Contorni /
--    Insalata da comporre
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Antipasto', 'Piatto di bresaola con scaglie di grana', NULL, 8.00, NULL),
  ('Antipasto', 'Polpettine di carne al sugo di pomodoro', NULL, 7.00, NULL),
  ('Antipasto', 'Insalata Caprese', NULL, 5.00, NULL),
  ('Antipasto', 'Crudo e melone', 'Secondo disponibilità', 7.00, NULL),
  ('Antipasto', 'Roast Beef con scaglie di grana', 'Riduzione al Cerasuolo', 8.00, NULL),

  ('Primi', 'Tagliatelle con pesto alla siciliana', NULL, 6.00, NULL),
  ('Primi', 'Ravioli di brasato di manzo', 'Burro fuso e salvia', 6.50, NULL),
  ('Primi', 'Risotto alla milanese', 'Con guanciale croccante', 7.00, NULL),

  ('Secondi', 'Petto di pollo alla griglia', NULL, 6.00, NULL),
  ('Secondi', 'Scaloppa al limone o funghi', NULL, 7.00, NULL),
  ('Secondi', 'Salmone alla griglia', NULL, 8.00, NULL),
  ('Secondi', 'Omelette con prosciutto cotto e formaggio', NULL, 5.00, NULL),
  ('Secondi', 'Uova sode', NULL, 4.00, NULL),
  ('Secondi', 'Bistecca alla palermitana', NULL, 8.00, NULL),

  ('Contorni', 'Pomodori e capperi', NULL, 4.00, NULL),
  ('Contorni', 'Patate al forno', NULL, 4.00, NULL),
  ('Contorni', 'Verdure grigliate', 'Zucchine, melanzana, pomodoro', 5.00, NULL),
  ('Contorni', 'Insalata di finocchio', NULL, 3.00, NULL),
  ('Contorni', 'Insalata di cetriolo', NULL, 3.00, NULL),
  ('Contorni', 'Insalata mista', NULL, 4.00, NULL),

  ('Insalata da comporre', 'Insalata Mista Personalizzata', 'Base: lattuga, misticanza, carota, mais, pomodoro. Proteina: tonno, uovo, pollo.', 6.00, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 9. PIATTI - Bar & Colazione (versione ridotta: Croissant/Crostata/
--    Toast originali rimossi da supabase-fix.sql a favore di categorie
--    dedicate)
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Bar & Colazione', 'Caffè', NULL, 1.00, NULL),
  ('Bar & Colazione', 'Cappuccino', NULL, 2.00, NULL),
  ('Bar & Colazione', 'Torta di mele', NULL, 2.50, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- Rimuove le vecchie righe aggregate (Croissant/Crostata/Toast con
-- descrizione) rimaste da un'eventuale esecuzione di supabase-migration.sql
DELETE FROM menu_items WHERE category = 'Bar & Colazione' AND name = 'Croissant' AND description IS NOT NULL;
DELETE FROM menu_items WHERE category = 'Bar & Colazione' AND name = 'Crostata' AND description IS NOT NULL;
DELETE FROM menu_items WHERE category = 'Bar & Colazione' AND name = 'Toast' AND description IS NOT NULL;

-- ---------------------------------------------------------------------
-- 10. PIATTI - Croissant / Crostata / Toast (categorie dedicate,
--     supabase-fix.sql)
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Croissant', 'Vuoto', NULL, 1.50, NULL),
  ('Croissant', 'Gocce al cioccolato', NULL, 1.50, NULL),
  ('Croissant', 'Cereali e miele', NULL, 1.50, NULL),
  ('Croissant', 'Treccia alle noci', NULL, 1.50, NULL),

  ('Crostata', 'Al cioccolato', NULL, 2.50, NULL),
  ('Crostata', 'Albicocca', NULL, 2.50, NULL),
  ('Crostata', 'Ciliegia', NULL, 2.50, NULL),

  ('Toast', 'Prosciutto cotto e formaggio', NULL, 2.50, NULL),
  ('Toast', 'Prosciutto crudo e formaggio', NULL, 2.50, NULL),
  ('Toast', 'Bresaola, formaggio e scaglie di grana', NULL, 2.50, NULL),
  ('Toast', 'Uovo, formaggio, lattuga e pomodoro', NULL, 2.50, NULL),
  ('Toast', 'Tacchino, formaggio, lattuga e pomodoro', NULL, 2.50, NULL),
  ('Toast', 'Supplemento', NULL, 1.00, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 11. PIATTI - Piadine / Dolci
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Piadine', 'Piadina P.Cotto', 'Formaggio, lattuga e pomodoro', 6.50, NULL),
  ('Piadine', 'Piadina P.Crudo', 'Formaggio, lattuga e pomodoro', 6.50, NULL),
  ('Piadine', 'Piadina Bresaola', 'Formaggio, scaglie di grana, lattuga e pomodoro', 7.00, NULL),
  ('Piadine', 'Piadina Petto di Pollo', 'Formaggio, lattuga e pomodoro', 8.00, NULL),
  ('Piadine', 'Piadina P.Cotto e Formaggio', NULL, 5.00, NULL),
  ('Piadine', 'Piadina P.Crudo e Formaggio', NULL, 5.00, NULL),

  ('Dolci', 'Torta di mela', NULL, 3.00, NULL),
  ('Dolci', 'Torta di ricotta e pera', NULL, 3.00, NULL),
  ('Dolci', 'Crostata di frutta', NULL, 3.00, NULL),
  ('Dolci', 'Crostata ai frutti rossi', NULL, 3.00, NULL),
  ('Dolci', 'Gelato confezionato', 'Vari prezzi', 0.00, NULL),
  ('Dolci', 'Granita di limone', NULL, 2.50, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 12. PIATTI - Vini / Cocktail / Bevande
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Vini', 'Barone Montalto - Nero d''Avola', NULL, 18.00, NULL),
  ('Vini', 'Barone Montalto - Grillo', NULL, 16.00, NULL),
  ('Vini', 'Spumante extra dry', NULL, 16.00, NULL),
  ('Vini', 'Mionetto - Prosecco', NULL, 18.00, NULL),

  ('Cocktail', 'Cocktail Classici', NULL, 7.00, NULL),

  ('Bevande', 'Acqua 0,5 l', NULL, 1.00, NULL),
  ('Bevande', 'Acqua 1 l', NULL, 2.00, NULL),
  ('Bevande', 'Bevanda in vetro 33 cl', NULL, 2.50, NULL),
  ('Bevande', 'Bevanda in lattina 33 cl', NULL, 2.00, NULL),
  ('Bevande', 'Birra Messina 33 cl', NULL, 3.00, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 13. PIATTI - Buffet Menu (supabase-migration-buffet.sql)
-- ---------------------------------------------------------------------

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Buffet Menu', 'Aperitivo', 'Pizzette e Focaccine, Paninetto con hamburger, Tartine con prosciutto e maionese', 0, NULL),
  ('Buffet Menu', 'Isola dei Primi', 'Lasagna alla bolognese, Sformato di anelletti alla siciliana, Insalata di riso alla cantonese, Insalata di pasta con pesto, basilico e scaglie di grana', 0, NULL),
  ('Buffet Menu', 'Isola della Carne', 'Arrosto di manzo, Tartà di vitello, Roastbeef con grana, rucola e pomodorino, Involtino di carne con prosciutto e formaggio, Stinco brasato', 0, NULL),
  ('Buffet Menu', 'Isola dei Fritti', 'Arancinette al ragù, Arancinette spinaci e mozzarella, Verdure in pastella, Alette di pollo alla texana', 0, NULL),
  ('Buffet Menu', 'Isola dei Contorni', 'Insalata mista, Patate al forno, Verdure grigliate, Patatine fritte', 0, NULL),
  ('Buffet Menu', 'Bevande', 'Prosecco, Vino rosso, Vino bianco, Acqua, Coca Cola', 0, NULL)
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;

-- ---------------------------------------------------------------------
-- 14. PIATTI - Menu Dipendente (VERSIONE FINALE, da supabase-cleanup.sql
--     eseguito per ultimo: descrizione presente, prezzo 0, un piatto
--     per ciascun giorno feriale)
-- ---------------------------------------------------------------------

-- Rimuove eventuali righe residue di versioni intermedie (es. "Piatto
-- del giorno" da supabase-fix.sql) prima di reinserire la versione
-- finale, per evitare duplicati con day uguale ma name diverso.
DELETE FROM menu_items WHERE category = 'Menu Dipendente';

INSERT INTO menu_items (category, name, description, price, day) VALUES
  ('Menu Dipendente', 'Crudo e melone', 'Menu definitivo disponibile dal pomeriggio', 0, 'Lunedì'),
  ('Menu Dipendente', 'Piatto Iside: crostino di pane di segale, salmone mais e avocado', 'Menu definitivo disponibile dal pomeriggio', 0, 'Martedì'),
  ('Menu Dipendente', 'Insalata di riso con tonno', 'Menu definitivo disponibile dal pomeriggio', 0, 'Mercoledì'),
  ('Menu Dipendente', 'Pollo al pane saporito e insalata di ciliegino', 'Menu definitivo disponibile dal pomeriggio', 0, 'Giovedì'),
  ('Menu Dipendente', 'Pinsa con mozzarella e prosciutto cotto all''uscita', 'Menu definitivo disponibile dal pomeriggio', 0, 'Venerdì')
ON CONFLICT (category, name, COALESCE(day, '')) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price;
