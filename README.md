> **Paquete Alpha 0.21 configurado para RPmodsBeat:** consulta `../LEEME-PRIMERO.txt` y `LOCAL-SYNC-0.21.md` antes de las instrucciones históricas de versiones anteriores. El Level Studio se incluye en un ZIP independiente junto al juego.

# Match Arena · Alpha 0.20

- Versus tiene tres apartados: Buscar partida, Mi grupo y Sala privada (FFA).
- Matchmaking cooperativo 1v1–5v5: busca durante 12 segundos, combina grupos compatibles y completa con CPU. La descarga y confirmación de recursos se realiza después.
- Sala privada FFA: 2–5 personas reales, ruta completa por persona, clasificación en directo y MVP único.
- Respaldo JSON de perfil, importación solo como invitado.
- Antes de usar online actualiza `database.rules.json` en Firebase. No reemplaces tu `firebase-config.js` configurado.
- Ver `MATCHMAKING-Y-RESPALDOS.md`.

# Alpha 0.18 — Beat Surge

**Habilidad personal:** la barra comienza vacía; Perfect +5%, Great +4%, Good +2,5%, Miss +0%. Al 100%, mantén Espacio o el botón táctil durante 2 segundos. El motor juzga como Perfect las notas de tu ruta cuyo inicio cae en los siguientes 8 segundos de canción. No consume notas de compañeros ni recarga energía con Perfect asistidos. Si una sostenida empieza dentro de la ventana, finaliza automáticamente aunque cruce su límite. No se activa si no hay notas próximas; la habilidad termina al finalizar la parte jugable. Pausar cancela una pulsación de activación incompleta; la ventana activa se conserva en el reloj musical. Reiniciar restablece la barra. Espacio está reservado y antiguas asignaciones conflictivas se migran automáticamente.

Los resultados registran usos y Perfect asistidos. La habilidad se aplica a Práctica y Versus local contra bots; para un futuro online real se deberá validar en el servidor y decidir reglas competitivas.

**Revisión visual:** contornos de expresiones, uniones de hombros y piernas, residuos blancos en cabello de Zombyexx; se conservan los diseños, cosméticos y rig modular.

# Cherry Beat — Alpha 0.16 · Starlight Encore

Actualización compatible con Alpha 0.15 y con GitHub Pages (rutas relativas, sin backend). Extraer en la raíz del repositorio; conservar `.nojekyll`. Los perfiles se guardan en el mismo espacio local de navegador.

## Novedades 0.16
- Lobby de escenario con artista central animado, navegación lateral, elenco de cinco artistas y acceso principal a Versus.
- Zombyexx: nuevo artista jugable, cuervo exclusivo en su hombro derecho (a la izquierda del espectador); sprites y expresiones adaptados de las referencias generadas. Cuervo con movimiento de balanceo, elevación y aleteo parcial. El motor es 2D por capas, no un rig 3D.
- 26 estados de gameplay + 7 clips de vestidor de 4,7 segundos por artista; estos últimos comparten el motor y varían amplitud según el artista. Los cosméticos se componen con el cuerpo base.
- Cinco sets exclusivos de Zombyexx: Starmap Scholar, Void Circuit (épicos), Astral Conductor, Night Sovereign (legendarios), Galaxy Nexus (exótico). Son variantes de textura estampada con efectos propios, no prendas de geometría redibujada. Los cosméticos universales siguen disponibles.
- Gacha con selector de colección (Todas, Astral, Zombyexx). Probabilidades por rareza iguales: 63/27/8/2. Giros ×1 y ×10, canje local y recompensas existentes conservados.
- Dos fondos de carga ilustrados alternados, barra real de progreso separada de la ilustración. Sin modelos 3D ejecutables.
- Estrellas de equipo animadas al cruzar umbrales, texto de precisión renovado, replay obligatorio de aproximadamente 9,8 s antes del resultado.
- Formación de cinco personajes distintos en cada equipo 5v5; bots locales, no conexión online.

Pruebas: sintaxis JS, menú/vestidor y gacha ×10 en Chromium con recursos embebidos reducidos; ambas canciones y cinco tamaños de Versus con reloj simulado. El ensayo extendido de la transición final agotó el límite del entorno. Falta validar audio real, carga HTTPS y dispositivos físicos. La animación es experimental y puede mostrar uniones en recortes de ropa/cabello.

# Alpha 0.15 — Motion Lab (experimental)

