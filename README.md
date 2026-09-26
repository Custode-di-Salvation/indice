# INDICE

Applicazione locale archivistica della Tavola di Salvation. Entità, record, fonti, media e allegati restano **read-only**. La scrittura ammessa dall’interfaccia riguarda soltanto gli atti analitici: i Commensali autenticati possono proporre concordanze e depositare valutazioni, corroborazioni o contraddizioni attribuite al proprio Segnaposto.

Per inserire manualmente nuovi contenuti e mantenerne coerenti classificazioni, allegati e collegamenti, seguire [GUIDA_INSERIMENTO_CONTENUTI.md](GUIDA_INSERIMENTO_CONTENUTI.md).

## Avvio locale

Requisiti: Node.js 20 o successivo.

```bash
npm install
npm run dev
```

Vite mostrerà l’indirizzo locale da aprire nel browser. Per verificare la versione distribuibile:

```bash
npm run build
npm run preview
```

## Struttura dei contenuti

I dati sono separati dai componenti e vengono caricati all’avvio da file JSON. L’intera applicazione resta occultata finché non viene aperta una sessione mediante Segnaposto e Testimone di Tavola:

- `src/data/entities/`: persone, organizzazioni, luoghi, eventi, fenomeni e oggetti;
- `src/data/records/records.json`: unità documentali;
- `src/data/sources/sources.json`: fonti e loro affidabilità;
- `src/data/media/media.json`: media e riproduzioni;
- `src/data/relations/relations.json`: relazioni confermate, ipotesi e contraddizioni;
- `src/data/gaps/gaps.json`: lacune informative e stato corrente della conoscenza;
- `src/data/auth/segnaposti.json`: Segnaposti autorizzati ad aprire una sessione locale;
- `local-data/concordance-ledger.json`: proposte e valutazioni locali, conservate separatamente dai dati archivistici;
- `src/data/nodes/nodes.json`: stato dei nodi conosciuti;
- `content/manual/`: capitoli Markdown del Manuale di Tavola.
- `public/archive/`: allegati digitali realmente serviti dall'applicazione;
- `public/archive/media/`: schemi, facsimili e altre risorse visuali locali.

I modelli TypeScript sono in `src/types/`. Per aggiungere dati reali, mantenere gli stessi campi e identificativi univoci; non è necessario modificare i componenti. Nuovi file JSON nelle cartelle già indicizzate vengono caricati automaticamente.

Le lacune sono elementi consultabili e ricercabili con identificativi `LAC-[NODO]-[NUMERO]`. In questa versione vengono mantenute manualmente nei dati: l’interfaccia non consente di crearle, modificarle o chiuderle. La ricerca globale indicizza anche il testo completo dei capitoli del Manuale, non soltanto titolo e numero.

I conteggi dei record mostrati nel Quadro sono calcolati direttamente dai record appartenenti al nodo. Non devono essere mantenuti manualmente in `nodes.json`.

## Cronologia del nodo SAL

Il contenuto corrente assume che il nodo sia rimasto chiuso dopo la Serrata del 1993 e sia stato riaperto dal Commensale **DREBBEL** il 3 ottobre 2026. Una parte della Segreta storica è sopravvissuta nel Fondaco, ma non è ancora stata ricognita né ammessa automaticamente nell'indice consultabile. I record presenti sono acquisizioni successive alla riapertura; gli eventi anteriori sono ricostruzioni retrospettive prodotte nell'ottobre 2026.

Il repertorio non duplica informazioni civiche o articoli reperibili pubblicamente. Conserva soltanto materiali acquisiti dal Commensale: sopralluoghi, colloqui separati, copie strumentali, documenti fisici e valutazioni interne.

## Convenzioni informative

Tre concetti devono restare distinti:

1. `affidabilitaFonte`: valutazione della fonte con lettera da A a F;
2. `credibilitaInformazione`: valutazione della specifica informazione con numero da 1 a 6;
3. `confidenza` negli `infoBlocks`: forza di una conclusione analitica, espressa come alta, moderata o bassa.

Il record può inoltre indicare `baseConoscenza` (diretta, indiretta, inferita o non determinata) e `validitaTemporale` (corrente, da riconfermare o superata). Corroborazioni e contraddizioni vengono conservate come riscontri documentati: possono motivare la credibilità assegnata, ma non la sostituiscono e non modificano automaticamente l’affidabilità della fonte o la confidenza analitica. INDICE cataloga informazioni e valutazioni, non certifica verità.

## Credenziali locali

Prima dell’autenticazione INDICE non espone Quadro, Manuale, navigazione, ricerca o metadati. Un Commensale inserisce il proprio Segnaposto e avvicina al Terminale il proprio **Testimone di Tavola**. Il sistema confronta il legame con il contrassegno gemello associato al Segnaposto e apre la sessione quando la credenziale risulta ancora valida. Il flusso non richiede una password e non identifica civilmente il portatore. Non è previsto un accesso Ospite.

