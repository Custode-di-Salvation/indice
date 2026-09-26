# Guida all'inserimento manuale dei contenuti in INDICE

Questa guida descrive come aggiungere a mano record, entità, fonti, media, relazioni e lacune senza rompere i collegamenti interni e senza confondere fatti, valutazioni e ipotesi.

INDICE non contiene Fascicoli o Case. Ogni elemento inserito deve rappresentare informazione effettivamente acquisita, un oggetto archivistico, una relazione esplicita oppure una lacuna nello stato della conoscenza.

## 1. Regole fondamentali

Prima di aggiungere qualunque elemento:

1. stabilire che cosa è stato realmente acquisito;
2. distinguere il contenuto dalla valutazione;
3. identificare la fonte o il metodo di acquisizione;
4. conservare provenienza, data e limiti;
5. collegare soltanto identificativi realmente esistenti;
6. non trasformare una ripetizione nella falsa impressione di corroborazione;
7. non cancellare un elemento diventato superato: modificarne lo stato o collegare una rettifica;
8. non aggiungere informazioni pubbliche soltanto perché sono facilmente reperibili. Devono avere una ragione per entrare nella Segreta.

I file JSON non ammettono commenti, virgole finali o virgolette tipografiche. Usare sempre virgolette dritte (`"`).

## 2. Dove si trovano i dati

| Contenuto | Percorso |
|---|---|
| Persone | `src/data/entities/people.json` |
| Organizzazioni | `src/data/entities/organizations.json` |
| Luoghi | `src/data/entities/locations.json` |
| Eventi | `src/data/entities/events.json` |
| Fenomeni | `src/data/entities/phenomena.json` |
| Oggetti | `src/data/entities/objects.json` |
| Record | `src/data/records/records.json` |
| Fonti | `src/data/sources/sources.json` |
| Media | `src/data/media/media.json` |
| Relazioni statiche | `src/data/relations/relations.json` |
| Lacune | `src/data/gaps/gaps.json` |
| Nodi | `src/data/nodes/nodes.json` |
| Segnaposti autorizzati | `src/data/auth/segnaposti.json` |
| Allegati digitali | `public/archive/` |
| Atti analitici registrati dall'interfaccia | `local-data/concordance-ledger.json` |

Il caricatore legge tutti i file JSON presenti nelle cartelle indicate e unisce gli array. È quindi possibile creare file aggiuntivi, ma ogni identificativo deve rimanere unico nell'intero progetto.

Non modificare normalmente `local-data/concordance-ledger.json` a mano. Proposte, valutazioni, corroborazioni e contraddizioni operative devono essere depositate dall'interfaccia, che conserva Segnaposto e data dell'atto.

Per autorizzare un nuovo Commensale, aggiungere il suo Segnaposto all'array `attivi` in `src/data/auth/segnaposti.json`. Usare la forma canonica in maiuscolo ed evitare duplicati. La rimozione dall'elenco invalida la sessione conservata nel browser al successivo caricamento.

## 3. Convenzione degli identificativi

Usare identificativi mai riciclati, anche dopo una rettifica o una cessazione.

| Oggetto | Formato consigliato | Esempio strutturale |
|---|---|---|
| Record | `SAL-DOC-NNNN` | `SAL-DOC-0002` |
| Persona | `SAL-PER-NNNN` | `SAL-PER-0001` |
| Organizzazione | `SAL-ORG-NNNN` | `SAL-ORG-0001` |
| Luogo | `SAL-LOC-NNNN` | `SAL-LOC-0001` |
| Evento | `SAL-EVT-NNNN` | `SAL-EVT-0001` |
| Fenomeno | `SAL-FEN-NNNN` | `SAL-FEN-0001` |
| Oggetto | `SAL-OBJ-NNNN` | `SAL-OBJ-0001` |
| Fonte | `SAL-SRC-NNNN` | `SAL-SRC-0001` |
| Media | `SAL-MED-NNNN` | `SAL-MED-0001` |
| Lacuna | `LAC-SAL-NNNN` | `LAC-SAL-0002` |
| Relazione inserita manualmente | `REL-SAL-M-NNNN` | `REL-SAL-M-0001` |

