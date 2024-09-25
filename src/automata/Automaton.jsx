import React, { useState } from 'react';
import { Stage, Container, Graphics, Text } from '@pixi/react';

/**
 * 
 * @description
 * Componente que simula un autómata finito determinista (DFA) para validar palabras.
 * 
 * @state {string} currentState - El estado actual del autómata, es decir, el inicial.
 * @state {string} word - La palabra que se va a validar en el autómata.
 * 
 * @constant {Array<string>} finalStates - La lista de estados finales del autómata.
 * @constant {Array<Object>} transitions - La lista de las transiciones de cada estado.
 * @constant {Object} states - Las coordenadas de cada estado para renderizar.
 * @constant {number} radius - El radio de los círculos de estados.
 * 
 * @function handleWordChange - Actualiza el estado de la palabra cuando cambia el valor de entrada.
 * @function validateWord - Valida la palabra de entrada con las transiciones y estados del autómata.
 * @function getCirclePosition - Calcula la posición en la circunferencia de un círculo dado un ángulo.
 * 
 * 
 * @example 11111111111101010101 -> Palabra no aceptada
 * @example 11111111111101010101001 -> Palabra no aceptada
 * @example 11101010010100011111001 -> Palabra no aceptada
 * 
 * @returns {JSX.Element} El componente renderizado.
 */
