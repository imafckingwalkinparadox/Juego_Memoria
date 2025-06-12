// inicio.js
import { iniciarJuegoMemoria } from "./juego1.js";

export function crearPantallaInicio() {
  const contenedor = document.createElement("div");
  contenedor.className = "inicio-container";

  const titulo = document.createElement("h1");
  titulo.textContent = "🎮 Elige un juego";
  contenedor.appendChild(titulo);

  const juegos = [
    { nombre: "Juego 1", id: "juego1" },
    { nombre: "Juego 2", id: "juego2" },
    { nombre: "Juego 3", id: "juego3" },
    { nombre: "Juego 4", id: "juego4" }
  ];

  const grid = document.createElement("div");
  grid.className = "grid-juegos";

  juegos.forEach(juego => {
    const card = document.createElement("div");
    card.className = "juego-card";
    card.id = juego.id;

    const nombre = document.createElement("h2");
    nombre.textContent = juego.nombre;

    const icono = document.createElement("span");
    icono.className = "juego-icono";
    icono.textContent = "🕹️";

    card.appendChild(icono);
    card.appendChild(nombre);

    // Solo activa el juego 1 por ahora
    if (juego.id === "juego1") {
      card.addEventListener("click", () => {
        const contenido = document.querySelector(".contenido");
        contenido.innerHTML = "";
        contenido.appendChild(iniciarJuegoMemoria());
      });
    }
    

    grid.appendChild(card);
  });

  contenedor.appendChild(grid);
  return contenedor;
}
