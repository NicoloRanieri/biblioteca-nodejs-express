# 📚 Biblioteca Digitale  
Piccolo progetto che simula una libreria digitale, sviluppata con **Node.js + Express** per il backend e **HTML/CSS/JavaScript** per il frontend.  
I dati sono salvati e gestiti tramite **MockAPI**.

---

## L'applicazione permette le seguenti operazioni

### CRUD complete sui libri
- **GET** – Visualizza tutti i libri  
- **POST** – Inserisce un nuovo libro  
- **PUT** – Modifica un libro esistente  
- **DELETE** – Elimina un libro  

Ogni libro contiene:
- titolo  
- autore  
- genere  
- anno  
- prezzo

---

## Elaborazioni implementate

### Conteggio totale dei libri  
`GET /libri/conteggio`

### Ricerca per titolo  
`GET /libri/ricerca/:titolo`

### Conteggio per genere  
`GET /libri/conteggio-genere/:genere`

### Libri dopo un certo anno  
`GET /libri/dopo-anno/:anno`

### Libro più recente  
`GET /libri/piu-recente`

### Ordinamento per anno (crescente/decrescente)  
`GET /libri/ordinati-anno/:ordine`


---

## Installazione e avvio

1. Clona la repository:
   ```bash
   git clone https://github.com/NicoloRanieri/biblioteca-nodejs-express.git
2. Installazione delle dipendenze:
   ```bash
   cd backend
   npm install
3. Avvio del server:
   ```bash
   node server.js

4. Aprire l'app sul browser su
   ` http://localhost:3000 `

---

👤 **AUTORE:**
 Nicolò Ranieri
