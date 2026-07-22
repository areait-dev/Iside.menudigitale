-- Aggiorna Menu Dipendente con i nuovi piatti settimanali

UPDATE menu_items
SET name = 'Zuppetta fredda di zucchina lunga',
    description = 'Con patate e pomodorino',
    allergens = ARRAY[]::TEXT[]
WHERE category = 'Menu Dipendente' AND day = 'Lunedì';

UPDATE menu_items
SET name = 'Insalata di riso',
    description = NULL,
    allergens = ARRAY[]::TEXT[]
WHERE category = 'Menu Dipendente' AND day = 'Martedì';

UPDATE menu_items
SET name = 'Pollo saporito con ciliegino',
    description = NULL,
    allergens = ARRAY[]::TEXT[]
WHERE category = 'Menu Dipendente' AND day = 'Mercoledì';

UPDATE menu_items
SET name = 'Pinsa',
    description = 'Margherita o con prosciutto crudo',
    allergens = ARRAY['Glutine','Latte']
WHERE category = 'Menu Dipendente' AND day = 'Giovedì';

UPDATE menu_items
SET name = 'Insalata con il tonno',
    description = NULL,
    allergens = ARRAY['Pesce']
WHERE category = 'Menu Dipendente' AND day = 'Venerdì';