Consulta [MOTION-LAB.md](MOTION-LAB.md) para los cambios, pruebas y limitaciones del nuevo motor.

# Cherry Beat — Alpha 0.14 | Encore Release

Consulta [PUBLICACION.md](PUBLICACION.md) para publicar en GitHub Pages, controles, carga y notas de las canciones.

# Cherry Beat — Alpha 0.12 · Wardrobe Refresh

Prototipo estático de ritmo vocal, orientado a escritorio y adaptable a móviles. No requiere instalación ni servidor externo. Extrae el ZIP y abre `index.html` (o `INICIAR-WINDOWS.bat`). `SERVIDOR-LOCAL.bat` es opcional. El código funciona sin módulos ni peticiones fetch locales; se puede alojar en un servidor estático.


## Alpha 0.12 — Wardrobe Refresh
- Rediseño del vestidor: personaje central más grande, filtros laterales, resumen de equipamiento y panel de inventario dedicado.
- Rediseño de la tienda: hero lateral con spotlight dinámico, mejor jerarquía visual y vista previa ampliada del cosmético seleccionado.
- Ajuste visual para Meli Meli y GuizzMurdock en los previews, bajando unos píxeles la composición para evitar recortes visibles en boina / sombrero.
- Se mantienen las mismas mecánicas locales, gacha y economía de la Alpha 0.11.

## Juego
- **Jugar**: práctica individual sin rival, con puntuación, estrellas, historial y Beat Coins por rendimiento al completar la ruta.
- **Versus**: 1v1, 2v2, 3v3, 4v4 y 5v5 contra CPU; sin matchmaking online real. En equipos, cada nota se asigna a una sola ruta por bando, grupos cortos con relevos. Las rutas rivales usan las mismas asignaciones. Los bots generan eventos propios reproducibles; el equipo suma puntos normalizados sobre el mapa completo (máximo 13 000 por equipo). Tu rendimiento personal usa el total de notas de tu carril. El HUD incluye carriles reducidos de los compañeros y rivales. El resumen de equipos presenta todos sus integrantes.
- Controles clásicos: flechas; avanzado: WASD; personalizable en Ajustes. Izquierda rosa, abajo turquesa, arriba azul, derecha naranja. Las sostenidas conservan el color direccional, con borde dorado.
- Música y vídeo sincronizados al audio. La victoria comienza desde el inicio del tema y permite silenciarlo. En la transición a resultados se presenta una pantalla separada de evaluación. Los cuatro personajes utilizan poses PNG y movimientos interpolados, no un rig esquelético.

## Colección y economía
Cuatro personajes: Ruby, Neko, GuizzMurdock y Meli Meli. Tienda, vestidor y gacha comparten el mismo perfil local. Un ticket vale 40 BC; rarezas 8% legendario, 27% épico, 65% raro. Duplicados reembolsan 15 BC. Los premios se pueden equipar inmediatamente. Las tres variantes legendarias añaden capas gráficas propias (alas, lazo/volantes y capa) a la vestimenta base, además de colores y accesorios. No implican dinero real ni ventajas competitivas. Las máscaras de GuizzMurdock y Meli Meli son aproximaciones por región/color.

## Datos y limitaciones
Perfil, inventario, tickets, monedas y controles se guardan en localStorage, conservando la clave de versiones anteriores. Si se cambia de ruta de archivo u origen, el navegador puede usar otro almacenamiento. Sin backend, la economía es editable localmente y no hay rollback ni anti-cheat online. Los mapas de la Alpha 0.5 se conservan; no se ha reeditado auditivamente la sincronización. Easy 207, Normal 421, Hard 615 movimientos. El vídeo y la canción son recursos proporcionados para pruebas locales; no están cubiertos por MIT y requieren autorización para publicación pública. Se conservan los créditos en el juego.

## Pruebas
`node --check game.js` comprueba sintaxis. Se verificó la asignación de rutas para las tres dificultades y todos los tamaños de equipo: cada nota se asigna exactamente una vez por bando. Las pruebas de navegador de esta build cargaron los archivos dentro de Chromium debido a restricciones de navegación del entorno; incluyeron multimedia real y saltos simulados del reloj musical. No equivalen a jugar una canción entera en hardware físico.


