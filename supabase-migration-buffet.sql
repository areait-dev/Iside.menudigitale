-- Migration: aggiunge categoria Buffet Menu e relativi piatti

INSERT INTO category_order (name, section_type, base_price, "order")
SELECT 'Buffet Menu', 'buffet', 35.00, COALESCE(MAX("order") + 1, 0)
FROM category_order;

INSERT INTO menu_items (category, name, description, price) VALUES
  ('Buffet Menu', 'Aperitivo', 'Pizzette e Focaccine, Paninetto con hamburger, Tartine con prosciutto e maionese', 0),
  ('Buffet Menu', 'Isola dei Primi', 'Lasagna alla bolognese, Sformato di anelletti alla siciliana, Insalata di riso alla cantonese, Insalata di pasta con pesto, basilico e scaglie di grana', 0),
  ('Buffet Menu', 'Isola della Carne', 'Arrosto di manzo, Tartà di vitello, Roastbeef con grana, rucola e pomodorino, Involtino di carne con prosciutto e formaggio, Stinco brasato', 0),
  ('Buffet Menu', 'Isola dei Fritti', 'Arancinette al ragù, Arancinette spinaci e mozzarella, Verdure in pastella, Alette di pollo alla texana', 0),
  ('Buffet Menu', 'Isola dei Contorni', 'Insalata mista, Patate al forno, Verdure grigliate, Patatine fritte', 0),
  ('Buffet Menu', 'Bevande', 'Prosecco, Vino rosso, Vino bianco, Acqua, Coca Cola', 0);
