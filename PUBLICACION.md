# Cherry Beat 0.14 — Encore Release

## Publicación estática (GitHub Pages)
1. Extrae este ZIP. Copia su contenido (index.html, .nojekyll, assets, game.js y style.css) a la raíz del repositorio. No subas el ZIP como archivo del sitio.
2. Usa GitHub Desktop o `git add .`, `git commit -m "Cherry Beat 0.14"`, `git push` en el repositorio ya configurado. Los MP4 exceden 25 MiB, límite de carga de archivos individuales por la interfaz web. Están por debajo de 100 MiB, límite de Git normal.
3. En Settings > Pages > Build and deployment, selecciona Deploy from a branch > main > / (root). Activa Enforce HTTPS si está disponible. No requiere Node, servidor backend ni un build.
4. Abre la URL de Pages. Pulsa START, selecciona canción y modo y deja terminar la descarga de la canción. Pulsa Comenzar. La segunda pulsación permite iniciar audio bajo las restricciones de autoplay móvil.
5. El perfil, tickets, cosméticos y récords se guardan en localStorage por origen. Los datos de file:// no pasan automáticamente a HTTPS. El código rpmods55 es deliberadamente repetible y no es un control de seguridad.

## Uso local
Abre index.html o usa SERVIDOR-LOCAL.bat. Para probar el mismo flujo que Pages, inicia un servidor HTTP local en la raíz, por ejemplo `python -m http.server 8000`. En file:// no se usa fetch de archivos: se asignan directamente al reproductor. En HTTP(S) se descargan y conservan en memoria los recursos de la canción elegida (se liberan al cambiar de canción). Esto reduce cortes de red, pero no garantiza ausencia de lag en dispositivos con memoria limitada. Desactiva vídeo si es necesario.

## Música y mapas
- AI♡SCREAM！ — AiScReam, ruta vocal anterior intacta (207/421/615).
- Because It Was You (君だったから) — Nakano-ke no Itsutsugo, 4:35 aprox. (215/379/577). Mapa generado a partir de ataques y actividad armónica central de la mezcla completa; no es una separación vocal por IA ni una transcripción manual. Editar assets/nakano/chart.json y regenerar chart.js o editar ambas representaciones coherentemente. El script tools/nakano_chart.py reproduce el análisis.
- En Versus los dos equipos reciben la misma ruta repartida por grupos de frases, de 1 a 5 integrantes. Los demás participantes son bots locales.

## Licencia y publicación
La licencia MIT cubre el código propio, no los vídeos, canciones ni recursos de terceros. Antes de publicar en un sitio accesible públicamente, obtén autorización para distribuir la música y vídeos o sustitúyelos por recursos autorizados. Los créditos no sustituyen la licencia.

Referencias: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site ; https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https ; https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github ; https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events ; https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
