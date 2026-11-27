# Cherry Beat Alpha 0.15 — Motion Lab (experimental)

Basada en Alpha 0.14.1. Conserva los IDs y claves de guardado del perfil, canciones, rutas, tienda, inventario y gacha. No cambia el cálculo de notas/puntuación.

## Motor modular
- `motion.js`: cuatro geometrías de articulación, una textura del aspecto equipado para el cuerpo, variantes de cabeza para expresiones y orientación, efectos y accesorios separados. Renderizado Canvas 2D con tamaño adaptado al dispositivo (320–720 px); el arte original de 480 px se interpola, no se sustituye por un dibujo nuevo.
- 26 clips: cuatro direcciones, entrada/salida, victoria/derrota, fallo/Perfect propio, dos miradas, cinco reacciones a cada tipo de evento de compañero, cuatro idles.
- Transición de ~95 ms desde la posición actual; no escala anisotrópica en los movimientos. Las articulaciones se rotan con recortes de la textura, no son un rig de malla profesional. Las expresiones reutilizan cabezas de poses anteriores y sus máscaras existentes; las futuras prendas necesitarán ajuste inicial a cada cuerpo y expresión que las afecte.
- En relevo, observa al compañero activo más cercano; reacciona a un Perfect o fallo reciente. El descanso global usa idles independientes. El fallo propio se mantiene hasta una pulsación/fin de la sección activa.
- Los conjuntos y auras se conservan; el aura exótica gira como capa independiente. El cuerpo se compone con los cosméticos de la pose neutral.

## Prueba
Abre `motion-lab.html` dentro del proyecto para cambiar animación y set de los cuatro personajes. En GitHub Pages puede abrirse añadiendo `/motion-lab.html` a la URL del proyecto.

Pruebas automatizadas: sintaxis JS; 104 combinaciones de clip/personaje en Chromium con recursos incrustados; práctica y 1v1–5v5 con reloj musical simulado; entrada al resultado. No se comprobó un despliegue HTTPS real ni partidas completas con multimedia; la navegación directa del navegador de pruebas fue bloqueada. Pueden quedar uniones visibles en mangas, cabello o falda por el origen de los dibujos. Esta es una migración experimental y no una aprobación artística final.

## Publicación
Conserva una copia de Alpha 0.14.1. Si ya tienes esa versión publicada, basta reemplazar index.html, game.js, style.css y añadir motion.js, motion-lab.html y esta documentación. Todas las rutas son relativas; no se requiere backend. No se incluye una licencia de los vídeos musicales comerciales.
