const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_URL = "https://69c7cd8063393440b3172939.mockapi.io/libro";


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



// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});



