---
titolo: "Comunicazioni e nodi"
numero: "25"
parte: "Parte IV · Segreta, identità e comunicazioni"
stato: "VIGENTE"
revisione: "2026.04"
---
# 25. Comunicazioni e nodi

## 25.1 Principio generale

Ogni comunicazione deve contenere il minimo necessario a ottenere il risultato desiderato.

Prima di trasmettere materiale, il Commensale deve considerare:

- destinatario;
- necessità;
- sensibilità;
- condizioni imposte dalla fonte;
- autenticità del nodo;
- attualità della comunicazione;
- eventuale rischio derivante dall'associazione tra più informazioni.

## 25.2 Autenticazione

Terminologia corretta, conoscenze interne e riferimenti storici non costituiscono, da soli, prova sufficiente di autenticità.

Quando possibile devono essere verificate separatamente:

- identità del mittente;
- autenticità del nodo;
- validità delle credenziali;
- autorità a impartire l'istruzione;
- integrità del contenuto;
- corrispondenza con la sessione o transazione corrente.

## 25.3 Attualità e ritrasmissione

Una comunicazione può essere autentica e, allo stesso tempo, essere vecchia, duplicata o ritrasmessa fuori contesto.

I messaggi sensibili devono permettere, secondo il sistema disponibile, di verificare:

- data e ora;
- ordine o progressione della comunicazione;
- eventuale identificativo univoco;
- corrispondenza con una richiesta o sessione corrente;
- presenza di duplicazioni inattese.

> **Autentico non significa attuale. Attuale non significa autorizzato.**

Dopo la Serrata, un messaggio correttamente autenticato ma vecchio deve essere trattato come documento storico finché non è stabilito che l'istruzione sia ancora valida.

## 25.4 Convenzione temporale

Le comunicazioni tra nodi e i record destinati alla sincronizzazione utilizzano un riferimento temporale univoco.

Quando possibile:

- l'orario di sistema viene registrato in UTC;
- l'ora locale viene conservata quando è rilevante alla ricostruzione;
- il fuso o l'offset non devono essere omessi;
- gli orari approssimativi devono essere indicati come tali.

Esempi:

`2026-09-25 10:14:32Z`

`2026-09-25 12:14:32+02:00`

Un'ora priva di riferimento temporale non deve essere utilizzata per risolvere discrepanze tra nodi.

## 25.5 Nodi silenti o intermittenti

Un nodo che non risponde non deve essere considerato automaticamente distrutto.

Può essere:

- inattivo;
- isolato volontariamente;
- tecnicamente irraggiungibile;
- compromesso;
- trasformato;
- abbandonato;
- operativo sotto una struttura che non riconosce più il Cenacolo.

Indice deve registrare ciò che è noto, non ciò che si presume.

## 25.6 Materiale proveniente da un nodo remoto

L'origine remota deve restare associata al materiale anche dopo la replica locale.

Se il nodo impone condizioni di diffusione o protezione, queste devono accompagnare il record.

---
