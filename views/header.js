// header.js
export function crearHeader(onInicioClick) {
  const header = document.createElement("header");
  header.className = "app-header";

  const titulo = document.createElement("h1");
  titulo.textContent = "🎲 Mi App de Juegos";

  const btnInicio = document.createElement("button");
  btnInicio.textContent = "🏠 Inicio";
  btnInicio.className = "btn-inicio";
  btnInicio.addEventListener("click", onInicioClick);

  header.appendChild(titulo);
  header.appendChild(btnInicio);

  return header;
}
