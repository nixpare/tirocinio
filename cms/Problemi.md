# Problemi con le conversioni

## Lista elementi ha troppi significati:
+ In un campo Select o MultiSelect è la lista delle opzioni
+ In un campo Number (e forse anche per un campo Text):
  + se la lista è vuota, allora il campo è un `<input type="text">`
  + se la lista non è vuota, allora il campo diventa un gruppo ed ogni elemento è un campo a se stante

## Magic Strings:
+ L'elemento `Applica a tutti` nella ListaElementi di MultiSelect è molto probabilmente superfluo e logicamente scorretto rispetto agli altri elementi della lista.
  Probabilmente sarebbe più corretto far si che ogni MultiSelect abbia un tasto che ti permette di selezionarli tutti, senza che venga specificato.

