export function crearSalaDeEspera(nombreJuego, callbackIniciarJuego) {
    const pantalla = document.createElement("div");
    pantalla.className = "pantalla-espera";
  
    const marco = document.createElement("div");
    marco.className = "marco-espera";
  
    const titulo = document.createElement("h2");
    titulo.className = "titulo-espera";
    titulo.textContent = `🕒 Esperando para jugar: ${nombreJuego}`;
  
    const instrucciones = document.createElement("p");
    instrucciones.className = "mensaje-espera";
    instrucciones.textContent = "Espera a que el anfitrión autorice el inicio del juego...";
  
    const inputCodigo = document.createElement("input");
    inputCodigo.type = "text";
    inputCodigo.placeholder = "Código del anfitrión";
    inputCodigo.className = "input-codigo";
  
    const botonEsperar = document.createElement("button");
    botonEsperar.textContent = "Esperar autorización";
    botonEsperar.className = "boton-espera";
  
    botonEsperar.addEventListener("click", () => {
      pantalla.innerHTML = ""; // Limpiamos la pantalla
      pantalla.appendChild(callbackIniciarJuego()); // Mostramos siguiente paso
    });
  
    marco.appendChild(titulo);
    marco.appendChild(instrucciones);
    marco.appendChild(inputCodigo);
    marco.appendChild(botonEsperar);
    pantalla.appendChild(marco);
  
    return pantalla;
  }
  