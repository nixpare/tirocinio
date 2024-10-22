# Todo list

+ [x] Slice 6 del Prototipo -> Aggiungere colonne a piacimento
+ [x] Ridurre code duplication nella funzione `PropertyPage` senza introdurre problemi nel rendering loop
+ [ ] Implementare una tabella variadica che si basi sugli input del mouse sull'immagine

# Idee

+ [x] Aggiungere tra gli `InputMode` una sorta di multi-stage dove la scelta di un valore del menu a tendina modifica il tipo di input successivi, direttamente nel template, abilitando quindi una sorta di ricorsione
+ [x] Aggiungere a `BonePropertyTable` un attributo che dica se la tabella è variadica, in che modo si aggiungono le righe (se col mouse o con un pulsante).
  Quindi aggiungere un modo per cancellare la riga, sia che essa sia stata creata col mouse oppure col pulsante