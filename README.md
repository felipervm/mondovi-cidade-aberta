# Mondovì · Città aperta

Un RPG 2D per praticare l’italiano nella geografia reale di Mondovì. Apri `index.html` nel browser.

- WASD o frecce per camminare e scegliere la direzione dell’auto.
- E per parlare e interagire.
- V vicino a un’auto condivisa per salire o scendere. Le frecce muovono direttamente l’auto nella direzione indicata. Rilasciandole, l’auto si ferma. Edifici e bordi della carreggiata limitano il movimento.
- M per la mappa. Trascina, usa la rotella o i pulsanti + e − e scegli una destinazione.
- Missioni per seguire gli incontri e aggiornare il percorso.
- Impostazioni per abilitare gli aiuti facoltativi in portoghese.

La città parla italiano. Le risposte suggerite si aprono su richiesta. Le prove di lingua sono attive inizialmente e coprono preposizioni, ausiliari, tempi del passato, congiuntivo, condizionale, pronomi, registro e impliciti. Gli esercizi C1 richiedono testi sviluppati e una revisione esplicita con criteri. Le risposte aperte vengono salvate per il confronto personale.

Tutti i luoghi nel catalogo cartografico hanno un’interazione. Gli esercizi dei luoghi aggiuntivi riutilizzano situazioni per categoria commerciale. I passanti seguono segmenti collegati, cambiano direzione agli incroci e possono fermarsi. I ritratti sono disegnati in pixel art e variano per personaggio. Le persone e le situazioni sono immaginarie.

Il progresso rimane nel browser. La voce dipende dai sintetizzatori italiani installati. Le attività non assegnano una certificazione linguistica.

## Sviluppo

Esegui `python build.py` per assemblare il gioco da `src/`. Esegui `node tests/city.cjs` per verificare impostazioni, copertura dei luoghi, ritratti, prove linguistiche, revisione C1, percorsi dei passanti, guida assistita, missioni, mappa e salvataggio.

I test verificano la logica con un ambiente DOM simulato. La verifica grafica e la qualità delle voci richiedono un browser.

## Fonti

La geometria proviene da © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), sotto [ODbL](https://opendatacommons.org/licenses/odbl/1-0/). Il ritaglio comprende Altipiano, Breo e Piazza. I dati elaborati sono in `src/city-data.json`.

Per la variazione regionale e il parlato, vedi [cerea](https://www.treccani.it/vocabolario/cerea/) e [mica](https://www.treccani.it/enciclopedia/intensificatori_%28Enciclopedia-dell%27Italiano%29/). Le formule dell’italiano comune sono indicate come tali, insieme al registro d’uso.
