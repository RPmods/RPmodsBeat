# RPmods Beat — Alpha 0.35 Dev 1
**Estado:** desarrollo experimental; no es una versión candidata a publicar en Pages.
**Base estable:** f784ee3f36b896abea3bdf72ea6631e76f98f98c.
**Temporada 0 — Los Inicios:** indefinida, acceso gratuito, 50 niveles iniciales propuestos.

## Cómo probar
Clonar este repositorio y seleccionar alpha-035-dev1. Servir la raíz por HTTP (por ejemplo, `python -m http.server 8000`), abrir `http://localhost:8000/dev/alpha035/`. El laboratorio usa su propia clave de localStorage y no toca Firebase. Los botones de simulación no representan partidas reales. La prueba PixiJS requiere internet (jsDelivr, versión fijada 8.19.0) y un navegador compatible.
Para ejecutar pruebas del dominio: `node dev/alpha035/core.test.mjs`.
La raíz del juego conserva su configuración Firebase existente: no utilizar cuentas o datos de producción para pruebas hasta preparar emuladores o un proyecto Firebase separado.

## Incluido en Dev 1
- Identidad RPmods Beat, Temporada 0, RPmods ID y etiqueta Beat Crystals; se conserva el campo interno tickets y los saldos, identificadores y código de canje existentes.
- Intro de tres marcas con composiciones adaptadas por orientación, posibilidad de omitir y aviso Alpha posterior. Recursos SVG y CSS preliminares.
- Pantallas de inicio de sesión, registro con confirmación, recuperación, envío y comprobación de verificación de correo. No hay bloqueo de cuentas existentes ni migración automática del progreso de invitado todavía.
- Ocultar Cancelar durante preparación online; recuperar salida si falla la descarga.
- Laboratorio: perfiles de interfaz PC/Mobile, gacha por banners con pity, misiones diarias/semanales/temporada/principiante, recompensas, MMR para equipos de solos, alineaciones 1v1–5v5 simuladas, demo gráfica PixiJS con 96 notas.
- Pruebas de lógica: 27 aserciones, incluyendo 120 tiradas, 10 tiradas, persistencia de garantía por grupo, reclamo único, periodos UTC y alineaciones.
 
## Pendiente, obligatorio antes de producción
1. Capturar referencia visual y métricas reales de Alpha 0.34.3 (mismo mapa, misma máquina, 1v1–5v5); ejecutar pruebas en navegadores móviles y PC.
2. Migrar notas y mallas de personajes al renderizador compartido PixiJS/WebGL, preservar reloj musical, precisión, movimientos, cosméticos y reglas. Implementar fallback y calidad adaptativa; no prometer FPS.
3. Separar interfaces completas desktop/mobile, no solo laboratorio; probar todas las pantallas, orientación, safe areas, dimensiones de 360x640 a 4K, accesibilidad y teclado.
4. Crear paquete gráfico final PNG/SVG/WebP original (logos, moneda, banners, emblemas, notas, atlas, fondos), animaciones/sonidos de estudio, lobby y gacha. No sustituir personajes existentes sin comparación.
5. Backend autoritativo: Firebase Authentication + RTDB; evaluar Cloud Functions y facturación. Validación de resultados, monedas, inventario, pity, tiradas, recompensas, registro (500 BC+5 BCR), verificación (1000 BC+10 BCR), transferencia invitado idempotente, historial y reglas. No confiar en los cálculos del cliente. Configurar plantillas de correo en Firebase; no publicar credenciales.
6. Integrar misiones y niveles, bonus diarios/semanales, recompensas gratuitas de Temporada 0 sin caducidad, misiones de eventos, logros y notificaciones. Definir XP y economía tras simulación; validar todos los 50 niveles (en laboratorio solo hitos propuestos). Usar tiempo de servidor y reclamación transaccional.
7. Gacha por banners real: 2% base, soft pity a 45 (+4 puntos porcentuales propuestos), hard pity 60 y 50/50 con destacado como máximo 120; épico o superior cada 10; pity compartido solo entre banners compatibles, permanente independiente. Echo Shards por duplicados. Balancear y hacer públicas las probabilidades; implementar cinemática y saltar.
8. Matchmaking autoritativo entre dos equipos reales, grupos premade intactos, rangos y MMR, salas de hasta diez, reconexiones y sincronización. Participantes simulados solo en casual identificado como mixto. Ranked real sin bots. Cancelar solo búsqueda, recuperación por error.
9. Motor de eventos y formato de niveles versionado: notas, relevos, animaciones, diálogos, cámaras, mecánicas y condiciones; preservar editor y CO-OP 01. RPB Studio y 2.5D en versiones siguientes.
10. Pruebas de regresión de audio, vídeo Lite/HD, gacha, canjes, cuentas, datos, sincronización PC/Android, cargas y resultados. Comparar con la versión estable. Mantener rollback y no fusionar hasta superar criterios.

## Limitaciones
Pruebas estáticas y de lógica no prueban el navegador, GPU, red ni entregas de correo. El laboratorio no es un juego completo; sus datos, recompensas, resultados y participantes son simulados. No se ha cambiado Firebase, ni las reglas ni sus plantillas. No se han medido FPS reales. El plan es incremental; no se activa economía ni MMR experimental en producción.
