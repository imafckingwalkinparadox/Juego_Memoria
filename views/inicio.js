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
  sub.textContent = "Selecciona tu misión para empezar...";

  const grid = document.createElement("div");
  grid.className = "grid-juegos";

  const juegos = [
    { nombre: "Misión 1", id: "juego1" },
    { nombre: "Misión 2", id: "juego2" },
    { nombre: "Misión 3", id: "juego3" },
    { nombre: "Misión 4", id: "juego4" }
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

    if (juego.id === "juego1") {
      card.addEventListener("click", () => {
        const contenido = document.querySelector(".contenido");
        contenido.innerHTML = "";
        contenido.appendChild(iniciarJuegoMemoria());
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
