# Todo list

+ [x] Slice 6 del Prototipo -> Aggiungere colonne a piacimento
+ [x] Ridurre code duplication nella funzione `PropertyPage` senza introdurre problemi nel rendering loop
+ [x] Implementare una tabella variadica che si basi sugli input del mouse sull'immagine
+ [x] Risolvere gli errori della console relativi a:
  + [x] chiavi duplicate
  + [x] setState durante rendering
+ [ ] Rivedere la documentazione dopo un redesign pesante

# Struttura generale del Progetto

+ [ ] Avere una sezione per la creazione e modifica di template per le strutture anatomiche, le quali verranno salvate a parte nel database
+ [ ] Avere una sezione per la creazione e modifica di rilevamenti (corpi?):
  + [ ] Un rilevamento è una collezione di strutture anatomiche (divise in categorie). Alla creazione del rilevamento, i template delle strutture anatomiche vengono
    copiati in modo che se nel futuro vengono apportate modifiche ai template già esistenti, queste modifiche non invalidano rilevamenti precedenti
  + [ ] Comunque ogni campo del rilevamento può essere modificato se in futuro serve, per esempio, una caratteristica aggiuntiva su una struttura anatomica che
    normalmente non è richiesta