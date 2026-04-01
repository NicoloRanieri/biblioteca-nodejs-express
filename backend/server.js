const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_URL = "https://69c7cd8063393440b3172939.mockapi.io/libro";

app.use(express.static("frontend"));

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});


// -------------------------------------- elaborazioni -------------------------------

//conteggio di quanti libri sono presenti nel sistema
app.get("/libri/conteggio", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const libri = await response.json();

    const totale = libri.length;

    res.json({ totale });

  } catch (error) {
    res.status(500).json({ error: "Errore nel conteggio dei libri" });
  }
});


//ricerca di un libro per titolo
app.get("/libri/ricerca", async (req, res) => {
  const { titolo } = req.query;

  try {
    const response = await fetch(API_URL);
    const libri = await response.json();

    const risultati = libri.filter(libro => 
        libro.titolo.toLowerCase().includes(titolo.toLocaleLowerCase())
    );

    res.json(risultati);

  } catch (error) {
    res.status(500).json({ error: "Errore nella ricerca dei libri" });
  }
});


// visualizza tutti i libri
app.get("/libri/cont", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei libri" });
  }
});


//conteggio per genere
app.get("/libri/conteggio-genere", async (req, res) => {
    const { genere } = req.query;

  try {
    const response = await fetch(API_URL);
    const libri = await response.json();

    const risultato = libri.filter(libro => 
        libro.genere.toLowerCase() === genere.toLowerCase()
    );

    res.json(risultato.length);

  } catch (error) {
    res.status(500).json({ error: "Errore nel conteggio per genere" });
  }
});


//cerca libri scritti dopo un certo anno fornito dall'utente
app.get("/libri/dopo-anno", async (req, res) => {
    const { anno } = req.query;

    try {

        if (!anno) {
            return res.status(400).json({ error: "anno non specificato" });
        }

        const annoNum = Number(anno);

        if(annoNum <= 0 || isNaN(annoNum)){
            return res.status(400).json({ error: "anno inserito non valido" });
        }

        const response = await fetch(API_URL);
        const libri = await response.json();

        const risultato = libri.filter(libro => libro.anno >= annoNum);

        res.json(risultato);

    } catch (error) {
        res.status(500).json({ error: "Errore nel filtraggio per anno" });
    }
});


// libro più recente
app.get("/libri/piu-recente", async (req, res) => {
    try {
        const response = await fetch(API_URL);
        const libri = await response.json();

        if (libri.length === 0) {
            return res.json({ message: "Nessun libro disponibile" });
        }        

        let libroPiuRecente = libri[0];
        for(libro of libri){
            if(libro.anno > libroPiuRecente.anno){
                libroPiuRecente = libro;
            }
        }
        res.json(libroPiuRecente);

    } catch (error) {
        res.status(500).json({ error: "Errore nel calcolo del libro più recente" });
    }
});


//ordinamento per anno (crescente o decrescente)
app.get("/libri/ordinati-anno", async (req, res) => {
    const { ordine } = req.query; // cre o decre

    try {
        const response = await fetch(API_URL);
        const libri = await response.json();

        if(!ordine){
            res.status(400).json({ error: "metodo di ordinamento non specificato" });
        }

        if(ordine === "cre"){
            const risultato = libri.sort((a,b) => a.anno - b.anno);
            res.json(risultato);
        }else if(ordine === "decre"){
           const risultato = libri.sort((a,b) => b.anno - a.anno);
           res.json(risultato); 
        }else{
            res.status(400).json({ error: "metodo di ordinamento non valido" });
        }


    } catch (error) {
        res.status(500).json({ error: "Errore nell'ordinamento per anno" });
    }
});


// ---------------------------------------- crud ------------------------------------


app.get("/", (req, res) => {
  res.send("Backend della biblioteca attivo!");
});

// visualizza tutti i libri
app.get("/libri", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei libri" });
  }
});


//visualizza un libro nello specifico
app.get("/libri/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ errore: "Errore nel server" });
    }
});


//inserisce un nuovo libro
app.post("/libri", async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Errore nell'inserimento del libro" });
  }
});

// modifica di un libro in particolare
app.put("/libri/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Controllo se il libro esiste
        const rispostaGet = await fetch(`${API_URL}/${id}`);
        const libroEsistente = await rispostaGet.json();

        if (!libroEsistente) {
            return res.status(404).json({ errore: "Libro non trovato" });
        }

        // 2. Se esiste, procedo con la modifica
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Errore PUT:", error);
        res.status(500).json({ errore: "Errore nella modifica del libro" });
    }
});


//eliminazione di un libro
app.delete("/libri/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione del libro" });
  }
});









