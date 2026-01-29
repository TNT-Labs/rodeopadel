# 🏆 Rodeo 2vs2 - PWA

**Quelliscarsidelpadel si mettono alla prova**

Progressive Web App per gestire un mini-torneo con 4 giocatori in formato 2vs2.

## Caratteristiche

### Funzionalità Base
- ✅ Inserimento di 4 giocatori (con nomi di default: Fabio, Beppe, Trillo, Umby)
- ✅ Generazione automatica di tutte le combinazioni di partite 2vs2
- ✅ Inserimento risultati tipo tennis (un set, formato numerico)
- ✅ Classifica automatica con:
  - Criterio principale: numero di vittorie
  - Criterio secondario: differenza giochi totale
- ✅ Statistiche per giocatore: partite giocate, vittorie, differenza giochi

### Funzionalità Avanzate
- ✅ **Conferma risultati**: pulsante "Conferma Risultato" per ogni partita completata
- ✅ **Icona vincitore animata**: coppa 🏆 animata accanto alla coppia vincitrice di ogni partita
- ✅ **Proclamazione vincitore**: quando tutte le partite sono finite, banner animato con il vincitore del torneo
- ✅ **Animazioni classifica**: animazioni sequenziali sulla classifica quando il torneo è completato
- ✅ **Persistenza dati**: tutti i risultati vengono salvati automaticamente e persistono dopo il refresh
- ✅ **Reset con conferma**: pulsante reset richiede conferma prima di cancellare i dati

### UI/UX
- ✅ Design moderno e responsive
- ✅ Mobile-friendly (ottimizzato per smartphone e tablet)
- ✅ Animazioni fluide e feedback visivi
- ✅ Validazione input in tempo reale

### PWA
- ✅ Funzionamento offline completo
- ✅ Aggiornamento automatico quando disponibile nuova versione
- ✅ Installabile come app nativa
- ✅ Service Worker per cache intelligente

## Come usare

### Avvio Torneo
1. Apri `index.html` in un browser moderno
2. I nomi di default (Fabio, Beppe, Trillo, Umby) sono già inseriti ma modificabili
3. Clicca su "Genera Calendario" per iniziare il torneo

### Gestione Partite
1. Per ogni partita, inserisci i punteggi di entrambe le squadre
2. Quando entrambi i punteggi sono inseriti e validi, appare il pulsante **"✓ Conferma Risultato"**
3. Clicca su "Conferma Risultato" per proclamare il vincitore della partita
4. L'icona 🏆 animata apparirà accanto alla coppia vincitrice
5. La classifica si aggiorna automaticamente con i risultati confermati

### Fine Torneo
- Quando tutte e 3 le partite sono confermate:
  - Appare un banner dorato animato con il **"Vincitore del torneo"**
  - La classifica si anima con effetti sequenziali
  - La riga del vincitore viene evidenziata con animazione pulsante

### Reset Torneo
- Clicca sul pulsante **"Reset Torneo"** nella sezione Partite
- Viene richiesta conferma prima di cancellare tutti i dati
- Dopo il reset, i campi tornano ai valori di default

## Installazione come PWA

1. Apri l'app nel browser
2. Clicca sull'icona "Installa app" nella barra degli indirizzi (o nel menu)
3. L'app sarà installata e funzionerà offline
4. Gli aggiornamenti vengono applicati automaticamente quando disponibili

## Persistenza Dati

- Tutti i risultati vengono salvati automaticamente nel **localStorage** del browser
- I dati persistono anche dopo:
  - Refresh della pagina
  - Chiusura e riapertura del browser
  - Riavvio del dispositivo
- I dati vengono cancellati solo quando:
  - Viene premuto "Reset Torneo" e confermato
  - Il localStorage viene pulito manualmente dal browser

## Struttura file

- `index.html` - Struttura HTML principale
- `styles.css` - Stili responsive con animazioni
- `app.js` - Logica applicazione completa
- `manifest.json` - Configurazione PWA
- `service-worker.js` - Service Worker per funzionamento offline e aggiornamenti
- `generate-icons.html` - Tool per generare le icone PWA (opzionale)

## Note sulle icone

Il `manifest.json` fa riferimento a `icon-192.png` e `icon-512.png`. 
Puoi creare queste icone usando:
- Il file `generate-icons.html` incluso nel progetto
- Qualsiasi tool di grafica online
- Un generatore di icone PWA

Per testare senza icone, puoi temporaneamente rimuovere la sezione `icons` dal manifest.json.

## Browser supportati

- ✅ Chrome/Edge (raccomandato)
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Opera

## Tecnologie utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Grid, Flexbox, Custom Properties, Animazioni Keyframes
- **JavaScript ES6+** - Moduli, LocalStorage API, DOM manipulation
- **Service Worker API** - Cache strategy, offline support
- **Web App Manifest** - Installazione PWA

## Funzionalità Tecniche

### Gestione Stato
- Stato dell'applicazione salvato in `localStorage`
- Persistenza completa di giocatori, partite e risultati confermati
- Caricamento automatico all'avvio

### Animazioni
- Animazione coppa vincitore per partita (bounce + rotazione)
- Banner vincitore torneo con effetto glow
- Animazioni sequenziali sulla classifica
- Pulse animation sulla riga del vincitore

### Validazione
- Controllo nomi giocatori unici
- Validazione punteggi numerici
- Verifica punteggi diversi tra le squadre
- Reset automatico conferma se punteggi cambiano

## Sviluppo

Per modificare l'app:
1. Modifica i file HTML/CSS/JS
2. Il Service Worker rileverà automaticamente le modifiche
3. L'app si aggiornerà automaticamente al prossimo caricamento

Per forzare un aggiornamento immediato, modifica il `CACHE_NAME` nel `service-worker.js`.
