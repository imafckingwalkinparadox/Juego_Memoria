import { preguntas } from "./data/preguntas.js";

export function crearJuego() {
  const juego = document.createElement("section");
  juego.className = "juego";

  // Elementos de la interfaz
  const preguntaElem = document.createElement("div");
  preguntaElem.className = "pregunta";

  const resultadoElem = document.createElement("div");
  resultadoElem.className = "resultado";
  resultadoElem.id = "resultado";

  const opcionesElem = document.createElement("div");
  opcionesElem.className = "opciones";

  let indicePregunta = 0;
  let vidas = 4;
  let respondidas = 0;
  // Array para almacenar resultados de la partida actual
  const resultadosArray = []; // { pregunta, seleccionada, correcta }

  // --- Funciones de localStorage ---

  // Clave para el historial en localStorage
  const CLAVE_HISTORIAL = "historialPartidas";

  // Obtiene el historial completo (array) desde localStorage
  const obtenerHistorial = () => {
    try {
      const raw = localStorage.getItem(CLAVE_HISTORIAL);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error parseando historial de localStorage:", e);
    }
    return [];
  };

  // Guarda un nuevo resultado al historial en localStorage
  const guardarResultadoLocal = (correctas, incorrectas) => {
    const historial = obtenerHistorial();
    const ahora = new Date();
    // Formato de fecha legible: por ejemplo "2025-06-12 14:23"
    const fechaStr = ahora.toLocaleString(); 
    historial.push({ fecha: fechaStr, correctas, incorrectas });
    try {
      localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    } catch (e) {
      console.error("No se pudo guardar en localStorage:", e);
    }
  };

  // Crea y devuelve un elemento <div> con la tabla del historial completo
  const crearElementoHistorial = () => {
    const historial = obtenerHistorial();
    const contHist = document.createElement("div");
    contHist.className = "historial-partidas";

    const titulo = document.createElement("h3");
    titulo.textContent = "Historial de partidas";
    contHist.appendChild(titulo);

    if (historial.length === 0) {
      const aviso = document.createElement("p");
      aviso.textContent = "No hay partidas guardadas aún.";
      contHist.appendChild(aviso);
      return contHist;
    }

    // Crear tabla
    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const filaEnc = document.createElement("tr");
    ["Fecha", "Correctas", "Incorrectas"].forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      filaEnc.appendChild(th);
    });
    thead.appendChild(filaEnc);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    historial.forEach(item => {
      const fila = document.createElement("tr");

      const tdFecha = document.createElement("td");
      tdFecha.textContent = item.fecha;
      fila.appendChild(tdFecha);

      const tdCor = document.createElement("td");
      tdCor.textContent = String(item.correctas);
      fila.appendChild(tdCor);

      const tdIncor = document.createElement("td");
      tdIncor.textContent = String(item.incorrectas);
      fila.appendChild(tdIncor);

      tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);

    contHist.appendChild(tabla);
    return contHist;
  };

  // --- Lógica de juego como antes, con añadido de guardar historial ---

  const mostrarPregunta = () => {
    const actual = preguntas[indicePregunta];
    preguntaElem.textContent = actual.pregunta;
    opcionesElem.innerHTML = ""; // limpia botones previos
    // Crear botones para cada opción
    actual.opciones.forEach(opcionTexto => {
      const boton = document.createElement("button");
      boton.className = "opcion";
      boton.textContent = opcionTexto;
      boton.disabled = false;
      boton.addEventListener("click", () => verificarRespuesta(opcionTexto, actual.respuestaCorrecta));
      opcionesElem.appendChild(boton);
    });
  };

  const verificarRespuesta = (seleccionada, correctaTexto) => {
    respondidas++;
    // Actualizar contador en encabezado
    const progresoElem = document.querySelector(".info strong");
    if (progresoElem) {
      progresoElem.textContent = `${respondidas}/${preguntas.length}`;
    }

    // Desactivar botones para que no vuelva a cliclear en esta pregunta
    opcionesElem.querySelectorAll("button.opcion").forEach(b => b.disabled = true);

    const esCorrecta = seleccionada === correctaTexto;
    resultadosArray.push({
      pregunta: preguntas[indicePregunta].pregunta,
      seleccionada,
      correcta: esCorrecta
    });

    if (esCorrecta) {
      resultadoElem.textContent = "✅ ¡Correcto!";
      resultadoElem.style.color = "green";
    } else {
      resultadoElem.textContent = "❌ Incorrecto";
      resultadoElem.style.color = "red";
      vidas--;
      actualizarVidas();
    }

    // Tras 1s de feedback, pasar a siguiente o terminar
    setTimeout(() => {
      resultadoElem.textContent = "";
      indicePregunta++;
      if (indicePregunta < preguntas.length && vidas > 0) {
        mostrarPregunta();
      } else {
        terminarJuego();
      }
    }, 1000);
  };

  const actualizarVidas = () => {
    const vidasElem = document.querySelector(".vidas");
    if (vidasElem) {
      vidasElem.textContent = vidas > 0 ? "❤️ ".repeat(vidas).trim() : "";
    }
  };

  const terminarJuego = () => {
    // Mensaje final
    if (vidas > 1) {
      preguntaElem.textContent = "🎉 ¡Juego completado!";
    } else {
      preguntaElem.textContent = "💀 Juego perdido";
    }
    opcionesElem.innerHTML = "";

    // Mostrar sección de resultados actual (preguntas detalladas)
    const seccionResultados = document.getElementById("tabla-resultados");
    if (seccionResultados) {
      seccionResultados.classList.remove("tabla-oculta");

      // Limpiar cuerpo de tabla previa si existiera
      const cuerpoTabla = seccionResultados.querySelector("#cuerpo-tabla");
      if (cuerpoTabla) {
        cuerpoTabla.innerHTML = "";
      }

      // Insertar resumen de esta partida
      const correctas = resultadosArray.filter(r => r.correcta).length;
      const incorrectas = resultadosArray.filter(r => !r.correcta).length;

      // Guardar en localStorage antes de mostrar historial
      guardarResultadoLocal(correctas, incorrectas);

      // Insertar párrafo resumen en la sección resultados
      // Primero eliminar resumen previo si existiese
      let resumenPrevio = seccionResultados.querySelector(".resumen-juego");
      if (resumenPrevio) {
        resumenPrevio.remove();
      }
      const resumenElem = document.createElement("p");
      resumenElem.className = "resumen-juego";
      resumenElem.textContent = `Respuestas correctas: ${correctas}. Respuestas incorrectas: ${incorrectas}.`;
      const tituloH3 = seccionResultados.querySelector("h3");
      if (tituloH3) {
        seccionResultados.insertBefore(resumenElem, tituloH3.nextSibling);
      } else {
        seccionResultados.prepend(resumenElem);
      }

      // Llenar la tabla con detalles de cada pregunta de la partida actual
      resultadosArray.forEach((res, index) => {
        const fila = document.createElement("tr");

        const tdIndex = document.createElement("td");
        tdIndex.textContent = String(index + 1);
        fila.appendChild(tdIndex);

        const tdPregunta = document.createElement("td");
        tdPregunta.textContent = res.pregunta;
        fila.appendChild(tdPregunta);

        const tdSeleccion = document.createElement("td");
        tdSeleccion.textContent = res.seleccionada;
        fila.appendChild(tdSeleccion);

        const tdResultado = document.createElement("td");
        tdResultado.textContent = res.correcta ? "Correcto" : "Incorrecto";
        tdResultado.style.color = res.correcta ? "green" : "red";
        fila.appendChild(tdResultado);

        cuerpoTabla.appendChild(fila);
      });

      // Después de la tabla de la partida actual, mostrar el historial completo
      // Elimina historial previo si existiera
      const existenteHist = seccionResultados.querySelector(".historial-partidas");
      if (existenteHist) {
        existenteHist.remove();
      }
      const elementoHistorial = crearElementoHistorial();
      seccionResultados.appendChild(elementoHistorial);
    }
  };

  // Ensamblar la sección juego
  juego.appendChild(preguntaElem);
  juego.appendChild(resultadoElem);
  juego.appendChild(opcionesElem);

  // Inicializar vidas en encabezado y mostrar primera pregunta
  actualizarVidas();
  mostrarPregunta();

  return juego;
}
