---
titolo: "Sicurezza delle comunicazioni e comunicazioni clandestine"
numero: "26"
parte: "Parte IV · Segreta, identità e comunicazioni"
stato: "VIGENTE"
revisione: "2026.04"
---
# 26. Sicurezza delle comunicazioni e comunicazioni clandestine

**Scopo:** proteggere contenuto, autenticità, integrità e struttura delle comunicazioni della Tavola, riducendo il rischio che un osservatore ricostruisca la rete anche quando non può leggere i messaggi.

**Applicazione:** comunicazioni tra Commensali, fonti, nodi, intermediari e soggetti esterni; trasmissione di materiale sensibile; contatti che non possono o non devono avvenire direttamente.

La sicurezza delle comunicazioni comprende misure crittografiche, tecniche, fisiche e procedurali.

La cifratura protegge il contenuto soltanto in determinate condizioni. Non impedisce automaticamente a un osservatore di capire **chi comunica, quando, con quale frequenza, da dove e per quanto tempo**.

> **Proteggere il messaggio non significa necessariamente proteggere la relazione.**

## 26.1 Proprietà da proteggere

Una comunicazione sensibile deve essere valutata rispetto ad almeno cinque proprietà.

### Confidenzialità

Impedire che il contenuto sia comprensibile a soggetti non autorizzati.

### Integrità

Permettere di rilevare modifiche non autorizzate del contenuto.

### Autenticità

Permettere di stabilire, con il grado di certezza richiesto, chi o quale sistema abbia originato la comunicazione.

### Attualità

Permettere di stabilire che la comunicazione appartenga alla transazione o al periodo corrente e non sia una copia valida ma vecchia.

### Occultamento della relazione

Ridurre la possibilità che un osservatore ricostruisca la struttura della rete attraverso presenza, frequenza, durata, volume e direzione delle comunicazioni.

Queste proprietà sono distinte. Un canale può proteggerne alcune e non altre.

## 26.2 Scelta del canale

Il canale viene scelto in funzione di:

- sensibilità del contenuto;
- rischio di identificare mittente e destinatario;
- urgenza;
- possibilità di autenticazione;
- possibilità di compromissione del dispositivo;
- necessità di mantenere una relazione nel tempo;
- conseguenze della perdita del messaggio;
- disponibilità di un'alternativa realmente indipendente.

Il mezzo più tecnologicamente avanzato non è automaticamente il più adatto.

Per informazioni poco sensibili, un canale ordinario può produrre meno attenzione di un sistema eccezionale. Per informazioni altamente sensibili può essere necessario separare contenuto, identità e percorso di trasmissione.

## 26.3 Cifratura

La Tavola utilizza sistemi crittografici approvati dall'infrastruttura disponibile.

Un Commensale non deve inventare un cifrario per materiale sensibile quando esiste un sistema verificato.

Devono essere evitati come protezione principale:

- sostituzioni alfabetiche improvvisate;
- parole chiave statiche;
- trasformazioni personali non documentate;
- algoritmi costruiti dal singolo Commensale senza valutazione;
- riutilizzo di materiale cifrante destinato a un solo impiego.

La segretezza del metodo non sostituisce la robustezza del sistema.

## 26.4 Limiti della cifratura

La cifratura protegge il materiale soltanto finché:

- le chiavi restano protette;
- il dispositivo che cifra e decifra resta affidabile;
- il destinatario è quello previsto;
- il contenuto non viene esposto prima della cifratura o dopo la decifratura.

Un dispositivo compromesso può rendere inutile una cifratura tecnicamente robusta.

> **Un canale cifrato non rende affidabile un terminale compromesso.**

Quando il rischio riguarda il dispositivo stesso, deve essere utilizzato un sistema indipendente o una procedura alternativa già prevista.

## 26.5 Gestione delle chiavi

Le chiavi e gli altri materiali crittografici devono essere gestiti lungo l'intero ciclo di vita.

La Tavola distingue almeno:

- generazione;
- distribuzione o instaurazione;
- conservazione;
- impiego;
- sostituzione;
- sospensione o revoca;
- distruzione;
- eventuale recupero autorizzato.

Una chiave compromessa non deve essere considerata sicura perché l'algoritmo rimane sicuro.

Quando una chiave viene dichiarata compromessa:

1. cessa l'impiego corrente;
2. vengono individuati i sistemi e i periodi interessati;
3. si passa al materiale sostitutivo già previsto;
4. si valuta quali comunicazioni precedenti possano essere state esposte;
5. la sostituzione viene registrata.

Il materiale crittografico non deve essere trasmesso attraverso lo stesso canale non affidabile che dovrebbe proteggere, salvo che la procedura utilizzata sia stata progettata specificamente per instaurare chiavi in sicurezza.

## 26.6 Codici, Segnaposti e cifratura

Un codice sostituisce un significato con una convenzione condivisa.

Un Segnaposto sostituisce un'identità.

Nessuno dei due equivale necessariamente a cifratura.

Scrivere `MERCATORE` invece del nome civile riduce l'esposizione dell'identità. Non impedisce a chi conosce l'associazione di comprenderla.