Il segmento `M` nelle relazioni manuali evita collisioni con le proposte create dall'interfaccia, che usano identificativi come `REL-SAL-0001`.

Prima di assegnare un codice, cercarlo nell'intero progetto:

```bash
rg "SAL-DOC-0002" src/data local-data
```

Se il comando restituisce già un elemento, scegliere il numero successivo.

## 4. Date e orari

Nei metadati usare:

- `YYYY-MM-DD` quando è nota soltanto la data;
- `YYYY-MM-DDTHH:mm:ss+02:00` quando è nota l'ora locale con offset;
- `YYYY-MM-DDTHH:mm:ssZ` quando l'orario è in UTC.

Esempi:

```text
2026-10-12
2026-10-12T21:40:00+02:00
2026-10-12T19:40:00Z
```

Non inventare ore, minuti o secondi. Se l'ora è approssimativa, dichiararlo nel contenuto o nelle note.

## 5. Ordine consigliato di inserimento

Per un nuovo insieme di materiali, procedere in questo ordine:

1. copiare gli eventuali allegati in `public/archive/`;
2. creare le entità necessarie;
3. creare l'eventuale fonte;
4. creare il record principale;
5. creare eventuali media separati;
6. aggiungere relazioni sostenute dal record;
7. collegare o aggiornare eventuali lacune;
8. avviare INDICE e controllare tutte le pagine;
9. depositare dall'interfaccia eventuali corroborazioni, contraddizioni o valutazioni;
10. eseguire `npm run build`.

Creare prima gli oggetti di destinazione impedisce di lasciare riferimenti verso identificativi inesistenti.

## 6. Inserire un record

### 6.1 Scegliere il tipo corretto

Il campo `tipo` descrive la natura archivistica o il formato generale:

```text
rapporto
documento
lettera
testimonianza
fotografia
mappa
registrazione_audio
video
scansione
estratto
documento_storico
```

Il campo `tipoRapporto`, quando applicabile, descrive la funzione operativa:

```text
segnalazione_immediata
rapporto_osservazione
rapporto_contatto
rapporto_informativo
valutazione_analitica
nota_rettifica_integrazione
```

La priorità di trasmissione ammette soltanto:

```text
immediata
urgente
ordinaria
differibile
```

La priorità indica la velocità necessaria, non l'importanza generale del contenuto. Non usare espressioni come `priorità alta` o `priorità bassa`.

### 6.2 Modello completo di record digitale

Il seguente è un modello strutturale, non un contenuto dell'ambientazione:

```json
{
  "id": "SAL-DOC-0002",
  "tipo": "rapporto",
  "titolo": "TITOLO DEL RECORD",
  "sommario": "Sintesi breve di ciò che il record contiene e della sua rilevanza.",
  "dataOriginale": "2026-10-13",
  "dataAcquisizione": "2026-10-13",
  "nodo": "SAL",
  "disponibilita": "locale",
  "tipoRapporto": "rapporto_osservazione",
  "prioritaTrasmissione": "ordinaria",
  "file": "/archive/SAL-DOC-0002.txt",
  "fileFormat": "testo",
  "provenance": {
    "nodo": "SAL",
    "responsabile": "SEGNAPOSTO",
    "acquisizione": "2026-10-13",
    "supporto": "Documento digitale nativo",
    "autenticita": "verificata",
    "integrita": "verificata",
    "statoMateriale": "originale_digitale",
    "storiaCustodiale": "Descrizione verificabile del percorso del materiale.",
    "conversioniNote": [],
    "fissita": {
      "algoritmo": "SHA-256",
      "impronta": "INSERIRE_L_IMPRONTA_REALE",
      "acquisizione": "2026-10-13",
      "ultimaVerifica": "2026-10-13T20:30:00+02:00",
      "esito": "corrispondente"
    },
    "corroborazioni": 0,
    "contraddizioni": 0,
    "ultimaRevisione": "2026-10-13"
  },
  "entitaAssociate": ["SAL-LOC-0001"],
  "recordCollegati": [],
  "fonteId": "SAL-SRC-0001",
  "affidabilitaFonte": "F",
  "credibilitaInformazione": 3,
  "baseConoscenza": "diretta",
  "validitaTemporale": "corrente",
  "classificazioneAmbito": "intero_record_provvisoria",
  "restrizioni": "",
  "note": "Limiti, omissioni note e condizioni dell'acquisizione.",
  "accessLevel": "ospite",
  "ultimoAggiornamento": "2026-10-13"
}
```

