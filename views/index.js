// index.js
import { crearPantallaInicio } from "./inicio.js";
import { crearHeader } from "./header.js";

const root = document.getElementById("root");
root.className = "principal";

// Crear contenedor principal con header y contenido
const app = document.createElement("div");
app.className = "app-container";

// Función para cargar el inicioviews/index.js
function cargarInicio() {
  const contenido = document.querySelector(".contenido");
  contenido.innerHTML = "";
  contenido.appendChild(crearPantallaInicio());
}

// Header fijo con botón
const header = crearHeader(cargarInicio);
const contenido = document.createElement("div");
contenido.className = "contenido";

app.appendChild(header);
app.appendChild(contenido);
root.appendChild(app);

// Mostrar inicio al principio
cargarInicio();
