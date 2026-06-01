export const menuIside = {
  aperitivo: [
    { id: "aperitivo-1", name: "Pizzette e Focaccine", category: "aperitivo" },
    { id: "aperitivo-2", name: "Paninetto con hamburger", category: "aperitivo" },
    { id: "aperitivo-3", name: "Tartine con prosciutto e maionese", category: "aperitivo" }
  ],

  primi: [
    { id: "primi-1", name: "Lasagna alla bolognese", category: "primi" },
    { id: "primi-2", name: "Sformato di anelletti alla siciliana", category: "primi" },
    { id: "primi-3", name: "Insalata di riso alla cantonese", category: "primi" },
    { id: "primi-4", name: "Insalata di pasta con pesto, basilico e scaglie di grana", category: "primi" }
  ],

  carne: [
    { id: "carne-1", name: "Arrosto di manzo", category: "carne" },
    { id: "carne-2", name: "Tartà di vitello", category: "carne" },
    { id: "carne-3", name: "Roastbeef con grana, rucola e pomodorino", category: "carne" },
    { id: "carne-4", name: "Involtino di carne con prosciutto e formaggio", category: "carne" },
    { id: "carne-5", name: "Stinco brasato", category: "carne" }
  ],

  fritti: [
    { id: "fritti-1", name: "Arancinette al ragù", category: "fritti" },
    { id: "fritti-2", name: "Arancinette spinaci e mozzarella", category: "fritti" },
    { id: "fritti-3", name: "Verdure in pastella", category: "fritti" },
    { id: "fritti-4", name: "Alette di pollo alla texana", category: "fritti" }
  ],

  contorni: [
    { id: "contorni-1", name: "Insalata mista", category: "contorni" },
    { id: "contorni-2", name: "Patate al forno", category: "contorni" },
    { id: "contorni-3", name: "Verdure grigliate", category: "contorni" },
    { id: "contorni-4", name: "Patatine fritte", category: "contorni" }
  ],

  bevande: [
    { id: "bevande-1", name: "Prosecco", category: "bevande" },
    { id: "bevande-2", name: "Vino rosso", category: "bevande" },
    { id: "bevande-3", name: "Vino bianco", category: "bevande" },
    { id: "bevande-4", name: "Acqua", category: "bevande" },
    { id: "bevande-5", name: "Coca Cola", category: "bevande" }
  ]
} as const;

export type MenuCategory = keyof typeof menuIside;
export type MenuItem = typeof menuIside[MenuCategory][number];