Rimuovere i campi facoltativi vuoti quando non servono. Non lasciare un `fonteId` se non esiste una fonte corrispondente.

### 6.3 Disponibilità del record

Usare un solo valore:

- `locale`: contenuto conservato nel nodo SAL;
- `replicato`: copia autenticata disponibile localmente e proveniente da altro nodo;
- `remoto`: esistenza conosciuta, contenuto conservato altrove;
- `parziale`: disponibili soltanto metadati, estratti o frammenti;
- `orfano`: nodo d'origine non raggiungibile o continuità non verificabile.

Un record `locale` dovrebbe avere un file reale oppure un contenuto nel campo `testo`. Un record `remoto` o `orfano` può non avere `file`.

### 6.4 Allegati e fissità

Per un allegato digitale significativo:

1. collocare il file in `public/archive/`;
2. non usare spazi o caratteri ambigui nel nome;
3. calcolare l'impronta dopo l'ultima modifica;
4. copiare il valore esatto in `provenance.fissita.impronta`;
5. registrare algoritmo, data di acquisizione, ultima verifica ed esito.

Su macOS:

```bash
shasum -a 256 public/archive/NOME_FILE
```

Su Linux:

```bash
sha256sum public/archive/NOME_FILE
```

Valori ammessi per `fileFormat`:

```text
pdf
immagine
audio
video
testo
mappa
scansione
```

La fissità dimostra soltanto che il file corrisponde alla copia di riferimento. Non dimostra che il contenuto sia autentico o vero.

Se un allegato già indicizzato viene modificato, la vecchia impronta non è più valida. Normalmente è preferibile conservare l'originale e creare una nota di rettifica, un'integrazione o una nuova versione collegata.

### 6.5 Autenticità, integrità e stato materiale

`autenticita` ammette:

```text
verificata
non_verificata
contestata
sconosciuta
```

`integrita` ammette:

```text
verificata
non_verificata
compromessa
sconosciuta
```

`statoMateriale` ammette:

```text
originale
originale_digitale
copia
copia_autenticata
copia_non_verificata
trascrizione
estratto
alterato
incerto
```

Questi giudizi sono indipendenti dalla verità del contenuto.

### 6.6 Classificazione informativa

La classificazione combina due assi indipendenti:

- `affidabilitaFonte`: lettera da `A` a `F`;
- `credibilitaInformazione`: numero da `1` a `6`.

Non assegnare `A` soltanto perché la fonte appartiene al Cenacolo. Non assegnare `1` senza origini realmente indipendenti.

`baseConoscenza` ammette:

```text
diretta
indiretta
inferita
non_determinata
```

`validitaTemporale` ammette:

```text
corrente
da_riconfermare
superata
```

Per `classificazioneAmbito` usare:

- `intero_record_provvisoria` quando il codice è una valutazione sintetica e provvisoria dell'intero record;
- `affermazioni_distinte` quando le affermazioni richiedono valutazioni differenti.

Se un documento contiene informazioni sostanzialmente diverse con fonti o valutazioni differenti, preferire record distinti o una nota analitica collegata. Non forzare un unico codice su contenuti incompatibili.

