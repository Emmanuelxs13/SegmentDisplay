// Inicialización del primer display
// const display1 = new SegmentDisplay("clock1");
const display2 = new SegmentDisplay("clock2");
const textDisplay = new SegmentDisplay("textDisplay");
let currentSegmentType = 7;
let currentMessage = ''; // Guarda el mensaje actual
let intervalId;

// Función de inicialización del display
function initDisplay(display, canvasId, pattern) {
  console.log(`Inicializando display en ${canvasId}`);
  display.pattern = pattern || "##:##:##";
  display.segmentCount = currentSegmentType;
  display.digitHeight = parseFloat(document.getElementById('digitHeightRange').value);
  display.digitWidth = parseFloat(document.getElementById('digitWidthRange').value);
  display.digitDistance = parseFloat(document.getElementById('digitDistanceRange').value);
  display.segmentWidth = parseFloat(document.getElementById('segmentWidthRange').value);
  display.segmentDistance = parseFloat(document.getElementById('segmentDistanceRange').value);
  display.cornerType = 2;

  display.colorOn = document.getElementById('colorOn').value;
  display.colorOff = document.getElementById('colorOff').value;

  document.getElementById(canvasId).style.backgroundColor = document.getElementById('bgColor').value;

  display.draw();
}

// Función para actualizar el mensaje y el reloj en los displays
function updateDisplays() {
  const currentTime = new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' });
  display2.setValue(currentTime);
  display2.draw();

  textDisplay.setValue(currentMessage);
  textDisplay.draw();
}

// Configuración de eventos para actualizar valores de configuración
document.querySelectorAll('#digitHeightRange, #digitWidthRange, #digitDistanceRange, #segmentWidthRange, #segmentDistanceRange').forEach(input => {
  input.addEventListener('input', () => {
    initDisplay(display2, 'clock2', "##:##:##");
    initDisplay(textDisplay, 'textDisplay', "#".repeat(currentMessage.length));
  });
});

// Actualización de colores y fondo
document.querySelectorAll('#colorOn, #colorOff, #bgColor').forEach(input => {
  input.addEventListener('input', () => {
    initDisplay(display2, 'clock2', "##:##:##");
    initDisplay(textDisplay, 'textDisplay', "#".repeat(currentMessage.length));
  });
});

// Función para actualizar el reloj en tiempo real
function updateClock() {
  const currentTime = new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' });
  display2.setValue(currentTime);
  display2.draw();
  document.getElementById('displayValue').value = currentTime; // Sincronizar el valor del input con la hora
}

// Evento de cambio en displayMode
document.getElementById('displayMode').addEventListener('change', () => {
  clearInterval(intervalId); // Limpiar cualquier intervalo activo
  const mode = document.getElementById('displayMode').value;
  const displayValueInput = document.getElementById('displayValue');

  if (mode === 'clock') {
    // Deshabilitar el campo de valor en modo Clock y actualizar cada segundo
    displayValueInput.disabled = true;
    updateClock();
    intervalId = setInterval(updateClock, 1000);
  } else {
    displayValueInput.disabled = false;

    if (mode === 'counter') {
      display2.pattern = "###.#";
      let counter = 0;
      intervalId = setInterval(() => {
        display2.setValue(counter.toFixed(1));
        display2.draw();
        counter += 0.1;
      }, 1000);
    } else if (mode === 'ticker') {
      display2.pattern = "####";
      const message = "Bienvenido al Ticker ";
      let position = 0;
      intervalId = setInterval(() => {
        const displayValue = message.slice(position) + message.slice(0, position);
        display2.setValue(displayValue);
        display2.draw();
        position = (position + 1) % message.length;
      }, 200);
    } else if (mode === 'userFormat') {
      const pattern = document.getElementById('displayPattern').value;
      const value = displayValueInput.value;
      display2.pattern = pattern;
      display2.setValue(value);
      display2.draw();
    }
  }
});

// Función para dibujar el texto
function drawText(text) {
  const canvas = document.getElementById('textDisplay');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
  ctx.fillStyle = document.getElementById('colorOn').value; // Color del texto
  ctx.font = `150px Arial`; // Fuente del texto
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2); // Dibujar el texto centrado
}

// Dibujar el reloj y el mensaje al mismo tiempo
function drawClockAndMessage() {
  const canvas = document.getElementById('clock2');
  const ctx = canvas.getContext('2d');

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar el reloj (utilizando el SegmentDisplay)
  const colombiaTime = new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date());

  const [hours, minutes, seconds] = colombiaTime.split(':');
  const value = `${hours}:${minutes}:${seconds}`;
  display2.setValue(value);
  display2.draw();

  // Actualizar el display de texto
  drawText(currentMessage); // Actualizar texto cada segundo
}

// Evento para enviar mensaje
document.getElementById('send-btn').addEventListener('click', () => {
  const message = document.getElementById('card-textarea').value.trim();
  if (message === '') {
    alert('Por favor, ingresa un mensaje.');
    return;
  }
  currentMessage = message; // Asignar mensaje
  drawText(currentMessage); // Actualiza el Segment Display con el texto
});

// Evento de click para eliminar el mensaje
document.getElementById('delete-btn').addEventListener('click', () => {
  currentMessage = ''; // Limpiar el mensaje
  drawText(currentMessage);
});

// Inicializar los displays
initDisplay(display2, 'clock2', "##:##:##");
initDisplay(textDisplay, 'textDisplay', "#".repeat(currentMessage.length));

setInterval(drawClockAndMessage, 1000);