Il Segnaposto riconosciuto viene salvato nel `localStorage` del browser e la sessione rimane vincolata a esso. Per presentare il Testimone di un altro Commensale occorre prima chiudere esplicitamente la sessione attiva. Un elemento con autorizzazione superiore resta visibile ma oscurato; se possiede anche `hidden: true`, viene rimosso da liste e ricerca per le credenziali non autorizzate. Il riconoscimento del Testimone è una rappresentazione narrativa locale: non sostituisce autenticazione hardware o un sistema di sicurezza per dati sensibili reali.

L'interfaccia accetta soltanto i Segnaposti elencati come attivi in `src/data/auth/segnaposti.json`. Anche il servizio locale verifica lo stesso elenco prima di registrare un atto. Una sessione conservata nel browser viene chiusa automaticamente se il relativo Segnaposto non risulta più attivo.

## Preparazione dei rapporti

Il comando **Aggiungi rapporto** apre una procedura guidata che comprende i sei tipi previsti dal Manuale: segnalazione immediata, rapporto di osservazione, rapporto di contatto, rapporto informativo, valutazione analitica e nota di rettifica o integrazione. I campi specifici cambiano con il tipo selezionato; i pulsanti `?` mostrano una guida sintetica e il collegamento al capitolo pertinente del Manuale.

Il modulo non modifica i file JSON e non registra il rapporto in INDICE. Compone un testo completo attribuito al Segnaposto autenticato. Dopo la copia negli appunti rende disponibile il collegamento a **Filo diretto**, dove il Commensale può incollare e trasmettere la proposta. Per gli allegati può registrare nome, formato, origine, autenticità, integrità, stato materiale, conversioni, modalità di consegna e fissità. Qualunque variazione futura del formato deve conservare la separazione tra contenuto, provenienza, valutazione della fonte, credibilità dell'informazione, corroborazione, limiti, contraddizioni e analisi.

## Concordanze e traccia delle decisioni

La sezione Concordanze ammette due operazioni autenticate:

1. proporre una relazione tra due entità, indicando motivazione e record pertinenti;
2. registrare una valutazione come plausibile, favorevole, contestata, contraddetta, insufficiente o scartata per errore materiale.

Ogni atto viene aggiunto a `local-data/concordance-ledger.json` con Segnaposto, nodo, data, motivazione e supporti dichiarati; le valutazioni delle concordanze registrano anche la confidenza analitica. Gli atti precedenti non vengono sovrascritti: quando lo stesso Segnaposto cambia posizione, INDICE conserva la cronologia ma usa la sua valutazione più recente per calcolare lo stato corrente. Due posizioni favorevoli correnti, provenienti da Segnaposti distinti, producono una **convalida locale**. Eventuali contestazioni rimangono visibili anche dopo la convalida.

Le pagine di entità, record, fonti e media consentono inoltre di corroborare o contraddire una specifica informazione. Il riscontro deve indicare almeno un record e una motivazione. La valutazione si applica all’affermazione citata, non automaticamente all’intera scheda e non modifica da sola l’affidabilità della fonte, la credibilità assegnata o la confidenza analitica.

Un record non può essere selezionato come riscontro di una propria affermazione. Il controllo viene applicato sia dall’interfaccia sia dal servizio locale. Il servizio rifiuta inoltre entità, record di supporto, soggetti o relazioni che non esistono nei dati correnti. Data, identificativo giornaliero e orario dei nuovi atti vengono generati al momento della registrazione nel fuso `Europe/Rome` e conservati nel formato ISO 8601 con offset stagionale, per esempio `2026-10-12T21:40:00+02:00`.

La scrittura nel registro richiede il servizio locale di Vite, quindi usare `npm run dev` oppure `npm run preview`. Aprire direttamente i file generati in `dist/` consente la sola consultazione e non espone il registro locale.

## Manutenzione

- Verificare sempre `npm run build` dopo modifiche a dati o tipi.
- Ogni record marcato come locale dovrebbe indicare un file reale in `public/archive/`; evitare allegati simulati o percorsi inesistenti.
- Per i file significativi conservare separatamente autenticità, integrità, stato del materiale e fissità; registrare algoritmo, impronta e ultima verifica senza presentarli come prova della verità del contenuto.
- Controllare che ogni relazione punti a identificativi esistenti, salvo riferimenti remoti intenzionali.
- Eseguire una copia di sicurezza di `local-data/concordance-ledger.json` prima di interventi manuali; normalmente il file deve essere modificato soltanto attraverso INDICE.
- Conservare il Manuale in Markdown con frontmatter `titolo`, `numero`, `parte`, `stato` e `revisione`.
- Inserire allegati futuri in `public/archive/` e valorizzare `file` e `fileFormat` nel record.
- Non introdurre entità “Fascicolo” o “Case”: nell’Indice entrano soltanto le informazioni risultanti.
- Membri, dotazione e artefatti non fanno parte di questa installazione e non vanno reintrodotti come sezioni di navigazione.