## 7. Inserire un'entità

Un'entità serve a indicizzare un soggetto ricorrente. Non crearla per ogni nome menzionato incidentalmente.

### 7.1 Campi comuni

```json
{
  "id": "SAL-PER-0001",
  "tipo": "persona",
  "nome": "DENOMINAZIONE PRINCIPALE",
  "alias": [],
  "stato": "in_revisione",
  "provenienza": "salvation",
  "nodo": "SAL",
  "sintesi": "Descrizione breve separata dalle valutazioni.",
  "provenance": {
    "nodo": "SAL",
    "responsabile": "SEGNAPOSTO",
    "acquisizione": "2026-10-13",
    "supporto": "SAL-DOC-0002",
    "integrita": "verificata",
    "corroborazioni": 0,
    "contraddizioni": 0,
    "ultimaRevisione": "2026-10-13"
  },
  "infoBlocks": [],
  "tags": [],
  "accessLevel": "ospite",
  "ultimoAggiornamento": "2026-10-13"
}
```

Stati ammessi:

```text
attivo
chiuso
dormiente
in_revisione
incompleto
```

Provenienze ammesse:

```text
salvation
nodo_remoto
archivio_storico
fonte_esterna
```

### 7.2 Campi specifici per tipo

| Tipo | File | Campi specifici disponibili |
|---|---|---|
| `persona` | `people.json` | `sesso`, `nazionalita`, `ruolo`, `organizzazione` |
| `organizzazione` | `organizations.json` | `sede`, `fondazione`, `classificazione`, `membriNoti` |
| `luogo` | `locations.json` | `coordinate`, `regione`, `paese`, `tipologiaLuogo` |
| `evento` | `events.json` | `data`, `luogo`, `partecipanti`, `esito` |
| `fenomeno` | `phenomena.json` | `classificazione`, `frequenza`, `areaInteressata`, `primaOsservazione` |
| `oggetto` | `objects.json` | `collocazione`, `materiale`, `datazione`, `custode` |

Ogni identificativo usato in questi campi dovrebbe puntare a un'entità esistente quando il campo rappresenta un collegamento e non semplice testo descrittivo.

### 7.3 Valutazioni nelle entità

Gli `infoBlocks` servono a separare informazioni e valutazioni:

```json
{
  "tipo": "valutazione",
  "contenuto": "Conclusione analitica formulata senza presentarla come fatto.",
  "fonti": ["SAL-DOC-0002", "SAL-DOC-0003"],
  "confidenza": "moderata"
}
```

Tipi ammessi:

```text
corroborato
non_confermato
valutazione
contraddizione
mancante
```

La `confidenza` analitica può essere `alta`, `moderata` o `bassa`. Non sostituisce affidabilità della fonte o credibilità dell'informazione.

## 8. Collegare record ed entità

Il collegamento operativo principale è `record.entitaAssociate`.

Esempio:

```json
"entitaAssociate": [
  "SAL-PER-0001",
  "SAL-LOC-0001"
]
```

La pagina dell'entità ricava automaticamente i record associati cercando il proprio identificativo dentro `entitaAssociate`. Non è necessario mantenere a mano `recordCount`.

Regole:

- aggiungere soltanto entità effettivamente menzionate o pertinenti al contenuto;
- non usare un'associazione come prova di una relazione;
- se il legame ha un significato preciso, creare anche una relazione con record di supporto;
- controllare che ogni identificativo esista esattamente una volta.

`recordCollegati` può conservare riferimenti tra record, ma non sostituisce una relazione motivata e attualmente non viene mostrato in tutte le viste. Non affidarsi soltanto a questo campo per un nesso importante.

## 9. Inserire una fonte

