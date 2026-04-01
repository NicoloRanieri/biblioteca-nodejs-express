// Quando clicco il bottone, carico tutti i libri
document.getElementById("btn-tutti-libri").addEventListener("click", () => {

    fetch("/libri")   // chiamata al backend
        .then(res => res.json())   // trasformo la risposta in JSON
        .then(libri => {
            const div = document.getElementById("lista-libri");
            div.innerHTML = ""; // pulisco il contenuto precedente

            // per ogni libro, creo un paragrafo
            libri.forEach(libro => {
                div.innerHTML += `
                    <p>
                        <strong>${libro.titolo}</strong>  
                        - ${libro.autore}  
                        - ${libro.genere}  
                        - anno: ${libro.anno}
                        - ${libro.prezzo}€
                    </p>
                `;
            });
        })
        .catch(err => {
            console.error("Errore nel caricamento dei libri:", err);
        });
});


// INSERIMENTO DI UN NUOVO LIBRO
document.getElementById("form-inserisci").addEventListener("submit", (e) => {
    e.preventDefault(); // evita il refresh della pagina

    // prendo i valori dai campi
    const nuovoLibro = {
        titolo: document.getElementById("titolo").value,
        autore: document.getElementById("autore").value,
        genere: document.getElementById("genere").value,
        anno: Number(document.getElementById("anno").value),
        prezzo: document.getElementById("extra").value
    };

    // invio al backend
    fetch("/libri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuovoLibro)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Libro inserito:", data);

        // feedback all’utente
        alert("Libro inserito correttamente!");

        // reset del form
        document.getElementById("form-inserisci").reset();
    })
    .catch(err => {
        console.error("Errore nell'inserimento:", err);
        alert("Errore nell'inserimento del libro");
    });
});



document.getElementById("form-modifica").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("id-modifica").value;

    const datiModifica = {};

    const titolo = document.getElementById("titolo-mod").value;
    const autore = document.getElementById("autore-mod").value;
    const genere = document.getElementById("genere-mod").value;
    const anno = document.getElementById("anno-mod").value;
    const prezzo = document.getElementById("extra-mod").value;

    if (titolo) datiModifica.titolo = titolo;
    if (autore) datiModifica.autore = autore;
    if (genere) datiModifica.genere = genere;
    if (anno) datiModifica.anno = Number(anno);
    if (prezzo) datiModifica.prezzo = prezzo;

    try {
        const res = await fetch(`/libri/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datiModifica)
        });

        const data = await res.json();

        // --- GESTIONE ERRORE ID INESISTENTE ---
        if (data === "Not found") {
            alert("ID inesistente. Nessun libro modificato.");
            return;
        }

        // --- GESTIONE ALTRI ERRORI ---
        if (!res.ok) {
            alert("Errore nella modifica del libro.");
            return;
        }

        // --- SUCCESSO ---
        console.log("Libro modificato:", data);
        alert("Libro modificato correttamente!");
        document.getElementById("form-modifica").reset();

    } catch (err) {
        console.error("Errore nella fetch PUT:", err);
        alert("Errore di comunicazione con il server.");
    }
});


// ELIMINAZIONE DI UN LIBRO
document.getElementById("form-elimina").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("id-elimina").value;

    // --- CONFERMA ELIMINAZIONE ---
    const conferma = confirm(`Sei sicuro di voler eliminare il libro con ID ${id}?`);
    if (!conferma) {
        return; // Utente ha annullato
    }

    try {
        const res = await fetch(`/libri/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        // --- GESTIONE ERRORE ID INESISTENTE ---
        if (data === "Not found" || data.errore === "Libro non trovato") {
            alert("ID inesistente. Nessun libro eliminato.");
            return;
        }

        // --- GESTIONE ALTRI ERRORI ---
        if (!res.ok) {
            alert("Errore nell'eliminazione del libro.");
            return;
        }

        // --- SUCCESSO ---
        alert("Libro eliminato correttamente!");
        document.getElementById("form-elimina").reset();

    } catch (err) {
        console.error("Errore nella fetch DELETE:", err);
        alert("Errore di comunicazione con il server.");
    }
});


//recupero dal backend del numero totale di libri
async function mostraConteggioLibri() {
    try {
        const res = await fetch("/libri/conteggio");
        const data = await res.json();

        // data = { totale: numero }
        document.getElementById("conteggio-libri").textContent =
            `Totale libri: ${data.totale}`;

    } catch (err) {
        console.error("Errore nel conteggio:", err);
        document.getElementById("conteggio-libri").textContent =
            "Errore nel conteggio dei libri";
    }
}



