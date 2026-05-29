import type { MenuSection } from '@/types/menu'

let _idCounter = 0
function uid() {
  return `item_${++_idCounter}`
}

export const MENU_DATA: MenuSection[] = [
  {
    id: 'antipasto',
    title: 'Antipasto',
    type: 'ala_carte',
    order: 0,
    items: [
      { id: uid(), name: 'Piatto di bresaola con scaglie di grana', price: 8.00 },
      { id: uid(), name: 'Polpettine di carne al sugo di pomodoro', price: 7.00 },
      { id: uid(), name: 'Insalata Caprese', price: 5.00 },
      { id: uid(), name: 'Crudo e melone', description: 'Secondo disponibilità', price: 7.00 },
      { id: uid(), name: 'Roast Beef con scaglie di grana', description: 'Riduzione al Cerasuolo', price: 8.00 },
    ],
  },
  {
    id: 'primi',
    title: 'Primi',
    type: 'ala_carte',
    order: 1,
    items: [
      { id: uid(), name: 'Tagliatelle con pesto alla siciliana', price: 6.00 },
      { id: uid(), name: 'Ravioli di brasato di manzo', description: 'Burro fuso e salvia', price: 6.50 },
      { id: uid(), name: 'Risotto alla milanese', description: 'Con guanciale croccante', price: 7.00 },
    ],
  },
  {
    id: 'secondi',
    title: 'Secondi',
    type: 'ala_carte',
    order: 2,
    items: [
      { id: uid(), name: 'Petto di pollo alla griglia', price: 6.00 },
      { id: uid(), name: 'Scaloppa al limone o funghi', price: 7.00 },
      { id: uid(), name: 'Salmone alla griglia', price: 8.00 },
      { id: uid(), name: 'Omelette con prosciutto cotto e formaggio', price: 5.00 },
      { id: uid(), name: 'Uova sode', price: 4.00 },
      { id: uid(), name: 'Bistecca alla palermitana', price: 8.00 },
    ],
  },
  {
    id: 'contorni',
    title: 'Contorni',
    type: 'ala_carte',
    order: 3,
    items: [
      { id: uid(), name: 'Pomodori e capperi', price: 4.00 },
      { id: uid(), name: 'Patate al forno', price: 4.00 },
      { id: uid(), name: 'Verdure grigliate', description: 'Zucchine, melanzana, pomodoro', price: 5.00 },
      { id: uid(), name: 'Insalata di finocchio', price: 3.00 },
      { id: uid(), name: 'Insalata di cetriolo', price: 3.00 },
      { id: uid(), name: 'Insalata mista', price: 4.00 },
    ],
  },
  {
    id: 'insalata-comporre',
    title: 'Insalata da comporre',
    type: 'ala_carte',
    order: 4,
    items: [
      { id: uid(), name: 'Insalata Mista Personalizzata', description: 'Base: lattuga, misticanza, carota, mais, pomodoro. Proteina: tonno, uovo, pollo.', price: 6.00 },
    ],
  },
  {
    id: 'bar',
    title: 'Bar & Colazione',
    type: 'ala_carte',
    order: 5,
    items: [
      { id: uid(), name: 'Caffè', price: 1.00 },
      { id: uid(), name: 'Cappuccino', price: 2.00 },
      { id: uid(), name: 'Croissant', description: 'Gocce di cioccolato, Cereali e miele, Vuoto, Treccia alle noci', price: 1.50 },
      { id: uid(), name: 'Crostata', description: 'Al cioccolato, Albicocca o Ciliegia', price: 2.50 },
      { id: uid(), name: 'Torta di mele', price: 2.50 },
      { id: uid(), name: 'Toast', description: 'Prosciutto cotto/crudo e formaggio, Bresaola, Uovo, Tacchino', price: 2.50 },
    ],
  },
  {
    id: 'piadine',
    title: 'Piadine',
    type: 'ala_carte',
    order: 6,
    items: [
      { id: uid(), name: 'Piadina P.Cotto', description: 'Formaggio, lattuga e pomodoro', price: 6.50 },
      { id: uid(), name: 'Piadina P.Crudo', description: 'Formaggio, lattuga e pomodoro', price: 6.50 },
      { id: uid(), name: 'Piadina Bresaola', description: 'Formaggio, scaglie di grana, lattuga e pomodoro', price: 7.00 },
      { id: uid(), name: 'Piadina Petto di Pollo', description: 'Formaggio, lattuga e pomodoro', price: 8.00 },
      { id: uid(), name: 'Piadina P.Cotto e Formaggio', price: 5.00 },
      { id: uid(), name: 'Piadina P.Crudo e Formaggio', price: 5.00 },
    ],
  },
  {
    id: 'dolci',
    title: 'Dolci',
    type: 'ala_carte',
    order: 7,
    items: [
      { id: uid(), name: 'Torta di mela', price: 3.00 },
      { id: uid(), name: 'Torta di ricotta e pera', price: 3.00 },
      { id: uid(), name: 'Crostata di frutta', price: 3.00 },
      { id: uid(), name: 'Crostata ai frutti rossi', price: 3.00 },
      { id: uid(), name: 'Gelato confezionato', description: 'Vari prezzi', price: 0.00 },
      { id: uid(), name: 'Granita di limone', price: 2.50 },
    ],
  },
  {
    id: 'proteico',
    title: 'Menu Proteico',
    type: 'weekly',
    basePrice: 5.50,
    order: 8,
    items: [
      { id: uid(), name: 'Uova sode', description: 'Con contorno di zucchine e riso bianco', price: null, day: 'Lunedì' },
      { id: uid(), name: 'Pennette integrali', description: 'Con tagliata di pollo e pomodorino fresco', price: null, day: 'Martedì' },
      { id: uid(), name: 'Salmone al forno', description: 'Con fagiolino e riso', price: null, day: 'Mercoledì' },
      { id: uid(), name: 'Insalata mista', description: 'Lattuga, carote e tonno, pane integrale', price: null, day: 'Giovedì' },
      { id: uid(), name: 'Pizza', description: 'Margherita / Prosciutto e funghi / Margherita con crudo', price: null, day: 'Venerdì' },
    ],
  },
  {
    id: 'young',
    title: 'Young Menu',
    type: 'buffet',
    order: 9,
    items: [
      { id: uid(), name: 'Aperitivo Cocktail Bar', price: null, description: 'Chips, Cocktail analcolici, Succhi, Acqua, Coca Cola' },
      { id: uid(), name: 'Cena a Buffet', price: null, description: 'Arancinette, Pizzette miste, Paninetti farciti, Paninetto hamburger vitello, Nugget pollo, Panino cotoletta' },
      { id: uid(), name: 'Dessert', price: null, description: 'Crepes o Pancake in bella vista' },
    ],
  },
  {
    id: 'vini',
    title: 'Vini',
    type: 'ala_carte',
    order: 10,
    items: [
      { id: uid(), name: "Barone Montalto - Nero d'Avola", price: 18.00 },
      { id: uid(), name: 'Barone Montalto - Grillo', price: 16.00 },
      { id: uid(), name: 'Spumante extra dry', price: 16.00 },
      { id: uid(), name: 'Mionetto - Prosecco', price: 18.00 },
    ],
  },
  {
    id: 'cocktail',
    title: 'Cocktail',
    type: 'ala_carte',
    order: 11,
    items: [
      { id: uid(), name: 'Cocktail Classici', price: 7.00 },
    ],
  },
  {
    id: 'bevande',
    title: 'Bevande',
    type: 'ala_carte',
    order: 12,
    items: [
      { id: uid(), name: 'Acqua 0,5 l', price: 1.00 },
      { id: uid(), name: 'Acqua 1 l', price: 2.00 },
      { id: uid(), name: 'Bevanda in vetro 33 cl', price: 2.50 },
      { id: uid(), name: 'Bevanda in lattina 33 cl', price: 2.00 },
      { id: uid(), name: 'Birra Messina 33 cl', price: 3.00 },
    ],
  },
]