```json
{
  "id": "SAL-SRC-0001",
  "codename": "DENOMINAZIONE PROTETTA",
  "tipo": "fonte_umana",
  "gestione": "SEGNAPOSTO",
  "stato": "attiva",
  "affidabilita": "F",
  "ultimoApporto": "2026-10-13",
  "rapportiAssociati": ["SAL-DOC-0002"],
  "entitaAssociate": [],
  "identitaRistretta": true,
  "motivoRestrizione": "Motivo concreto della compartimentazione.",
  "noteValutazione": "Base e limiti della valutazione della fonte.",
  "accessLevel": "commensale",
  "ultimoAggiornamento": "2026-10-13"
}
```

Tipi ammessi:

```text
fonte_umana
fonte_documentale
fonte_tecnica
fonte_storica
intercettazione
```

Stati ammessi:

```text
attiva
inattiva
compromessa
sconosciuta
cessata
```

Quando un record deriva da questa fonte, mantenere entrambi i collegamenti:

1. inserire l'ID del record in `source.rapportiAssociati`;
2. inserire l'ID della fonte in `record.fonteId`.

Se l'identità reale è compartimentata, omettere `identitaReale` invece di inserirla in chiaro nello stesso file.

## 10. Inserire un media

Usare un elemento Media per una riproduzione o risorsa visuale/sonora consultabile separatamente. Se il file costituisce una vera unità documentale con provenienza e contenuto informativo autonomo, creare anche o invece un Record.

```json
{
  "id": "SAL-MED-0001",
  "titolo": "TITOLO DEL MEDIA",
  "tipo": "immagine",
  "file": "/archive/media/SAL-MED-0001.png",
  "data": "2026-10-13",
  "nodo": "SAL",
  "provenance": {
    "nodo": "SAL",
    "responsabile": "SEGNAPOSTO",
    "acquisizione": "2026-10-13",
    "supporto": "File digitale",
    "autenticita": "non_verificata",
    "integrita": "verificata",
    "statoMateriale": "copia",
    "corroborazioni": 0,
    "contraddizioni": 0,
    "ultimaRevisione": "2026-10-13"
  },
  "entitaAssociate": ["SAL-LOC-0001"],
  "recordAssociati": ["SAL-DOC-0002"],
  "descrizione": "Descrizione osservabile, distinta dall'interpretazione.",
  "formato": "PNG",
  "accessLevel": "ospite",
  "ultimoAggiornamento": "2026-10-13"
}
```

Calcolare la fissità anche per media significativi. `recordAssociati` conserva il riferimento, mentre `entitaAssociate` permette al media di comparire nelle pagine delle entità.

## 11. Inserire una relazione o concordanza statica

Una relazione non deve esistere soltanto perché due entità compaiono nello stesso record.

```json
{
  "id": "REL-SAL-M-0001",
  "from": "SAL-PER-0001",
  "to": "SAL-LOC-0001",
  "tipo": "presente_a",
  "status": "unvalidated",
  "supportedBy": ["SAL-DOC-0002"],
  "reason": "Spiegazione precisa del nesso proposto e dei suoi limiti.",
  "dataRilevazione": "2026-10-13"
}
```

Tipi ammessi:

```text
presente_a
membro_di
menzionato_in
avvenuto_a
associato_a
collegato_a
custodito_da
osservato_in
prodotto_da
precede
contraddice
possible_match
```

Stati statici ammessi:

```text
confirmed
unvalidated
contradicted
```

Usare `confirmed` soltanto quando esiste una base sufficiente già documentata. Una relazione proposta o da esaminare deve iniziare come `unvalidated`.

Le relazioni possono collegare entità o record nella lista delle concordanze. Il grafo visuale mostra soltanto relazioni tra entità.

Non duplicare in `relations.json` una proposta già presente nel registro locale senza prima decidere quale versione deve rimanere canonica.

## 12. Corroborazioni e contraddizioni

Una corroborazione riguarda una specifica informazione, non automaticamente l'intero record, l'intera fonte o l'intera entità.

### 12.1 Requisiti minimi

Prima di dichiarare una corroborazione verificare che:

