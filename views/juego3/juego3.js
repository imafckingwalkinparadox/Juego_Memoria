document.addEventListener('DOMContentLoaded', function () {
  const config = {
    niveles: [
      { objetivos: 8, tiempo: 45, tamaño: 80, velocidad: 0, puntos: 10 },
      { objetivos: 10, tiempo: 40, tamaño: 70, velocidad: 0.5, puntos: 12 },
      { objetivos: 12, tiempo: 35, tamaño: 65, velocidad: 0.8, puntos: 15 },
      { objetivos: 14, tiempo: 35, tamaño: 60, velocidad: 1.0, puntos: 18 },
      { objetivos: 16, tiempo: 30, tamaño: 55, velocidad: 1.3, puntos: 20 },
      { objetivos: 18, tiempo: 30, tamaño: 50, velocidad: 1.6, puntos: 22 },
      { objetivos: 20, tiempo: 25, tamaño: 45, velocidad: 1.9, puntos: 25 },
      { objetivos: 22, tiempo: 25, tamaño: 40, velocidad: 2.2, puntos: 28 },
      { objetivos: 25, tiempo: 20, tamaño: 35, velocidad: 2.5, puntos: 30 },
      { objetivos: 30, tiempo: 20, tamaño: 30, velocidad: 3.0, puntos: 35 }
    ]
  };

  let estado = {
    nivel: 1,
    puntos: 0,
    tiempo: 0,
    objetivos: 0,
    combo: 0,
    maxCombo: 0,
    activo: false,
    ultimoGolpe: 0
  };

  let elementos = {
    blancos: [],
    intervalo: null,
    reloj: null
  };

  const dom = {
    zona: document.querySelector('.zona-juego'),
    nivel: document.querySelector('.nivel'),
    puntos: document.querySelector('.puntos'),
    tiempo: document.querySelector('.tiempo'),
    objetivos: document.querySelector('.objetivos'),
    pantallas: {
      inicio: document.querySelector('.inicio'),
      finNivel: document.querySelector('.fin-nivel'),
      finJuego: document.querySelector('.fin-juego')
    }
  };

  function guardarResultadoEnBD() {
    const codigo = localStorage.getItem('usuario') || 'anonimo';
    const puntos = estado.puntos;
    const nivel = estado.nivel;
    const max_combo = estado.maxCombo;

    fetch('http://localhost:3000/api/jugador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, puntos, nivel, max_combo })
    })
    .then(res => res.json())
    .then(data => console.log('Datos guardados:', data))
    .catch(err => console.error('Error al guardar:', err));
  }

  function iniciarJuego() {
    estado = {
      nivel: 1,
      puntos: 0,
      tiempo: 0,
      objetivos: 0,
      combo: 0,
      maxCombo: 0,
      activo: false,
      ultimoGolpe: 0
    };

    ocultarPantallas();
    mostrarPantallaInicio();
  }

  function mostrarPantallaInicio() {
    const nivelActual = config.niveles[estado.nivel - 1];

    dom.pantallas.inicio.innerHTML = `
      <h1>Nivel ${estado.nivel}</h1>
      <p>Objetivos: ${nivelActual.objetivos}</p>
      <p>Tiempo: ${nivelActual.tiempo}s</p>
      <p>Tamaño blancos: ${nivelActual.tamaño}px</p>
      <p>Velocidad: ${nivelActual.velocidad.toFixed(1)}</p>
      <p>Puntos: ${nivelActual.puntos}/blanco</p>
      <button class="btn-jugar">Comenzar</button>
    `;

    dom.pantallas.inicio.style.display = 'flex';
    dom.pantallas.inicio.querySelector('.btn-jugar').onclick = comenzarNivel;
  }

  function comenzarNivel() {
    const nivelActual = config.niveles[estado.nivel - 1];

    estado.activo = true;
    estado.objetivos = nivelActual.objetivos;
    estado.tiempo = nivelActual.tiempo;

    actualizarUI();
    ocultarPantallas();
    crearBlancos(nivelActual);

    clearInterval(elementos.reloj);
    elementos.reloj = setInterval(actualizarTemporizador, 1000);
  }

  function crearBlancos(nivel) {
    elementos.blancos = [];
    dom.zona.innerHTML = '';

    for (let i = 0; i < nivel.objetivos; i++) {
      const blanco = document.createElement('div');
      blanco.className = 'blanco';

      let x, y, colision;
      let intentos = 0;

      do {
        colision = false;
        x = Math.random() * (dom.zona.clientWidth - nivel.tamaño);
        y = Math.random() * (dom.zona.clientHeight - nivel.tamaño);

        for (const otro of elementos.blancos) {
          const distancia = Math.hypot(x - otro.x, y - otro.y);
          if (distancia < nivel.tamaño * 1.5) {
            colision = true;
            break;
          }
        }

        intentos++;
      } while (colision && intentos < 100);

      blanco.style.cssText = `
        width: ${nivel.tamaño}px;
        height: ${nivel.tamaño}px;
        left: ${x}px;
        top: ${y}px;
      `;

      const datosBlanco = {
        elemento: blanco,
        x, y,
        dx: nivel.velocidad ? (Math.random() - 0.5) * nivel.velocidad * 2 : 0,
        dy: nivel.velocidad ? (Math.random() - 0.5) * nivel.velocidad * 2 : 0,
        tamaño: nivel.tamaño
      };

      blanco.onclick = () => golpearBlanco(datosBlanco);
      dom.zona.appendChild(blanco);
      elementos.blancos.push(datosBlanco);
    }

    if (nivel.velocidad > 0) {
      clearInterval(elementos.intervalo);
      elementos.intervalo = setInterval(moverBlancos, 16);
    }
  }

  function moverBlancos() {
    const ancho = dom.zona.clientWidth;
    const alto = dom.zona.clientHeight;

    elementos.blancos.forEach(blanco => {
      blanco.x += blanco.dx;
      blanco.y += blanco.dy;

      if (blanco.x < 0 || blanco.x > ancho - blanco.tamaño) blanco.dx *= -1;
      if (blanco.y < 0 || blanco.y > alto - blanco.tamaño) blanco.dy *= -1;

      blanco.x = Math.max(0, Math.min(blanco.x, ancho - blanco.tamaño));
      blanco.y = Math.max(0, Math.min(blanco.y, alto - blanco.tamaño));

      blanco.elemento.style.left = `${blanco.x}px`;
      blanco.elemento.style.top = `${blanco.y}px`;
    });
  }

  function golpearBlanco(blanco) {
    if (!estado.activo) return;

    blanco.elemento.classList.add('hit');
    setTimeout(() => blanco.elemento.remove(), 300);

    elementos.blancos = elementos.blancos.filter(b => b !== blanco);

    const ahora = Date.now();
    estado.combo = (ahora - estado.ultimoGolpe < 1000) ? estado.combo + 1 : 1;
    estado.ultimoGolpe = ahora;
    estado.maxCombo = Math.max(estado.maxCombo, estado.combo);

    const puntosNivel = config.niveles[estado.nivel - 1].puntos;
    estado.puntos += puntosNivel * estado.combo;
    estado.objetivos--;

    actualizarUI();

    if (estado.objetivos <= 0) {
      finalizarNivel(true);
    }
  }

  function actualizarTemporizador() {
    if (!estado.activo) return;

    estado.tiempo--;
    actualizarUI();

    if (estado.tiempo <= 0) {
      finalizarNivel(false);
    }
  }

  function finalizarNivel(exito) {
    estado.activo = false;
    clearInterval(elementos.reloj);
    clearInterval(elementos.intervalo);

    if (exito && estado.nivel < config.niveles.length) {
      dom.pantallas.finNivel.innerHTML = `
        <h2>¡Nivel ${estado.nivel} completado!</h2>
        <p>Puntos: ${estado.puntos}</p>
        <p>Tiempo restante: ${estado.tiempo}s</p>
        <p>Combo máximo: ${estado.maxCombo}x</p>
        <button class="btn-siguiente">Siguiente nivel</button>
      `;

      dom.pantallas.finNivel.style.display = 'flex';
      dom.pantallas.finNivel.querySelector('.btn-siguiente').onclick = () => {
        estado.nivel++;
        comenzarNivel();
      };
    } else {
      guardarResultadoEnBD();

      dom.pantallas.finJuego.innerHTML = `
        <h2>${exito ? '¡Juego completado!' : '¡Tiempo agotado!'}</h2>
        <p>Puntos totales: ${estado.puntos}</p>
        <p>Nivel alcanzado: ${estado.nivel}</p>
        <p>Máximo combo: ${estado.maxCombo}x</p>
        <button class="btn-reiniciar">Jugar de nuevo</button>
      `;

      dom.pantallas.finJuego.style.display = 'flex';
      dom.pantallas.finJuego.querySelector('.btn-reiniciar').onclick = iniciarJuego;
    }
  }

  function actualizarUI() {
    dom.nivel.textContent = `Nivel: ${estado.nivel}`;
    dom.puntos.textContent = `Puntos: ${estado.puntos}`;
    dom.tiempo.textContent = `Tiempo: ${estado.tiempo}s`;
    dom.objetivos.textContent = `Objetivos: ${estado.objetivos}`;
  }

  function ocultarPantallas() {
    Object.values(dom.pantallas).forEach(p => p.style.display = 'none');
  }

  const loginContainer = document.getElementById('login');
  const loginForm = document.getElementById('login-form');

  const paso1 = document.createElement('div');
  paso1.innerHTML = `
    <h2>Ingresa tu nombre</h2>
    <input type="text" id="nombre-jugador" placeholder="Tu nombre" required />
    <button id="btn-nombre">Siguiente</button>
  `;

  const paso2 = document.createElement('div');
  paso2.style.display = 'none';
  paso2.innerHTML = `
    <h2>Ingresa el código</h2>
    <input type="text" id="codigo-jugador" placeholder="Código" required />
    <button id="btn-codigo">Comenzar</button>
  `;

  loginForm.append(paso1, paso2);

  document.getElementById('btn-nombre').onclick = () => {
    const nombre = document.getElementById('nombre-jugador').value.trim();
    if (nombre) {
      localStorage.setItem('usuario', nombre);
      paso1.style.display = 'none';
      paso2.style.display = 'block';
    } else {
      alert('Por favor, ingresa tu nombre.');
    }
  };

  document.getElementById('btn-codigo').onclick = () => {
    const codigo = document.getElementById('codigo-jugador').value.trim();
    if (codigo) {
      loginContainer.style.display = 'none';
      document.getElementById('juego').style.display = 'block';
      iniciarJuego();
    } else {
      alert('Ingresa el codigo.');
    }
  };
});
