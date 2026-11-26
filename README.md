# RPmodsBeat

Plantilla mínima para un mini juego web estático, sin dependencias ni proceso de compilación.

## Archivos

- `index.html`: página principal.
- `style.css`: estilos y diseño adaptable a móvil.
- `game.js`: punto de entrada para la lógica del juego.

## Publicar en GitHub Pages

1. Sube o incorpora los archivos de tu juego en la raíz del repositorio. Mantén `index.html` como página de entrada y ajusta sus enlaces a CSS y JavaScript si cambias los nombres.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama `main` y la carpeta `/(root)`, y guarda.
5. Cuando termine la publicación, GitHub mostrará la URL de tu sitio en esa misma sección.

No hace falta instalar paquetes ni compilar el proyecto. Si tu juego usa un framework que requiere compilación, habrá que configurar un flujo de publicación distinto.