Usare un nome convenuto per un luogo può ridurre ciò che un'intercettazione occasionale rivela. Non protegge il resto del messaggio.

> **Il nome in codice limita l'esposizione. Non sostituisce la cifratura.**

## 26.7 Autenticazione e attualità

Una persona o un messaggio non devono essere considerati autentici soltanto perché possiedono informazioni interne.

Elementi statici possono essere copiati, sottratti o riutilizzati.

Quando il rischio lo richiede, l'autenticazione deve comprendere un elemento che provi l'identità e un elemento che dimostri che la verifica appartenga alla circostanza corrente.

Le procedure possono utilizzare, secondo il sistema:

- sfide e risposte non riutilizzabili;
- valori monouso;
- riferimenti temporali;
- identificativi di transazione;
- conferme incrociate attraverso un canale indipendente.

Una frase di riconoscimento riutilizzata indefinitamente non costituisce protezione sufficiente.

> **Riconosciuto non significa autenticato. Autenticato non significa attuale.**

## 26.8 Analisi del traffico

Un osservatore può ottenere informazioni senza leggere il contenuto.

Devono essere considerati sensibili anche:

- identità o posizione degli interlocutori;
- presenza o assenza di comunicazione;
- frequenza;
- durata;
- volume;
- variazioni improvvise del traffico;
- coincidenza temporale con eventi esterni.

Un aumento delle comunicazioni prima di un'attività può rivelare che qualcosa sta per accadere anche se ogni messaggio è cifrato.

Quando la struttura della rete è più sensibile del singolo messaggio, il piano delle comunicazioni deve considerare anche il traffico prodotto.

## 26.9 Occultamento e steganografia

Occultare l'esistenza di una comunicazione e cifrarne il contenuto sono problemi differenti.

La steganografia consiste nel nascondere un'informazione all'interno di un altro supporto o flusso in modo che l'esistenza stessa del messaggio non sia evidente.

L'occultamento può ridurre l'attenzione, ma non deve essere considerato equivalente alla protezione crittografica.

Se il contenuto richiede confidenzialità, l'occultamento e la cifratura possono essere utilizzati come strati distinti.

La scoperta del supporto occulto non deve, quando possibile, consegnare automaticamente il contenuto in chiaro.

## 26.10 Comunicazioni dirette e impersonali

Il Cenacolo distingue tra:

### Contatto diretto

Mittente e destinatario interagiscono nello stesso momento.

È il metodo più semplice, ma crea una relazione osservabile tra le due parti.

### Passaggio diretto breve

Materiale viene trasferito durante un contatto molto breve senza un vero colloquio.

Riduce il tempo di esposizione ma continua a collegare fisicamente le parti.

### Comunicazione impersonale

Mittente e destinatario non devono trovarsi nello stesso luogo nello stesso momento.

Comprende punti di scambio, sistemi tecnici asincroni e altre forme di trasferimento differito.

### Intermediario di separazione

Una terza persona o struttura interrompe il collegamento diretto tra origine e destinatario.

### Canale tecnico

Il materiale passa attraverso una rete o un sistema di comunicazione.

Nessuna categoria è intrinsecamente più sicura. Il rischio dipende da chi è osservato, da ciò che deve essere protetto e dalla durata della relazione.

## 26.11 Buca morta

Una **buca morta** o *dead drop* è un punto di scambio non presidiato utilizzato per trasferire materiale senza richiedere un incontro diretto tra le parti.

Una parte deposita. L'altra recupera in un momento differente.

La funzione principale non è nascondere per sempre il materiale. È **separare temporalmente e fisicamente i membri della relazione**.

Principi:

- il punto non deve creare una frequentazione comune facilmente associabile alle due parti;
- il materiale deve essere identificabile dal destinatario senza esporre inutilmente il contenuto;
- il ritrovamento da parte di un terzo deve compromettere il meno possibile la rete;
- una buca morta che appare alterata, osservata o non più coerente con le condizioni previste viene considerata compromessa;
- non si utilizza un punto compromesso per comunicare dove sarà il successivo;
- deposito e recupero non devono avvenire per impulso, ma secondo una procedura concordata.

Le modalità concrete dipendono dall'ambiente e non costituiscono competenza universale dei Commensali.

## 26.12 Segnali di stato

Un segnale può comunicare che una condizione è stata raggiunta senza contenere il messaggio vero e proprio.

Può indicare, per esempio:

- materiale disponibile;
- contatto richiesto;
- procedere;
- non procedere;
- canale compromesso.

Il segnale deve trasmettere il minimo indispensabile.

Quando possibile, il punto o il mezzo utilizzato per segnalare lo stato non deve coincidere con il luogo in cui si trova il materiale principale.

La scoperta di un segnale non deve rendere automaticamente comprensibile l'intera procedura.

## 26.13 Intermediari di separazione

Un intermediario di separazione, tradizionalmente indicato anche come *cut-out*, interrompe il rapporto diretto tra due elementi della rete.

A può conoscere l'intermediario.

B può conoscere l'intermediario.

