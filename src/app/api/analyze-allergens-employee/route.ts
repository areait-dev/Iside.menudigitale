import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'API Key mancante' }, { status: 500 });
  }

  try {
    const { dishName, ingredients } = await request.json();

    const prompt = `
Agisci come un responsabile HACCP preciso.
Analizza il seguente piatto tipico di una mensa aziendale/ristorante per dipendenti.

PIATTO: "${dishName}"
INGREDIENTI DICHIARATI: ${ingredients ? JSON.stringify(ingredients) : 'Non specificati. Assumi la ricetta standard italiana più comune per questo nome di piatto.'}

ALLERGENI UE OBBLIGATORI (14):
Glutine, Crostacei, Uova, Pesce, Arachidi, Soia, Latte, Frutta a guscio, Sedano, Senape, Semi di sesamo, Anidride solforosa, Lupini, Molluschi.

REGOLE:
1. Includi SOLO allergeni effettivamente presenti negli ingredienti del piatto. Non inventare.
2. "Crudo" (prosciutto crudo), "Bresaola", "Salame", "Speck" sono solo carne stagionata — NON contengono Latte, Glutine, Uova, etc.
3. "Melone", "Insalata", "Verdure grigliate", "Pomodori" freschi — NON hanno allergeni.
4. Pastella, panato, impanato, crostini, pane, pasta, pizza, gnocchi, grissini, crackers contengono Glutine.
5. Formaggi, panna, besciamella, burro, latte, ricotta, mozzarella, parmigiano contengono Latte.
6. Pesto contiene Frutta a guscio e spesso Latte (Parmigiano).
7. Uova sono in frittate, omelette, pastelle, creme, maionese.
8. Pesce, crostacei, molluschi sono allergeni a sé stanti.
9. NO ALLUCINAZIONI: Se un piatto è solo carne/pesce/verdure senza condimenti elaborati, probabilmente non ha allergeni.
10. OUTPUT FORMAT: Restituisci SOLO un array JSON valido di stringhe. Mai array vuoto -> [].

ESEMPIO 1:
Input: "Pinsa con mozzarella e prosciutto cotto"
Output: ["Glutine", "Latte"]

ESEMPIO 2:
Input: "Crudo e melone"
Output: []

ESEMPIO 3:
Input: "Pollo al pane saporito"
Output: ["Glutine"]

ESEMPIO 4:
Input: "Bresaola, rucola e grana"
Output: ["Latte"]

ESEMPIO 5:
Input: "Insalata mista"
Output: []

ANALIZZA ORA IL PIATTO: "${dishName}"
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Sei un esperto HACCP conservativo e preciso.' },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return NextResponse.json({ error: `Groq API: ${response.status} — ${errText.slice(0, 200)}` }, { status: 502 });
    }

    const data = await response.json();

    let allergensString = data.choices[0].message.content.trim();

    allergensString = allergensString.replace(/```json/g, '').replace(/```/g, '').trim();

    if (allergensString === '' || allergensString === '[]') {
      return NextResponse.json({ allergens: [] });
    }

    const allergensArray = JSON.parse(allergensString);

    if (!Array.isArray(allergensArray) || !allergensArray.every(item => typeof item === 'string')) {
       throw new Error('Formato risposta AI non valido');
    }

    return NextResponse.json({ allergens: allergensArray });

  } catch (error) {
    console.error('Errore analisi allergeni dipendenti:', error);
    return NextResponse.json({ error: 'Errore nell\'analisi AI. Riprova o inserisci manualmente.' }, { status: 500 });
  }
}
