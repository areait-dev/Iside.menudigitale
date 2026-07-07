-- Aggiunge colonna display_area (TEXT) alla tabella menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS display_area TEXT;
