# 🏆 Mini Torneo 2vs2 - PWA

Progressive Web App per gestire un mini-torneo con 4 giocatori in formato 2vs2.

## Caratteristiche

- ✅ Inserimento di 4 giocatori
- ✅ Generazione automatica di tutte le combinazioni di partite 2vs2
- ✅ Inserimento risultati tipo tennis (un set, formato numerico)
- ✅ Classifica automatica con:
  - Criterio principale: numero di vittorie
  - Criterio secondario: differenza giochi totale
- ✅ Statistiche per giocatore: partite giocate, vittorie, differenza giochi
- ✅ UI responsive e mobile-friendly
- ✅ Funzionamento offline completo
- ✅ Pulsante reset torneo
- ✅ Validazione input

## Come usare

1. Apri `index.html` in un browser moderno
2. Inserisci i nomi dei 4 giocatori
3. Clicca su "Genera Calendario"
4. Inserisci i risultati delle partite nei campi punteggio
5. La classifica si aggiorna automaticamente

## Installazione come PWA

1. Apri l'app nel browser
2. Clicca sull'icona "Installa app" nella barra degli indirizzi (o nel menu)
3. L'app sarà installata e funzionerà offline

## Struttura file

- `index.html` - Struttura HTML principale
- `styles.css` - Stili responsive
- `app.js` - Logica applicazione
- `manifest.json` - Configurazione PWA
- `service-worker.js` - Service Worker per funzionamento offline

## Note sulle icone

Il `manifest.json` fa riferimento a `icon-192.png` e `icon-512.png`. 
Puoi creare queste icone usando qualsiasi tool di grafica o generator online.

Per testare senza icone, puoi temporaneamente rimuovere la sezione `icons` dal manifest.json.

## Browser supportati

- Chrome/Edge (raccomandato)
- Firefox
- Safari (iOS 11.3+)
- Opera

## Tecnologie utilizzate

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+
- Service Worker API
- Web App Manifest
