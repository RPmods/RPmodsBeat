# Alpha 0.34 — Level & Social

## Team Timeline Studio
Abre team-studio.html desde un servidor HTTP local o GitHub Pages. Carga el catálogo actual o importa cherrybeat-project.json/levels.js. Selecciona canción y dificultad, carga audio local si quieres marcar tiempos escuchando, añade tramos y exporta. Guarda respaldo del levels.js publicado antes de sustituirlo. La compilación de un mapa conserva las secciones; no se cambia ningún mapa actual en este parche.

- relay: desde/hasta, posición vocal P1–P5. Todas las notas cuyo inicio está dentro del intervalo se asignan al mismo jugador. Si hay menos integrantes, la posición se mapea cíclicamente.
- all: todos juntos en el intervalo.
- duo/trio: grupo variable, elegido por semilla de partida y participación acumulada.
- auto/hueco: en mapas con edición manual, combinaciones de dos o tres sin forzar todo el equipo (en 3v3 se usa dúo para no confundirlo con todos).
- Sin tramos: reparto automático previo con combinaciones variables.
- No se cortan sostenidas. Secciones ordenadas, no superpuestas, dentro de límites jugables. Los tramos explícitos pueden producir repartos deliberadamente desiguales: usa la vista previa.
- Aplica a los formatos de equipo 3v3–5v5. Práctica, 1v1, 2v2 y FFA no cambian sus reglas.
- El Level Studio anterior era un ZIP independiente, no disponible en el repositorio: esta página complementa ese editor, no lo reemplaza. Si vuelves a editar notas con una versión antigua, verifica que no elimine teamSections.

## Evento
templates/coop-event-4.json es una plantilla inactiva, sin pista, sin notas, sin recursos y fuera de Versus. No hay sala ni evento jugable todavía.

## Perfil y ranking
- Top 10 de práctica completa sin Perfect asistidos por canción, dificultad y revisión del mapa, precisión ponderada a dos decimales. Un récord por cuenta, solo mejora. Empates de precisión usan un criterio de UID técnico estable dentro del conjunto devuelto. Sin entradas de CPU.
- El ranking es beta; Firebase controla identidad, rango y actualización del récord, pero no verifica la ejecución musical. El cliente sigue calculando precisión y monedas. No usar como ranking con premios ni considerarlo antitrampas.
- Guardado automático ya existente; se muestra estado pendiente/error. No se promete persistencia de escrituras pendientes si se cierra el navegador sin conexión.
- Primer cambio de nombre después del registro gratis. Posteriores 5.000 BC; transacción y regla de validación. Cuenta existente sin contador empieza con cambio gratis. Invitado cambia nombre local sin coste. No se ha migrado la economía a un servidor confiable.
- Amigos por nombre exacto (distingue mayúsculas) o UID. Si hay homónimos, pedir UID; no se impone unicidad a cuentas existentes. ID visible y copiable en Perfil.

## Despliegue
1. Respaldar reglas de Realtime Database, probar database.rules.json en emulador con dos cuentas: guardar progreso normal, primer cambio, segundo con saldo, segundo sin saldo, intento de cambio directo/contador, búsqueda nombre/UID, duplicados, Top 10 de solo lectura, escritura propia, intento de sobrescribir récord ajeno. Las reglas no se han compilado ni desplegado en este turno.
2. Si pasan, publicar las reglas de esta rama en Firebase; no modificar datos ni configuración de Auth.
3. Integrar PR. Pedir recarga de todos los clientes y recrear salas antiguas (hash de mapa distinto). Confirmar Pages y partidas reales.
4. Validar PC/móvil y editor con proyectos reales. Tests: node tests/level34.mock.js, node tests/team33.mock.js, node tests/matchmaking.mock.js. Las pruebas realizadas son de lógica simulada, no pruebas completas de UI ni de Firebase.
