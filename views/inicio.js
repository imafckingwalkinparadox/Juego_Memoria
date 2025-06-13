import { crearHeader } from "./header.js";
import { iniciarJuegoMemoria } from "./juego1.js";
import { crearSalaDeEspera } from "./espera.js";

//juego de mac
import { crearEncabezado } from "./juego2/encabezado.js";
import { crearJuego } from "./juego2/juego.js";
import { crearTablaResultados } from "./juego2/resultado.js";

export function crearPantallaInicio() {
  const contenedor = document.createElement("div");
  contenedor.className = "pantalla-principal";

  const marco = document.createElement("div");
  marco.className = "marco-juegos";

  const titulo = document.createElement("h1");
  titulo.className = "titulo-juegos";
  titulo.textContent = "🎮 GAME NIGHT";

  const sub = document.createElement("p");
  sub.className = "subtitulo";
  sub.textContent = "Selecciona tu juego para empezar...";

  const grid = document.createElement("div");
  grid.className = "grid-juegos";

  const juegos = [
    { nombre: "Juego Memoria", id: "juego1", fn: iniciarJuegoMemoria },
    { nombre: "Preguntas Time", id: "juego2", fn: () => document.createElement("p") },
    { nombre: "Juego 3", id: "juego3", fn: () => document.createElement("p") },
    { nombre: "Juego 4", id: "juego4", fn: () => document.createElement("p") }
  ];

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

    card.addEventListener("click", () => {
      const contenido = document.querySelector(".contenido");
      contenido.innerHTML = "";

      // Crear el header y agregarlo
      const header = crearHeader(() => {
        const nuevaPantallaInicio = crearPantallaInicio();
        contenido.innerHTML = "";
        contenido.appendChild(header);
        contenido.appendChild(nuevaPantallaInicio);
      });

      // Crear la sala de espera
      const salaEspera = crearSalaDeEspera(juego.nombre, juego.fn);

      // Agregar header y sala al DOM
      contenido.appendChild(salaEspera);
    });

    if (juego.id === "juego2") {
  card.addEventListener("click", () => {
    const contenido = document.querySelector(".contenido");
    contenido.innerHTML = "";
    contenido.appendChild(crearEncabezado());
    contenido.appendChild(crearJuego());
    contenido.appendChild(crearTablaResultados())
  });
}

    grid.appendChild(card);
  });

  marco.appendChild(titulo);
  marco.appendChild(sub);
  marco.appendChild(grid);
  contenedor.appendChild(marco);

  return contenedor;
}
