# Alpha 0.36 — Character Rebuild

Esta rama reemplaza la propuesta de animaciones de 0.35 (PR #12) y conserva las mejoras independientes de carriles verticales. No es necesario integrar #12.

## Probar antes de publicar
Descarga el ZIP de esta rama, extráelo y abre `character-lab.html` manteniendo los archivos en sus carpetas. El laboratorio no requiere Firebase. Permite escoger los cinco personajes, combinar ropa, cabello, ojos y accesorios, reproducir 33 acciones y revisar poses con el control temporal.

Las láminas `assets/characters36/preview.svg` y `assets/characters36/zomby-poses.svg` se generan desde el mismo código de arte y poses utilizado por el juego.

## Arquitectura
- Arte SVG frontal nuevo, no deformación de los PNG originales. El estilo vectorial es distinto del acabado anime rasterizado anterior.
- Piezas dibujadas separadamente y pivotes de cabeza, extremidades y accesorios. Cinemática inversa de dos segmentos en piernas y control de apoyo. Interpolación de poses clave, expresiones discretas, sin deformación global del sprite.
- Materiales de ropa, cabello y ojos independientes; sin máscaras de recolor sobre PNG. Accesorios como elementos propios. Se conservan las claves de inventario existentes.
- Motor de animación DOM SVG reutilizable, actualiza transformaciones y expresiones sin reconstruir todo el sprite cada fotograma. Frecuencia objetivo de 20 fps móvil / 30 escritorio (no es medición de rendimiento real).
- Los PNG antiguos permanecen disponibles para reversión y recursos estáticos.

## Pruebas
`node tests/characters36.mock.js`: 220 variantes individuales, 13 530 muestras de poses y 900 actualizaciones sobre DOM simulado. Se probaron también 1 800 combinaciones mixtas de cosméticos. Pasaron las pruebas de escritorio, Team, escenario y móvil. Se renderizó una versión intermedia de las poses de Zombyexx para inspección visual. No se completó una prueba de partida real, ni medición de FPS, ni validación visual exhaustiva en navegador de la versión final.

## Decisión de publicación
Dejar en revisión visual: el estilo nuevo necesita aprobación. No se modifica Firebase, reglas, mapas, puntuación ni lógica de red.

## Referencias técnicas
Unity: https://docs.unity3d.com/Manual/2d-game-creation-wokflow.html
Godot: https://docs.godotengine.org/en/stable/tutorials/2d/2d_sprite_animation.html
Spine: https://esotericsoftware.com/spine-skins
