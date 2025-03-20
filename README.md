# Tirocinio
## Modello e prototipo web per la catalogazione di reperti umani in ambito di medicina legale

### Dipendenze

+ **Node** e **npm** installati
+ Una istanza di **MongoDB** installata e avviata
+ Variabili d'ambiente:
  
  Per eseguire il server backend sono necessarie le seguenti variabili d'ambiente (anche attraverso un file `.env`):
  + `MONGO_URL`: l'indirizzo di connessione del database (es: `mongodb://127.0.0.1:27017/`)
  + `MONGO_DB_NAME`: il nome del database sotto cui operare
  + `STRAPI_API_KEY`: la chiave API di Strapi con permessi di read
  
  Ulteriori variabili d'ambiente facoltative sono:
  + `APP_HTTP_PORT`: indica la porta di ascolto del production server $\rightarrow$ `default = 8080`
  + `APP_HTTP_PORT_DEVMODE`: indica la porta di ascolto del server in dev mode $\rightarrow$ `default = 8080`

### Installazione

Eseguire il comando:
```sh
npm i
```

### Script di Esecuzione
+ #### Frontend
  + `npm run dev`: per eseguire react in dev mode con **Vite**.
    
	In questo caso, eseguire anche il backend in dev mode.
  + `npm run build`: per compilare il frontend in file statici.
+ #### Backend
  + `npm run backend-dev`: per eseguire il backend in dev mode.
    
	In questa modalità, il backend reindirizza le richieste di contenuti statici e connessioni websocket al processo di **Vite**
  + `npm run backend`: per eseguire il backend in production mode.

	In questa modalità, il backend serve i contenuti statici dalla directory di build del frontend.
+ #### Strapi Conversion
  + `npm run conv`: in sviluppo (WIP)
