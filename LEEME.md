# Dashboard de avances · Nariz electrónica
Extraer el ZIP y abrir en VS Code la carpeta que contiene app.py. En Windows, ejecutar en la terminal:
```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```
Abrir http://127.0.0.1:5000 y mantener la terminal abierta. Para futuras sesiones basta el tercer comando. La instalación inicial requiere internet. El dashboard funciona localmente sin JavaScript. Ctrl+C detiene el servidor.

## Uso y edición
Seleccionar un sprint y pulsar una barra para consultar sus tareas. Seleccionar una franja comparativa para abrir el sprint correspondiente. Las etapas de la ruta hacia pruebas se despliegan al pulsarlas.
Editar las listas de datos.py para actualizar actividades, decisiones o etapas. Reiniciar Flask tras los cambios. Los conteos se calculan por sprint. Los colores y tamaños se editan en static/estilo.css.

## Fotografías
Las evidencias se definen en `fotos` (datos.py): clave, título, descripción y grupo. Cada imagen se busca en static/evidencias con el nombre de su clave (jpg, png, jpeg o webp, en minúsculas). Incluidas: `montaje.png` (circuito real), `carcasa_base.png` y `carcasa_tapa.png` (modelos 3D). Faltan `lecturas`, `buzzer` y `aplicacion`, que muestran «Imagen pendiente» hasta copiar el archivo. Para agregar una evidencia nueva, copiar el archivo y añadir una línea en `fotos`. Al pulsar una imagen se abre ampliada en un visor (Esc o «Cerrar» para salir); sin JavaScript se abre el archivo completo. Las imágenes sin recortar están en static/evidencias/originales.

## Etapas desplegables
Cada etapa de la ruta se despliega con clic, Enter o Espacio. Los botones «Expandir todo» y «Contraer todo» controlan todas a la vez. Se editan en `etapas` (datos.py): título, descripción, situación y dependencias.

## Entrega
Diapositivas.pdf contiene el corte del Sprint III para revisión por el mentor. Para actualizarlo, seleccionar Sprint III y usar Imprimir > Guardar como PDF en formato horizontal con gráficos de fondo y sin encabezados ni pies del navegador. Las etapas se abren solas al imprimir.
