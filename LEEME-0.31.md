# Alpha 0.31 — Mobile Overhaul

## Cambios
- Dispositivo móvil: Visualización de notas Vertical (predeterminado) u Horizontal, con las mismas rutas, reloj de audio y ventanas de juicio. En vertical las notas bajan hacia cuatro receptores, orden izquierda, arriba, abajo, derecha; controles táctiles debajo. Aliados a la izquierda, rival(es) a la derecha y jugador principal destacado abajo a la izquierda. En pantallas horizontales cortas se compactan los compañeros en dos columnas.
- Rendimiento móvil: Lite de vídeo por defecto (preferencia anterior conservada), partículas, filtros costosos y rig completo de personajes secundarios desactivados de forma predeterminada. Las imágenes de personajes se conservan, con reacciones ligeras mediante CSS. Se puede desactivar también el rig completo del personaje principal. No se promete un FPS concreto sin medir en hardware real.
- Beat Surge: 2,5 % por Perfect, 1,6 % por Great, 0,8 % por Good, 0 % por Miss. Primero se llena al 100 % (40 Perfect manuales). Capacidad de 5 segundos, consumo de 20 % por segundo de audio mientras se pulsa. Soltar pausa el consumo, conserva reserva y permite reutilizarla. Los aciertos asistidos no recargan; una sostenida asistida necesita asistencia hasta su final o continuación manual válida.
- Buscar partida: canción aleatoria, preferencia Cualquiera por defecto o dificultad fija. En 1v1 se busca rival humano; en 2v2–5v5 se conserva el cooperativo contra Team Nova CPU. Cierre de búsqueda rápida a los 10 s si faltan personas, salvo una transferencia de grupo en curso que se protege hasta completarla. Los grupos y salas privadas conservan su selección manual. Bots con nombres ficticios, identificados como CPU; variación determinista de precisión por jugador, partida y segmento sin reaccionar a puntuación humana. 
- Preparación automática en matchmaking. El botón solo aparece para reintentar; en privado se mantiene preparación manual. Si el navegador exige autorización para reproducir audio, se conserva ese gesto.
- Protocolo 0310: separa clientes antiguos y nuevos; catálogo de rutas compatible antes de combinar búsqueda. No cambia niveles, vídeos, monedas ni credenciales.

## Despliegue (orden obligatorio)
1. Probar esta rama en un entorno de prueba. Ejecutar `node tests/mobile31.mock.js`, `node tests/matchmaking.mock.js`, `node tests/departure-game.mock.js` y `node tests/rig30.mock.js`. Los mocks no sustituyen el emulador ni partidas reales.
2. En Firebase Realtime Database, conservar copia de las reglas actuales y validar `database.rules.json` en el emulador. Publicar el fichero de reglas nuevo antes de publicar el cliente 0.31. Las reglas siguen aceptando 0303 para que el cliente antiguo no quede bloqueado mientras se actualiza. No usar reglas públicas de prueba.
3. Validar dos cuentas de prueba: 1v1 humano y CPU; cualquiera + dificultad fija; dos dificultades incompatibles; grupos 2–5; descarga, cancelación, reconexión, salida y resultados. Las reglas no son un servidor antitrampas.
4. Pruebas visuales: Android físico (vertical/horizontal, 320–430 px CSS de ancho), tablet y PC. Verificar 1v1, 2v2, 5v5, FFA, notas sostenidas, botones multi-touch, habilidad, rotación, puntuación, pausas y resultados. Comparar FPS, memoria, tiempo de respuesta y vídeo Lite/HD. Revisar desbordamientos y solapamientos.
5. Integrar el PR únicamente después de la validación. Si hay problemas, mantener la versión 0.30.4 estable.

## Validaciones de esta revisión
- Sintaxis JS, IDs nuevos y estructura JSON/CSS.
- Harness de Beat Surge: carga, cinco segundos acumulados, interrupción y continuación manual de sostenidas, fuentes múltiples y pérdida de foco.
- Mocks de matchmaking: 15 escenarios, incluidas tres nuevas pruebas de compatibilidad/timeout/duelo. Mocks de abandono: cinco escenarios.
- 48 000 notas CPU simuladas: medias ponderadas aproximadas Rookie 65,0 %, Standard 82,4 %, Expert 92,8 %. Semillas reproducibles, sin nombres duplicados dentro del mismo conjunto.
- Pendientes: ejecución visual del código completo en navegador, medición real de FPS y memoria, emulador de reglas y pruebas Firebase con cuentas reales.
