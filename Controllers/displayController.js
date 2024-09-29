// displayController.js
/**
 * Controlador del display de segmentos.
 * Se encarga de la inicialización y la animación del display.
 */

// Inicializa el display de segmentos
var display = new SegmentDisplay("display");
display.pattern = "##:##:##"; // Patrón para mostrar horas: minutos: segundos
display.cornerType = 2;       // Tipo de esquina
display.displayType = 7;      // Tipo de display
display.displayAngle = 9;     // Ángulo del display
display.digitHeight = 20;     // Altura de los dígitos
display.digitWidth = 12;      // Anchura de los dígitos
display.digitDistance = 2;    // Distancia entre dígitos
display.segmentWidth = 3;     // Anchura de los segmentos
display.segmentDistance = 0.5; // Distancia entre segmentos
display.colorOn = "rgba(0, 0, 0, 0.9)"; // Color de los segmentos encendidos
display.colorOff = "rgba(0, 0, 0, 0.1)"; // Color de los segmentos apagados

// Función para animar el display
function animate() {
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    // Formato del valor a mostrar (horas:minutos:segundos)
    var value = ((hours < 10) ? ' ' : '') + hours + 
                ':' + ((minutes < 10) ? '0' : '') + minutes + 
                ':' + ((seconds < 10) ? '0' : '') + seconds;
    
    display.setValue(value); // Actualiza el valor del display
    window.setTimeout(animate, 100); // Llama a la función nuevamente cada 100 ms
}

// Inicia la animación
animate();
