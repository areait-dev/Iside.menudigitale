-- Aggiunge colonna allergens (TEXT[]) alla tabella menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}';