A e B non devono necessariamente conoscere l'identità reciproca.

Il vantaggio è la compartimentazione.

Lo svantaggio è l'introduzione di un ulteriore punto di:

- compromissione;
- errore;
- ritardo;
- manipolazione;
- perdita.

L'intermediario viene utilizzato quando il rischio di collegare direttamente due parti è maggiore del rischio introdotto dal passaggio aggiuntivo.

## 26.14 Corrieri

Un corriere trasferisce materiale senza dover necessariamente conoscere l'intero quadro operativo.

Le informazioni fornitegli devono essere limitate a ciò che serve per completare il trasferimento.

Quando possibile, il corriere non deve conoscere contemporaneamente:

- origine reale;
- destinatario reale;
- contenuto;
- significato operativo;
- struttura della rete.

Un corriere compromesso non deve poter ricostruire automaticamente l'intera catena.

## 26.15 Passaggi diretti brevi

Un passaggio diretto breve consente di trasferire materiale durante un'interazione minima.

Può essere appropriato quando:

- il contatto tra le parti è già plausibile;
- la finestra utile è breve;
- un incontro più lungo aumenterebbe il rischio.

Non deve essere preferito soltanto perché sembra discreto.

Se una delle due parti è già osservata, il passaggio può creare immediatamente un collegamento tra entrambe.

## 26.16 Piano PACE

Per attività nelle quali la perdita del canale primario può compromettere l'obiettivo, la Tavola può adottare uno schema PACE:

- **Primario**, canale normalmente previsto;
- **Alternativo**, seconda possibilità già predisposta;
- **Contingenza**, mezzo utilizzato quando la situazione non consente i primi due;
- **Emergenza**, mezzo destinato soltanto alla continuità minima o a una necessità grave.

Un'alternativa deve essere realmente indipendente dal problema che potrebbe colpire il canale primario.

Due applicazioni sullo stesso dispositivo non costituiscono necessariamente due canali indipendenti.

Un canale digitale e il proprio metodo di recupero ospitato sulla stessa infrastruttura possono fallire insieme.

Le alternative devono essere definite prima che servano.

## 26.17 Mancato contatto

Un contatto mancato non deve produrre una cascata improvvisata di tentativi.

Quando una comunicazione prevista non arriva:

1. viene rispettato il margine temporale concordato;
2. non si presume immediatamente una compromissione;
3. non si contatta contemporaneamente la stessa persona attraverso ogni mezzo disponibile;
4. si passa al canale successivo secondo il piano;
5. oltre la soglia prevista, il mancato contatto viene registrato come anomalia;
6. ulteriori azioni dipendono dal valore della fonte, dal rischio e dal contesto.

L'urgenza di verificare che qualcuno stia bene non deve collegare tra loro elementi della rete che erano stati deliberatamente separati.

## 26.18 Canale compromesso

Quando un canale è ritenuto compromesso:

- si interrompe l'invio di nuove informazioni sensibili;
- si valuta ciò che può essere stato esposto;
- si attiva il canale successivo già predisposto;
- si rivalutano identità, chiavi e contatti associati;
- si registra il periodo di possibile compromissione.

> **Un canale compromesso non viene utilizzato per concordare il proprio sostituto.**

Se l'avversario controlla il canale corrente, comunicargli indirettamente il nuovo canale trasferisce la compromissione.

## 26.19 Materiale monouso

Il Cenacolo storico ha utilizzato, in epoche differenti, sistemi manuali monouso.

Il caso più importante è il **cifrario a chiave monouso**, noto nella documentazione moderna come *one-time pad*.

La sua sicurezza dipende da condizioni rigorose:

- materiale realmente casuale;
- chiave della stessa estensione necessaria alla comunicazione;
- segretezza della chiave;
- utilizzo una sola volta;
- distruzione o esclusione certa dopo l'uso.

Il riutilizzo elimina la proprietà fondamentale del sistema.

Per questo i cifrari monouso non devono essere improvvisati. Vengono impiegati soltanto quando il materiale è stato predisposto e distribuito secondo procedura.

Nei sistemi correnti la Tavola preferisce crittografia moderna approvata, salvo esigenze specifiche o perdita dell'infrastruttura.

## 26.20 Sistemi storici di comunicazione segreta

La Segreta conserva esempi di sistemi impiegati nei secoli precedenti, tra cui:

- nomenclatori e libri codice;
- cifrari manuali;
- scritture nascoste;
- messaggi occultati in corrispondenza ordinaria;
- microfotografia;
- punti di scambio;
- corrieri;
- segnali di riconoscimento;
- radio;
- sistemi monouso.

La presenza di un metodo negli archivi storici non costituisce autorizzazione al suo impiego corrente.

Una tecnica può essere storicamente autentica e operativamente obsoleta.

## 26.21 Principio di continuità

Dai corrieri delle prime Tavole ai sistemi cifrati contemporanei, il problema operativo rimane lo stesso:

> **Trasferire l'informazione senza consegnare insieme anche la struttura della rete che l'ha prodotta.**

La tecnologia cambia. La necessità di separare contenuto, identità, percorso e contesto rimane.
