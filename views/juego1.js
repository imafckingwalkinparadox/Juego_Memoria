// juego1.js
export function iniciarJuegoMemoria() {
    const contenedor = document.createElement("div");
    contenedor.className = "juego-memoria";
  
    const titulo = document.createElement("h2");
    titulo.textContent = "Juego de Memoria";
    contenedor.appendChild(titulo);
  
    const tablero = document.createElement("div");
    tablero.className = "tablero";
  
    // Pares de cartas (puedes usar emojis o letras)
    const cartas = ["🐶", "🐱", "🐰", "🦊"];
    let baraja = [...cartas, ...cartas];
  
    // Mezclar
    baraja.sort(() => 0.5 - Math.random());
  
    let primeraCarta = null;
    let bloqueo = false;
  
    baraja.forEach((icono, i) => {
      const carta = document.createElement("div");
      carta.className = "carta";
      carta.dataset.icono = icono;
  
      const frente = document.createElement("div");
      frente.className = "frente";
      frente.textContent = icono;
  
      const dorso = document.createElement("div");
      dorso.className = "dorso";
      dorso.textContent = "❓";
  
      carta.appendChild(dorso);
      carta.appendChild(frente);
  
      carta.addEventListener("click", () => {
        if (bloqueo || carta.classList.contains("descubierta")) return;
  
        carta.classList.add("descubierta");
  
        if (!primeraCarta) {
          primeraCarta = carta;
        } else {
          if (primeraCarta.dataset.icono === carta.dataset.icono) {
            primeraCarta = null;
          } else {
            bloqueo = true;
            setTimeout(() => {
              primeraCarta.classList.remove("descubierta");
              carta.classList.remove("descubierta");
              primeraCarta = null;
              bloqueo = false;
            }, 1000);
          }
        }
      });
  
      tablero.appendChild(carta);
    });
  
    contenedor.appendChild(tablero);
    return contenedor;
  }
  