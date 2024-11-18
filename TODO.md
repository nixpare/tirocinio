# Todo list

+ [ ] Rivedere la documentazione dopo un redesign pesante
+ [ ] Modificare il modo in cui vengono aggiunte referenze alle immagini e permettere di creare più referenze per riga, eliminare referenze
+ [ ] Aggiungere opzione per campo min/max su input Number nei template

# Domande

+ Tutte le strutture anatomiche devono essere hard-coded o generabili/modificabili dal client?
  + Nel caso della prima, come strutturare il type system -> pieno di interfacce/oggetti/enum oppure basato su stringhe e numeri? Così si creerebbe una tonnellata di codice, anche duplicato
  + Nel caso della seconda, come gestire tabelle di deduzione basate su dati precedenti? quelli saranno casi speciali hard-coded oppure anche avranno la possibilità di essere creati/modificati dal client? (vedere "Femore esteso" slide 5). Sempre in questo caso invece le varie strutture anatomiche come sono definite? staticamente o anche queste dinamicamente? e come potrebbero essere aggiunte?
    + Possibilità di creare prima dei gruppi? (es Braccio -> 9 parti del braccio come da slide 13 di "distretti corporei")
    + Le immagini per far riferimento a tale gruppo/struttura anatomica? magari sovrapposizioni create ad hoc per ogni struttura dove il corpo è semitrasparente e solo la parte selezionata è in focus/evidenziata -> quando si va hovering da una struttura all'altra, l'immagine nello schermo viene rimpiazzata con quella specifica per mostrare visivamente cosa si sta per selezionare
+ "Femore esteso" slide 12: campi numerici della stessa colonna della stessa tabella potrebbero avere range diversi l'uno dall'altro:
  + Come gestisco l'aggiunta? (gestisco l'aggiunta come se stessi definendo il template? quindi chiedo i min/max, aggiungo la riga al template originale e infine permetto all'utente di mettere il valore come per i campi sopra?)
  + Soluzione banale e già esistente, ovvero i min/max sono gli stessi per tutti i campi input della tabella sotto la stessa colonna
+ "Femore esteso" slide 20: i metodi valgono solo per la struttura anatomica/corpo in esame oppure quando vengono creati devono essere
  salvati (es nel database) e quindi saranno disponibili in successive rilevazioni?
+ "Femore esteso" slide 24: Metodo -> scoring e formule? cosa si intende?
+ "Femore esteso" slide 26: Come slide 5: hard-coded oppure generabile?
+ "Femore esteso" slide 31: Fordisc? Cos'è?
+ "Femore esteso" slide 34: Come i casi precedenti (il fatto che esista una formula non dovrebbe essere quello il problema)
+ da "Femore esteso" slide 39 in poi (Patologie e Lesività): Probabilmente generabili con il sistema di templating, sicuramente va ottimizzato lo stile perchè sono tabelle complesse e si rischia di rendere l'interfaccia dispersiva
+ le immagini che devono essere mostrate assieme alle tabelle sono solo "fittizie"/rappresentative oppure si deve avere la possibilità di poter caricare immagini vere relative al soggetto in esame?
