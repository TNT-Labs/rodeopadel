// Stato dell'applicazione
let state = {
    players: [],
    matches: [],
    results: {}
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadState();
    if (state.players.length === 4) {
        initializeTournament();
    }
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('players-form');
    form.addEventListener('submit', handlePlayersSubmit);
    
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', resetTournament);
}

// Gestione submit form giocatori
function handlePlayersSubmit(e) {
    e.preventDefault();
    
    const players = [
        document.getElementById('player1').value.trim(),
        document.getElementById('player2').value.trim(),
        document.getElementById('player3').value.trim(),
        document.getElementById('player4').value.trim()
    ];
    
    // Validazione: controlla che tutti i nomi siano unici e non vuoti
    if (players.some(name => !name)) {
        alert('Inserisci tutti e 4 i giocatori!');
        return;
    }
    
    if (new Set(players).size !== 4) {
        alert('I nomi dei giocatori devono essere tutti diversi!');
        return;
    }
    
    state.players = players;
    initializeTournament();
    saveState();
}

// Inizializza il torneo generando le partite
function initializeTournament() {
    generateMatches();
    renderMatches();
    renderRanking();
    
    // Mostra le sezioni partite e classifica
    document.getElementById('matches-section').style.display = 'block';
    document.getElementById('ranking-section').style.display = 'block';
    
    // Disabilita il form dei giocatori
    const form = document.getElementById('players-form');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
    form.querySelector('button').disabled = true;
}

// Genera tutte le combinazioni di partite 2vs2
// Per 4 giocatori: A+B vs C+D, A+C vs B+D, A+D vs B+C
function generateMatches() {
    // Salva i risultati esistenti prima di resettare
    const existingResults = { ...state.results };
    
    state.matches = [];
    
    const [A, B, C, D] = state.players;
    
    // Genera le 3 combinazioni possibili
    state.matches = [
        {
            id: 1,
            team1: [A, B],
            team2: [C, D]
        },
        {
            id: 2,
            team1: [A, C],
            team2: [B, D]
        },
        {
            id: 3,
            team1: [A, D],
            team2: [B, C]
        }
    ];
    
    // Inizializza i risultati, preservando quelli esistenti se presenti
    state.matches.forEach(match => {
        // Se esiste già un risultato per questa partita, preservalo
        if (existingResults[match.id]) {
            state.results[match.id] = existingResults[match.id];
        } else {
            // Altrimenti inizializza con valori vuoti
            state.results[match.id] = {
                score1: '',
                score2: ''
            };
        }
    });
}

// Renderizza le partite
function renderMatches() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '';
    
    state.matches.forEach(match => {
        const matchCard = createMatchCard(match);
        container.appendChild(matchCard);
    });
}

// Crea una card per una partita
function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    const result = state.results[match.id];
    
    // Determina se la partita è completata e chi ha vinto
    const score1 = parseInt(result.score1);
    const score2 = parseInt(result.score2);
    const isCompleted = result.score1 && result.score2 && !isNaN(score1) && !isNaN(score2) && score1 !== score2;
    const team1Wins = isCompleted && score1 > score2;
    const team2Wins = isCompleted && score2 > score1;
    
    // Icona vincitore
    const winnerIcon = '<span class="winner-icon">🏆</span>';
    
    card.innerHTML = `
        <div class="match-teams">
            <div class="team ${team1Wins ? 'winner' : ''}">
                <span>${match.team1[0]} & ${match.team1[1]}</span>
                ${team1Wins ? winnerIcon : ''}
            </div>
            <span class="vs">VS</span>
            <div class="team ${team2Wins ? 'winner' : ''}">
                <span>${match.team2[0]} & ${match.team2[1]}</span>
                ${team2Wins ? winnerIcon : ''}
            </div>
        </div>
        <div class="score-inputs">
            <div class="score-group">
                <label>${match.team1[0]} & ${match.team1[1]}:</label>
                <input 
                    type="number" 
                    class="score-input" 
                    data-match="${match.id}" 
                    data-team="1"
                    min="0" 
                    max="99"
                    value="${result.score1}"
                    placeholder="0"
                >
            </div>
            <div class="score-group">
                <label>${match.team2[0]} & ${match.team2[1]}:</label>
                <input 
                    type="number" 
                    class="score-input" 
                    data-match="${match.id}" 
                    data-team="2"
                    min="0" 
                    max="99"
                    value="${result.score2}"
                    placeholder="0"
                >
            </div>
        </div>
    `;
    
    // Aggiungi event listeners agli input
    const inputs = card.querySelectorAll('.score-input');
    inputs.forEach(input => {
        input.addEventListener('input', handleScoreChange);
        input.addEventListener('blur', validateScore);
    });
    
    return card;
}

// Gestisce il cambio di punteggio
function handleScoreChange(e) {
    const matchId = parseInt(e.target.dataset.match);
    const team = parseInt(e.target.dataset.team);
    const value = e.target.value;
    
    // Aggiorna lo stato
    if (team === 1) {
        state.results[matchId].score1 = value;
    } else {
        state.results[matchId].score2 = value;
    }
    
    // Aggiorna la classifica
    renderRanking();
    saveState();
}

