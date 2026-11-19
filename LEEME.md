# Dashboard de avances · Nariz electrónica

Panel web (Flask) del proyecto, en este orden: presentación, motivo, diagrama interactivo de funcionamiento, app de teléfono, dataset y clasificador KNN, carcasa en 3D, avance por sprint, ruta de pruebas y evidencias. Es dinámico (animaciones, simulación de lecturas reales, gráficas interactivas y visor 3D), pero el contenido sigue visible sin JavaScript y se puede imprimir como diapositivas.

## Ejecutar en local (Windows)
Abrir en VS Code la carpeta que contiene `app.py` y ejecutar en la terminal:
```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```
Abrir http://127.0.0.1:5000 y mantener la terminal abierta. En sesiones posteriores basta el tercer comando. Ctrl+C detiene el servidor.

## Despliegue en Render
El servicio usa `gunicorn app:app` como comando de inicio. Cada `git push` a la rama principal vuelve a desplegar el panel.

## Estructura
```
app.py                      servidor Flask (rutas / y /diapositivas); calcula las estadísticas del CSV
datos.py                    TODO el contenido editable
templates/panel.html        estructura de la página
static/estilo.css           colores, tipografía y distribución (variables al inicio)
static/js/panel.js          animaciones, diagrama interactivo, simulación y gráficas del dataset
static/js/carcasa3d.js      visor 3D de la carcasa
static/datos/               Dataset_Muestras.csv (las gráficas se calculan solas a partir de él)
static/modelos/             carcasa_base.stl, carcasa_tapa.stl, carcasa.dwg y carcasa_vista.png (imagen de respaldo)
static/vendor/three/        three.js 0.170 (licencia MIT), incluido localmente: no depende de internet
static/evidencias/          fotografías de evidencias
```

## Editar el contenido
Todo se edita en `datos.py`; después, reiniciar Flask (en Render basta con hacer push).

| Bloque | Qué controla |
|---|---|
| `proyecto` | Título, resumen, tarjetas de presentación, metas y lo que ya tiene el proyecto |
| `motivo` | Historia de origen, por qué el olfato no basta, necesidad y comparación con detectores industriales |
| `diagrama` | Título y explicación de cada bloque del diagrama interactivo |
| `app_movil` | Resumen, tecnologías y pasos de funcionamiento de la app Android |
| `dataset` / `clases` | Protocolo, columnas del CSV y nombre/color de cada clase en las gráficas |
| `carcasa` | Texto, piezas, medidas y archivos descargables del visor 3D |
| `sprints` | Actividades por estado en cada sprint. El **último** sprint del diccionario se muestra por defecto y alimenta el porcentaje de avance |
| `decisiones` | Decisiones durante la construcción |
| `etapas` | Ruta hacia el Laboratorio de Pruebas: título, descripción, situación y dependencias |
| `fotos` | Evidencias: clave, título, descripción y grupo |
| `equipo` | Integrantes, rol y asesor |

**Situación de las etapas y su color:** «Completada» verde (con ✓), «En proceso» azul (se muestra abierta), «Asignada» o «Por agendar» ámbar, «En espera» u otro texto gris.

**Nuevo sprint:** añadir una entrada al final de `sprints` con las listas `Completadas`, `En proceso` y `Pendientes` (en ese orden, que define los colores).

## Dataset
Reemplazar `static/datos/Dataset_Muestras.csv` con una versión nueva (mismas columnas) actualiza solos la exactitud, la matriz de confusión, los promedios, la gráfica de dispersión y la simulación del diagrama. En Render basta con hacer push.

## Carcasa 3D
Para cambiar el modelo, exportar desde AutoCAD a STL (milímetros) y sustituir `carcasa_base.stl` y `carcasa_tapa.stl` en `static/modelos`. Los archivos deben venir centrados; si no, el visor los mostrará desplazados.

## Fotografías
Cada evidencia de `fotos` se busca en `static/evidencias/<clave>.jpg` (también `.jpeg`, `.png` o `.webp`, en minúsculas). Si falta el archivo se muestra «Imagen pendiente». Para agregar una evidencia, copiar el archivo y añadir una línea en `fotos`. Se recomienda JPG de máximo 1400 px por lado para que la página cargue rápido. Al pulsar una imagen se abre ampliada (Esc o «Cerrar» para salir). Las imágenes sin recortar están en `static/evidencias/originales`.

## Uso del panel
- Elegir un sprint en el selector y pulsar un estado para ver sus actividades.
- Pulsar una fila de «Comparación entre sprints» para abrir ese sprint.
- Las etapas de la ruta se despliegan con clic, Enter o Espacio; «Expandir todo» y «Contraer todo» controlan todas a la vez.

## Exportar diapositivas (PDF)
Seleccionar el sprint deseado y usar Imprimir > Guardar como PDF con **gráficos de fondo activados** y sin encabezados ni pies del navegador. El panel se imprime en 10 diapositivas horizontales; las etapas se abren solas y el visor 3D se sustituye por una imagen fija.
