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
