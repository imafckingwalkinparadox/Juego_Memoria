export function crearTablaResultados() {
  const tablaSection = document.createElement("section");
  tablaSection.id = "tabla-resultados";
  tablaSection.className = "tabla-oculta";

  const h3 = document.createElement("h3");
  h3.textContent = "Resultados del juego";

  const tablaElement = document.createElement("table");
  const thead = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  ["#", "Pregunta", "Tu respuesta", "Resultado"].forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    filaEncabezado.appendChild(th);
  });
  thead.appendChild(filaEncabezado);
  tablaElement.appendChild(thead);

  const tbody = document.createElement("tbody");
  tbody.id = "cuerpo-tabla";
  tablaElement.appendChild(tbody);

  tablaSection.appendChild(h3);
  tablaSection.appendChild(tablaElement);

  return tablaSection;
}