const Automaton = () => {
    const [currentState, setCurrentState] = useState('q0');
    const [logs, setLogs] = useState([]);
    const [word, setWord] = useState('');

    //La lista de estados finales del autómata.
    const finalStates = ['q3'];

    //La lista de las transiciones de cada estado.
    const transitions = [
        { from: 'q0', to: 'q0', label: '1' },
        { from: 'q0', to: 'q1', label: '0' },
        { from: 'q1', to: 'q0', label: '1' },
        { from: 'q1', to: 'q2', label: '0' },
        { from: 'q2', to: 'q4', label: '0' },
        { from: 'q2', to: 'q3', label: '1' },
        { from: 'q3', to: 'q4', label: '0' },
        { from: 'q3', to: 'q5', label: '1' },
        { from: 'q4', to: 'q3', label: '1' }, 
        { from: 'q4', to: 'q4', label: '0' }, 
        { from: 'q5', to: 'q5', label: '1' }, 
        { from: 'q5', to: 'q4', label: '0' }, 
    ];

    //Las coordenadas de cada estado para renderizar
    const states = {
        q0: { x: 100, y: 100 },
        q1: { x: 300, y: 100 },
        q2: { x: 500, y: 100 },
        q3: { x: 500, y: 300 },
        q4: { x: 300, y: 250 },
        q5: { x: 100, y: 300 }
    };

    // Radio del círculo del estado
    const radius = 40;

    /**
     * Metodo que se encarga de actualiza el estado de la palabra cuando
     * cambia el valor de entrada.
     *
     * @param {event} e - Evento que se dispara cuando cambia el valor de entrada. 
     */
    const handleWordChange = (e) => {
        setWord(e.target.value);
    };

    /**
     * Metodo que se encarga de valida la palabra de entrada con las transiciones y estados del autómata.
     */
    const validateWord = () => {
        setLogs([]);
        //Se inicializa con el estado inicial del autómata ('q0').
        let current = 'q0';

        //Se inicializa en 0 para comenzar desde el primer carácter de la palabra.
        let index = 0;

        const processLetter = () => {

            //Verifica si se ha recorrido toda la palabra.
            if (index >= word.length) {
                //Verifica si el estado actual es un estado final.
                if (finalStates.includes(current)) {
                    alert('Palabra aceptada');
                } else {
                    alert('Palabra no aceptada');
                }
                return;
            }
            
            //Obtiene el carácter actual de la palabra.
            const letter = word[index];
            /**
             * Busca una transición válida desde el estado actual (current) con
             * la letra actual (letter) en la lista de transiciones (transitions).
            **/
            const transition = transitions.find(t => t.from === current && t.label === letter);
    
            /**
             * Si se encuentra una transición válida, actualiza el estado actual (current) al estado de
             * destino de la transición (transition.to), actualiza el índice (index++), y llama a
             * processLetter nuevamente después de 1 segundo.
             */
            if (transition) {
                current = transition.to;
                setCurrentState(current);

                setLogs(prevLogs => [...prevLogs, `De ${transition.from} a ${transition.to} con "${letter}"`]);
                index++;
                setTimeout(processLetter, 1000); // Espera 1 segundo entre letras
            } else {
                alert('Transición no válida para: ' + letter);
            }
        };

        //Llama a processLetter para iniciar el procesamiento de la palabra.
        processLetter();
    };

    /**
     * Metodo que se encarga de calcula las coordenadas de un punto en la circunferencia de un
     * círculo dado el centro del círculo, el radio y el ángulo.
     * @param {number} x  - Coordenada x del centro del círculo.
     * @param {number} y  - Coordenada y del centro del círculo.
     * @param {number} radius  - Radio del círculo.
     * @param {number} angle  - Ángulo en radianes.
     * 
     * @returns {Object} - Coordenadas del punto en la circunferencia.
     */
    const getCirclePosition = (x, y, radius, angle) => {
        return {
            x: x + radius * Math.cos(angle),
            y: y + radius * Math.sin(angle)
        };
    };

    return (
        <div>
            <h1>Simulación de Autómata</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '1rem' }}>
                <div>
                    <label htmlFor="wordInput" style={{ paddingRight: '4px'}}>Palabra a validar:</label>
                    <input
                        type="text"
                        id="wordInput"
                        value={word}
                        onChange={handleWordChange}
                        style={{ width: '77%' }}
                    />
                </div>
            <button onClick={validateWord}>Validar</button>
            <div>
                <label htmlFor="logsInput" style={{ paddingRight: '4px'}}>Logs:</label>
                <textarea
                    type="text"
                    id="logsInput"
                    value={logs.join(' | ')} // Mostrar logs como texto
                    readOnly
                    style={{ width: '626px', height: 'auto', minHeight: '98px' }}
                />
            </div>
            </div>
            <Stage width={600} height={400} options={{ backgroundColor: 0xFFFFFF }}>
                <Container>
                    {/* Dibujar los estados */}
                    {Object.keys(states).map(state => {
                        const { x, y } = states[state];
                        return (
                            <React.Fragment key={state}>
                                <Graphics
                                    draw={g => {
                                        g.clear();
                                        g.lineStyle(2, 0x000000);
                                        g.beginFill(currentState === state ? 0x00FF00 : 0x66CCFF);
                                        g.drawCircle(x, y, radius);
                                        g.endFill();

                                        // Dibujar un círculo más grande para los estados finales
                                        if (finalStates.includes(state)) {
                                            g.lineStyle(4, 0xFF0000); 
                                            g.drawCircle(x, y, radius + 5); 
                                        }
                                    }}
                                />
                                {/* Etiqueta del estado donde sale q0, etc*/}
                                <Text
                                    text={state}
                                    x={x - 12}
                                    y={y - 12}
                                    style={{ fontFamily: 'Arial', fontSize: 24, fill: 0x000000 }}
                                />
                            </React.Fragment>
                        );
                    })}
                    {/* Dibujar las transiciones */}
                    {transitions.map(transition => {
                        const { from, to, label } = transition;
                        const fromState = states[from];
                        const toState = states[to];

                        
                        
                        // Calcular el ángulo de la transición
                        const angle = Math.atan2(toState.y - fromState.y, toState.x - fromState.x);
                        
                        // Obtener posiciones en la circunferencia
                        const fromCirclePos = getCirclePosition(fromState.x, fromState.y, radius, angle);
                        const toCirclePos = getCirclePosition(toState.x, toState.y, radius, angle + Math.PI); // Invertir el ángulo para el destino
                        
                        // Calcular el desplazamiento para las transiciones paralelas
                        const offset = 20;
                        const parallelOffset = {
                            x: offset * Math.sin(angle),
                            y: offset * Math.cos(angle)
                        };
                        
                        // Calcular las posiciones finales de las transiciones paralelas
                        const fromParallelPos = {
                            x: fromCirclePos.x + parallelOffset.x,
                            y: fromCirclePos.y - parallelOffset.y
                        };
                        const toParallelPos = {
                            x: toCirclePos.x + parallelOffset.x,
                            y: toCirclePos.y - parallelOffset.y
                        };

                        const controlPoint = {
                            x: fromState.x + radius * 2,
                            y: fromState.y
                        };

                        // Pintar las transiciones
                        return (
                            <React.Fragment key={`${from}-${to}`}>
                                <Graphics
                                    draw={g => {
                                        g.clear();
                                        g.lineStyle(2, 0xFF3300);

                                        if (from === to) {
                                            // Si es un bucle, dibujamos una curva en "U" invertida
                                            const controlPointX = fromState.x; // Mantener el mismo punto X
                                            const controlPointY = fromState.y - 150; // Elevar el punto Y para crear la "U" invertida

                                            g.moveTo(fromState.x + radius-10, fromState.y-25); // Comenzar desde la parte derecha del nodo
                                            g.quadraticCurveTo(controlPointX, controlPointY, fromState.x - radius+10, fromState.y-25); // Dibujar la curva de vuelta al otro lado del nodo

                                            // Dibujar la cabeza de la flecha en el lado izquierdo del nodo
                                            const headLength = 10;
                                            const arrowAngle = Math.PI; // Flecha hacia la izquierda
                                            const arrowYOffset = -23; // Desplazamiento vertical de la flecha
                                            const arrowXOffset = 10; // Desplazamiento horizontal de la flecha
                                            g.moveTo(fromState.x - radius + arrowXOffset, fromState.y + arrowYOffset); 
                                            g.lineTo(fromState.x - radius - headLength * Math.cos(arrowAngle - Math.PI / 7) + arrowXOffset, fromState.y - headLength * Math.sin(arrowAngle - Math.PI / 7)+ arrowYOffset);
                                            g.moveTo(fromState.x - radius + arrowXOffset, fromState.y + arrowYOffset); 
                                            g.lineTo(fromState.x - radius - headLength * Math.cos(arrowAngle + Math.PI / 7)-15 + arrowXOffset, fromState.y - headLength * Math.sin(arrowAngle + Math.PI / 7)-10+ arrowYOffset);

                                            g.closePath(); // Cerrar el trazo para el bucle
                                        } else {
                                            g.clear();
                                            g.lineStyle(2, 0xFF3300);
                                            g.moveTo(fromParallelPos.x, fromParallelPos.y);
                                            g.lineTo(toParallelPos.x, toParallelPos.y);
                                            
                                            // Cabeza de flecha
                                            const headLength = 10;
                                            const arrowAngle = Math.atan2(toParallelPos.y - fromParallelPos.y, toParallelPos.x - fromParallelPos.x);
                                            g.lineTo(toParallelPos.x - headLength * Math.cos(arrowAngle - Math.PI / 7), toParallelPos.y - headLength * Math.sin(arrowAngle - Math.PI / 7));
                                            g.moveTo(toParallelPos.x, toParallelPos.y);
                                            g.lineTo(toParallelPos.x - headLength * Math.cos(arrowAngle + Math.PI / 7), toParallelPos.y - headLength * Math.sin(arrowAngle + Math.PI / 7));
                                        }
                                    }}
                                />
                                {/* Etiqueta de la transición */}
                                {from !== to && (
                                    <Text
                                        text={label}
                                        x={(fromParallelPos.x + toParallelPos.x) / 2 - 10}
                                        y={(fromParallelPos.y + toParallelPos.y) / 2 - 10}
                                        style={{ fontFamily: 'Arial', fontSize: 18, fill: 0x000000 }}
                                    />
                                )}
                                {from === to && (
                                    <Text
                                        text={label}
                                        x={fromState.x - 5}
                                        y={fromState.y - 70}
                                        style={{ fontFamily: 'Arial', fontSize: 18, fill: 0x000000 }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Container>
            </Stage>
        </div>
    );
};

export default Automaton;