// Valida il punteggio inserito
function validateScore(e) {
    const input = e.target;
    const value = parseInt(input.value);
    
    // Rimuovi classe invalid se presente
    input.classList.remove('invalid');
    
    // Se il campo è vuoto, va bene (partita non ancora giocata)
    if (input.value === '') {
        return;
    }
    
    // Controlla che sia un numero valido
    if (isNaN(value) || value < 0) {
        input.classList.add('invalid');
        alert('Inserisci un punteggio valido (numero positivo)');
        input.value = '';
        return;
    }
    
    // Controlla che entrambi i punteggi siano inseriti se uno è presente
    const matchId = parseInt(input.dataset.match);
    const result = state.results[matchId];
    
    if ((result.score1 && !result.score2) || (!result.score1 && result.score2)) {
        // Se solo uno è inserito, va bene (l'utente sta ancora inserendo)
        return;
    }
    
    // Se entrambi sono inseriti, valida che siano diversi
    if (result.score1 && result.score2) {
        const score1 = parseInt(result.score1);
        const score2 = parseInt(result.score2);
        
        if (score1 === score2) {
            input.classList.add('invalid');
            alert('Il punteggio deve essere diverso per le due squadre!');
            return;
        }
    }
}

// Calcola le statistiche per ogni giocatore
function calculateStats() {
    const stats = {};
    
    // Inizializza le statistiche per ogni giocatore
    state.players.forEach(player => {
        stats[player] = {
            matches: 0,
            wins: 0,
            gameDifference: 0
        };
    });
    
    // Analizza ogni partita completata
    state.matches.forEach(match => {
        const result = state.results[match.id];
        const score1 = parseInt(result.score1);
        const score2 = parseInt(result.score2);
        
        // Se la partita è completata (entrambi i punteggi inseriti)
        if (result.score1 && result.score2 && !isNaN(score1) && !isNaN(score2)) {
            const diff = score1 - score2;
            
            // Aggiorna statistiche per ogni giocatore del team 1
            match.team1.forEach(player => {
                stats[player].matches++;
                stats[player].gameDifference += diff;
                if (diff > 0) {
                    stats[player].wins++;
                }
            });
            
            // Aggiorna statistiche per ogni giocatore del team 2
            match.team2.forEach(player => {
                stats[player].matches++;
                stats[player].gameDifference -= diff; // Invertito perché hanno perso
                if (diff < 0) {
                    stats[player].wins++;
                }
            });
        }
    });
    
    return stats;
}

// Renderizza la classifica
function renderRanking() {
    const stats = calculateStats();
    const container = document.getElementById('ranking-container');
    
    // Converti in array e ordina
    const ranking = Object.entries(stats)
        .map(([player, stat]) => ({
            player,
            ...stat
        }))
        .sort((a, b) => {
            // Ordina per vittorie (decrescente)
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            // In caso di pari vittorie, ordina per differenza giochi (decrescente)
            return b.gameDifference - a.gameDifference;
        });
    
    // Crea la tabella
    const table = document.createElement('table');
    table.className = 'ranking-table';
    
    // Header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Pos.</th>
            <th>Giocatore</th>
            <th>Partite</th>
            <th>Vittorie</th>
            <th>Diff. Giochi</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Body
    const tbody = document.createElement('tbody');
    ranking.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Badge posizione con colori per i primi 3
        let badgeClass = '';
        if (index === 0) badgeClass = 'gold';
        else if (index === 1) badgeClass = 'silver';
        else if (index === 2) badgeClass = 'bronze';
        
        const diffSign = entry.gameDifference >= 0 ? '+' : '';
        
        row.innerHTML = `
            <td>
                <span class="rank-badge ${badgeClass}">${index + 1}</span>
            </td>
            <td><strong>${entry.player}</strong></td>
            <td>${entry.matches}</td>
            <td><strong>${entry.wins}</strong></td>
            <td class="stats">${diffSign}${entry.gameDifference}</td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
}

// Reset del torneo
function resetTournament() {
    // Richiedi conferma prima di resettare
    const confirmed = confirm('Sei sicuro di voler resettare il torneo? Tutti i risultati verranno persi.');
    
    if (!confirmed) {
        return; // Se l'utente annulla, non fare nulla
    }
    
    // Reset completo dello stato
    state.players = [];
    state.matches = [];
    state.results = {};
    
    // Reset form ai valori di default
    document.getElementById('player1').value = 'Fabio';
    document.getElementById('player2').value = 'Beppe';
    document.getElementById('player3').value = 'Trillo';
    document.getElementById('player4').value = 'Umby';
    
    const form = document.getElementById('players-form');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.disabled = false);
    form.querySelector('button').disabled = false;
    
    // Nascondi sezioni
    document.getElementById('matches-section').style.display = 'none';
    document.getElementById('ranking-section').style.display = 'none';
    
    // Pulisci il localStorage
    localStorage.removeItem('tournamentState');
}

// Salva lo stato nel localStorage
function saveState() {
    try {
        localStorage.setItem('tournamentState', JSON.stringify(state));
    } catch (e) {
        console.error('Errore nel salvataggio:', e);
    }
}

// Carica lo stato dal localStorage
function loadState() {
    try {
        const saved = localStorage.getItem('tournamentState');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Preserva i risultati esistenti se ci sono
            const existingResults = state.results || {};
            
            // Carica lo stato salvato
            state = {
                players: parsed.players || [],
                matches: parsed.matches || [],
                results: parsed.results || {}
            };
            
            // Se ci sono risultati salvati, preservali
            if (Object.keys(parsed.results || {}).length > 0) {
                state.results = parsed.results;
            }
            
            // Ripristina i valori nel form se ci sono giocatori salvati
            if (state.players && state.players.length === 4) {
                document.getElementById('player1').value = state.players[0] || '';
                document.getElementById('player2').value = state.players[1] || '';
                document.getElementById('player3').value = state.players[2] || '';
                document.getElementById('player4').value = state.players[3] || '';
            }
        }
    } catch (e) {
        console.error('Errore nel caricamento:', e);
    }
}