## Alpha 0.11 — Astral Finale
- El escenario de equipos usa un único actor por participante y un HUD transparente. Los carriles individuales siguen siendo fijos.
- Rareza Exótico (2%): Astral Galaxy, un desbloqueo compartido con cuatro acabados específicos de personaje, texturas por pose y halo SVG. Legendario 8%, épico 27%, raro 63%. No hay dinero real.
- Se corrigieron fragmentos desconectados de Meli y Guizz, se centraron sus sprites y se desplazaron las máscaras al mismo tiempo. Las animaciones son poses 2D interpoladas, no un rig esquelético.
- Verificación: Chromium con HTML y recursos incrustados, reloj y multimedia simulados para pruebas rápidas; se comprobaron los cinco tamaños de Versus, práctica Perfect, 15 distribuciones (3 dificultades x 5 tamaños), resultados y tirada exótica. No equivale a una partida completa con audio real. Segunda prueba visual interrumpida por límite de ejecución.
- Sigue siendo local con bots. Conservar una copia del perfil anterior antes de cambiar de carpeta; localStorage con file:// depende del navegador.

## Alpha 0.11 — Astral Finale
- Personajes WizzSv, Keeylongas, GuizzMurdock y Meli Meli.
- Vestidor y selección unificados, inventario completo por defecto.
- Código local de pruebas `rpmods55`: 10 tickets por canje, ilimitado. NO es seguridad de administración. Retirar antes de producción online.
- Gacha x1/x10: diez tiradas independientes, una animación centrada en la recompensa de mayor rareza. Tasas 2/8/27/63%. Dos sets épicos, dos legendarios, uno exótico. Los premios viejos siguen en el inventario.
- Tres poses neutrales deformadas por personaje, animación procedural, no rig esquelético. Máscaras de boina y texturas estampadas por pose.
- Replay por equipos con datos acumulados; no reproduce las pulsaciones originales en tiempo real.
- Pruebas con Chromium y recursos reducidos embebidos, reloj simulado; no equivale a prueba completa con audio físico.
- Inspiración de interfaz: Colorful Stage (https://www.colorfulstage.com/news/detail/000573.html), Just Dance (estrellas y evaluación).

## Hotfix 0.14.1
- START, Comenzar y Cancelar reciben clics y toques; las capas de carga bloquean el menú inferior.
- La precarga inicial tiene un límite de espera de 18 segundos y continúa al menú si hay recursos no disponibles.
- Se mantienen canciones, modos, cosméticos y claves de almacenamiento.

## Alpha 0.17 · Level Studio compatibility
- `levels.js`: catálogo de niveles (datos JSON en asignación JS). `chart-schema.js`: validador compartido por juego/editor.
- El Level Studio se distribuye por separado. Exporta el registro y nuevos recursos en ZIP; se extrae en la raíz del juego. Las canciones aparecen en Práctica y Versus sin tocar código.
- Se corrigieron siete notas fuera de secciones activas en AI♡SCREAM! extendiendo los límites activos sin mover las notas. Ambas rutas originales mantienen sus tiempos y cantidades.
- El HUD comienza antes de la primera nota, incluso con intros cortas. Velocidad de desplazamiento adapta la separación mínima de las notas personalizadas. Historial muestra títulos de niveles nuevos. El catálogo muestra el número real de canciones.
- Las claves internas siguen siendo easy/normal/hard (en el editor Fácil/Difícil/Experto).
- Mantener los cinco archivos del parche en la raíz, junto a assets y .nojekyll. Las rutas son relativas a la carpeta del proyecto. No es necesario alojar el editor en GitHub Pages.

## Alpha 0.20 — Online Lab
- Firebase Authentication con correo/contraseña, nombre visible y UID único. Invitado independiente; perfil sincronizado al iniciar sesión y guardar cambios.
- Salas privadas de 1–5 usuarios contra CPU, reloj común aproximado, asignación de rutas por puesto y resultados de notas remotos. Sin PvP humano, sin rollback ni servidor autoritativo.
- Canje en Ajustes, códigos configurables en Realtime Database y código de invitado separado. MVP por equipo.
- Sigue funcionando sin Firebase configurado. Lee **FIREBASE-SETUP.md** antes de usar el online. Las pruebas de servicio real requieren tu proyecto y reglas desplegadas. No es una economía segura para producción.

## Alpha 0.22
AI♡SCREAM! movida a assets/aiscream/. Level Studio 1.2 guarda chart.json por nivel y genera levels.js. La exportación del usuario se conserva exactamente en notas (205/392/1), con descansos independientes inicialmente iguales. Los scripts históricos de tools no se deben ejecutar sobre el catálogo activo.
