import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'API Key mancante' }, { status: 500 });
  }

  try {
    const { dishName, ingredients } = await request.json();

    const prompt = `
Agisci come un responsabile HACCP estremamente rigoroso e conservativo.
Analizza il seguente piatto tipico di una mensa aziendale/ristorante per dipendenti.

PIATTO: "${dishName}"
INGREDIENTI DICHIARATI: ${ingredients ? JSON.stringify(ingredients) : 'Non specificati. Assumi la ricetta standard italiana più comune per questo nome di piatto.'}

ALLERGENI UE OBBLIGATORI (14):
Glutine, Crostacei, Uova, Pesce, Arachidi, Soia, Latte, Frutta a guscio, Sedano, Senape, Semi di sesamo, Anidride solforosa, Lupini, Molluschi.

REGOLE CRITICHE DI SICUREZZA:
1. CONSERVATIVISMO ESTREMO: Se c'è anche solo il 1% di probabilità che un ingrediente contenga un allergene (es. "pastella" implica Glutine e spesso Uova; "panato" implica Glutine; "pesto" implica Frutta a guscio e Parmigiano/Latte), DEVI includerlo.
2. INGREDIENTI NASCOSTI: Considera che sughi, condimenti, panature, pastelle, impanature contengono quasi sempre Glutine. I formaggi contengono Latte. Le uova sono usate nelle pastelle e nei leganti.
3. NO ALLUCINAZIONI: Non inventare allergeni se non ragionevolmente presenti nella ricetta standard. Es: "Insalata mista" probabilmente non ha allergeni, ma se contiene crostini -> Glutine. Se contiene tonno -> Pesce.
4. OUTPUT FORMAT: Restituisci SOLO un array JSON valido di stringhe. Nessun altro testo, nessuna spiegazione.

ESEMPIO 1:
Input: "Pinsa con mozzarella e prosciutto cotto"
Output: ["Glutine", "Latte"]

ESEMPIO 2:
Input: "Insalata di riso con tonno"
Output: ["Pesce"]

ESEMPIO 3:
Input: "Pollo al pane saporito"
Output: ["Glutine"]

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