- il record di supporto sia diverso dal record valutato;
- l'origine sia realmente indipendente;
- non si tratti della stessa voce ripetuta, copiata o ritrasmessa;
- il supporto riguardi la stessa affermazione e non soltanto lo stesso argomento;
- eventuali discrepanze di data, luogo o formulazione siano dichiarate.

Il sistema impedisce già a un record di corroborare se stesso. Non impedisce automaticamente che due record derivino dalla stessa origine: questa verifica rimane responsabilità del Commensale.

### 12.2 Procedura consigliata

1. avviare INDICE con `npm run dev`;
2. autenticarsi con il proprio Segnaposto;
3. aprire l'entità, il record, la fonte o il media interessato;
4. scegliere `DEPOSITA RISCONTRO`;
5. selezionare `Corroborare` oppure `Contraddire`;
6. indicare una motivazione ricostruibile;
7. selezionare almeno un record pertinente e indipendente;
8. controllare la traccia prodotta nell'interfaccia.

L'atto viene aggiunto a `local-data/concordance-ledger.json`. Non modificare retroattivamente gli atti precedenti.

### 12.3 Effetti della corroborazione

Un riscontro depositato:

- non cambia automaticamente `affidabilitaFonte`;
- non cambia automaticamente `credibilitaInformazione`;
- non cambia automaticamente la confidenza analitica;
- non rende vera l'intera scheda;
- non sostituisce la revisione del record.

Quando i nuovi elementi giustificano una nuova valutazione, aggiornare manualmente il record o aggiungere una nota di rettifica/integrazione, mantenendo visibile la ragione del cambiamento.

I contatori `provenance.corroborazioni` e `provenance.contraddizioni` rappresentano il quadro riconosciuto nei dati archivistici. Aggiornarli soltanto dopo una revisione consapevole, non per il semplice numero di voti o di copie.

## 13. Inserire o aggiornare una lacuna

```json
{
  "id": "LAC-SAL-0002",
  "domanda": "Domanda precisa alla quale la Tavola non può ancora rispondere.",
  "oggetto": "Oggetto della lacuna",
  "rilevanza": "Perché l'assenza incide sull'interpretazione o sulla decisione.",
  "criterioSufficienza": "Quale informazione permetterebbe di considerarla ragionevolmente colmata.",
  "incidenza": "rilevante",
  "stato": "aperta",
  "recordCollegati": ["SAL-DOC-0002"],
  "entitaCollegate": ["SAL-LOC-0001"],
  "vincoli": [],
  "proponente": "SEGNAPOSTO",
  "dataApertura": "2026-10-13",
  "ultimoAtto": "2026-10-13",
  "accessLevel": "ospite"
}
```

Incidenze ammesse:

```text
decisiva
rilevante
limitata
```

Stati ammessi:

```text
aperta
in_verifica
parzialmente_ridotta
colmata
superata
```

Una lacuna colmata o superata non deve essere cancellata. Aggiornarne lo stato, la data dell'ultimo atto e i record collegati.

## 14. Livelli di accesso

Valori tecnici ammessi:

```text
pubblico
ospite
commensale
```

L'applicazione è interamente nascosta prima dell'autenticazione. Nella configurazione locale corrente, una sessione autenticata assume il ruolo `commensale` e può quindi consultare anche elementi marcati `ospite` o `pubblico`.

`hidden: true` è disponibile per future credenziali con autorizzazioni differenti. Non usarlo come sostituto della compartimentazione reale di informazioni sensibili.

## 15. Collegamenti da mantenere coerenti

Quando si aggiunge o modifica un elemento, controllare questa tabella.

| Collegamento | Dove inserirlo |
|---|---|
| Record verso entità | `record.entitaAssociate` |
| Fonte verso record | `source.rapportiAssociati` |
| Record verso fonte | `record.fonteId` |
| Media verso entità | `media.entitaAssociate` |
| Media verso record | `media.recordAssociati` |
| Relazione verso soggetti | `relation.from`, `relation.to` |
| Prove della relazione | `relation.supportedBy` |
| Lacuna verso record | `gap.recordCollegati` |
| Lacuna verso entità | `gap.entitaCollegate` |
| Valutazione di entità verso record | `infoBlock.fonti` |

Un campo numerico come `recordCount`, `sourceCount` o `relationCount` non crea alcun collegamento. Il collegamento deve essere espresso tramite gli identificativi reali.

I conteggi mostrati nel Quadro per ciascun nodo vengono ricavati automaticamente dai record e dalla loro `disponibilita`. Non aggiungere contatori manuali a `nodes.json`.

## 16. Rettifiche, integrazioni e versioni

Non riscrivere un record storico come se avesse sempre contenuto l'informazione nuova.

Quando serve correggere o integrare:

1. conservare il record originale;
2. creare un nuovo record con `tipoRapporto: "nota_rettifica_integrazione"`;
3. indicare chiaramente il record interessato;
4. usare `recordCollegati` e, se necessario, una relazione motivata;
5. spiegare elemento modificato, motivo, nuova base e conseguenze sulla valutazione;
6. aggiornare lo stato o la validità del record precedente senza cancellarlo.

Per una copia sanitizzata creare un nuovo identificativo, dichiarare che si tratta di versione derivata e mantenere il collegamento con l'originale.

## 17. Controlli prima di considerare terminato l'inserimento

### Integrità tecnica

- [ ] Il JSON è valido e non contiene virgole finali.
- [ ] Ogni ID è unico.
- [ ] Ogni riferimento punta a un elemento esistente.
- [ ] Ogni file indicato esiste davvero in `public/archive/`.
- [ ] L'impronta SHA-256 corrisponde al file corrente.
- [ ] Le date usano il formato previsto.
- [ ] `npm run build` termina senza errori.

### Coerenza informativa

- [ ] Fatti, ipotesi e valutazioni restano distinguibili.
- [ ] Affidabilità, credibilità e confidenza analitica non sono confuse.
- [ ] Una fonte interna non riceve automaticamente `A`.
- [ ] Un'informazione non riceve automaticamente `1` senza origini indipendenti.
- [ ] Limiti, omissioni e contraddizioni sono visibili.
- [ ] La priorità di trasmissione descrive la velocità necessaria.
- [ ] Una relazione dispone di record di supporto o resta `unvalidated`.
- [ ] Una corroborazione non deriva dallo stesso record o dalla stessa origine ripetuta.
- [ ] Le lacune rilevanti sono registrate senza colmarle con ipotesi non dichiarate.

### Controllo nell'interfaccia

- [ ] Il nuovo elemento compare nella lista corretta.
- [ ] La ricerca globale lo trova per ID e denominazione; per il Manuale verificare anche una frase presente soltanto nel corpo del capitolo.
- [ ] Tutti i collegamenti aprono la pagina prevista.
- [ ] Il file digitale viene visualizzato o aperto correttamente.
- [ ] Le note e le restrizioni sono visibili.
- [ ] La catena di custodia non presenta campi ingannevoli.
- [ ] Le pagine restano completamente nascoste senza autenticazione.

## 18. Verifica finale

Dopo ogni sessione di inserimento:

```bash
npm run build
```

Poi avviare l'applicazione:

```bash
npm run dev
```

Controllare almeno:

1. pagina del record;
2. entità associate;
3. fonte associata;
4. media allegati;
5. relazioni e concordanze;
6. lacune collegate;
7. ricerca globale;
8. visualizzazione dell'allegato;
9. metadati di autenticità, integrità e fissità;
10. comportamento dopo la chiusura della sessione.

L'inserimento è concluso soltanto quando un altro Commensale può ricostruire che cosa è noto, come è stato acquisito, quali limiti possiede e quali collegamenti sono sostenuti dai record.
