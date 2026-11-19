"""Contenido del panel. Editar este archivo para actualizar textos y gráficos; reiniciar Flask después.

Orden de la página:
  proyecto   -> portada, presentación, metas e indicadores
  motivo     -> origen del proyecto, necesidad y comparación con detectores industriales
  diagrama   -> nodos del diagrama interactivo (los textos de cada bloque)
  app        -> aplicación de teléfono: tecnologías, pantallas y funcionamiento
  dataset    -> descripción del conjunto de muestras (los números se calculan del CSV)
  carcasa    -> visor 3D de la carcasa
  sprints    -> actividades por estado al cierre de cada sprint (el último se muestra por defecto)
  decisiones -> decisiones tomadas durante la construcción
  etapas     -> ruta hacia el Laboratorio de Pruebas
  fotos      -> evidencias (imágenes en static/evidencias)
  equipo     -> integrantes y asesor
"""

# ── PROYECTO ────────────────────────────────────────────────────────────────
proyecto = {
    "titulo": "Nariz electrónica de bajo costo",
    "resumen": "Detección y clasificación de compuestos volátiles en ambientes escolares y domésticos "
               "mediante sensores MQ, un ESP32 y un clasificador KNN.",
    "bloques": [
        ("¿En qué consiste?",
         "Una nariz electrónica de bajo costo que integra los sensores MQ-135, MQ-3 y BME680 con un ESP32. "
         "Un clasificador KNN interpreta las lecturas, reconoce patrones asociados a compuestos volátiles "
         "y genera alertas visuales y auditivas."),
        ("Justificación",
         "El costo y la complejidad de los equipos especializados dificultan el monitoreo químico en espacios "
         "educativos y pequeños laboratorios. La propuesta ofrece una alternativa accesible que facilita "
         "identificar cambios en el ambiente y apoya acciones preventivas."),
        ("Objetivo",
         "Diseñar y validar un prototipo capaz de detectar y clasificar compuestos volátiles mediante sensores "
         "de bajo costo y aprendizaje automático, evaluando su desempeño en condiciones controladas."),
    ],
    # Metas de validación: (valor, descripción)
    "metas": [
        ("≥ 3", "sustancias clasificadas"),
        ("≥ 85 %", "de exactitud del clasificador"),
        ("< 2 s", "desde la adquisición hasta el resultado"),
        ("4 h", "de operación continua"),
    ],
    # Lo que ya existe del proyecto (se muestra en la portada)
    "logros": ["Prototipo físico", "Dataset", "Clasificador KNN · versión inicial", "Carcasa 3D", "App Android", "Aplicación web"],
}

# ── MOTIVO ──────────────────────────────────────────────────────────────────
motivo = {
    "historia": [
        "En escuelas y pequeños laboratorios de la Zona Metropolitana de Guadalajara se utilizan solventes, reactivos y productos de limpieza que pueden liberar compuestos volátiles. El costo y la complejidad de los equipos especializados pueden dificultar el acceso a herramientas de monitoreo en estos espacios.",
        "El proyecto propone desarrollar una nariz electrónica de bajo costo que permita estudiar y clasificar patrones de respuesta ante distintas sustancias, con información comprensible y alertas para el usuario.",
    ],
    "frase": "El alcance actual se centra en la clasificación de patrones bajo condiciones controladas.",
    # Por qué el olfato no basta: (dato, explicación)
    "olfato": [
        ("≈ 5 ppm", "Umbral olfativo aproximado reportado para el amoníaco."),
        ("Fatiga olfativa", "Con la exposición prolongada la nariz se adapta y deja de percibir el olor, "
                            "aunque el gas siga ahí."),
        ("300 ppm", "Nivel que NIOSH considera inmediatamente peligroso para la vida o la salud (IDLH)."),
    ],
    "necesidad": [
        ("Monitoreo accesible", "Explorar el uso de sensores de bajo costo en espacios educativos y pequeños laboratorios."),
        ("Clasificación de patrones", "Distinguir las respuestas de los sensores ante amoníaco, acetona, etanol, vinagre y aire limpio, dentro de las condiciones evaluadas."),
        ("Información comprensible", "Presentar las lecturas y los resultados mediante indicadores locales y una aplicación móvil."),
        ("Aprendizaje y validación", "Documentar el muestreo, el entrenamiento del clasificador y las pruebas del prototipo para evaluar sus alcances y limitaciones."),
    ],
    # Comparación con detectores industriales: (aspecto, industrial, nuestra nariz)
    "comparacion": [
        ("Ámbito de aplicación", "Monitoreo de gases en instalaciones industriales, según las especificaciones del equipo", "Investigación y aprendizaje en entornos educativos y domésticos"),
        ("Información proporcionada", "Detección de gases y, según el modelo, medición de concentraciones y umbrales de alarma", "Clasificación de patrones de respuesta entre cinco clases del dataset"),
        ("Costo y mantenimiento", "Dependen de los sensores, certificaciones y requisitos de calibración", "Diseño con componentes comerciales de bajo costo; requiere calibración y validación"),
        ("Notificación", "Alarmas locales e integración con otros sistemas, según el modelo", "Buzzer, LED y aplicación Android mediante Bluetooth"),
        ("Finalidad", "Seguridad y monitoreo conforme a las capacidades y certificaciones de cada equipo", "Prototipo académico orientado a la experimentación y documentación del proceso"),
    ],
    "pensar_humano": (
        "La propuesta se centra en desarrollar y evaluar una alternativa de bajo costo para estudiar la clasificación de compuestos volátiles. La comparación considera el propósito, la información proporcionada y los requisitos de operación de cada solución; las prestaciones de los detectores industriales varían según el modelo."
    ),
    "aclaracion": "Es un prototipo académico: complementa, pero no sustituye, a los detectores certificados.",
    "fuentes": [
        ("ATSDR (CDC) · Medical Management Guidelines for Ammonia",
         "https://webarchive.library.unt.edu/web/20130218022355/http://www.atsdr.cdc.gov/MHMI/mmg126.pdf"),
        ("NIOSH · Pocket Guide: Ammonia",
         "https://webarchive.library.unt.edu/web/20121007083523/http://www.cdc.gov/niosh/npg/npgd0028.html"),
    ],
}

# ── DIAGRAMA ────────────────────────────────────────────────────────────────
# Textos que aparecen al pulsar cada bloque del diagrama interactivo: clave -> (título, descripción, etapa)
diagrama = {
    "bme680": ("BME680", "Registra temperatura y humedad y comunica los datos digitalmente al ESP32 mediante I²C, sin pasar por su ADC. Estas variables no forman parte de las entradas del clasificador actual.", "sensado"),
    "mq3": ("MQ-3", "Sensor sensible a alcoholes, como el etanol.", "sensado"),
    "mq135": ("MQ-135", "Sensor de calidad del aire sensible a amoníaco y alcoholes.", "sensado"),
    "acond": ("Acondicionamiento de señal", "Divisores y resistencias que adaptan la señal analógica para el ESP32.", "proceso"),
    "adc": ("ADC del ESP32", "Convierte las señales analógicas acondicionadas de los sensores MQ-135 y MQ-3 en valores digitales de 12 bits, entre 0 y 4095.", "proceso"),
    "fuente": ("Fuente de alimentación", "Energiza el ESP32, el calentador de los sensores MQ y las alertas.", "proceso"),
    "esp32": ("ESP32 · microcontrolador", "Lee los sensores, ejecuta el clasificador y controla las alertas y el Bluetooth.", "proceso"),
    "calib": ("Sistema de calibración", "Registra la línea base en aire limpio para calcular la respuesta relativa.", "proceso"),
    "proc": ("Procesamiento y normalización", "Calcula la respuesta relativa Rs/R0 de cada sensor MQ: resistencia estable dividida entre resistencia base en aire limpio. Las dos razones se estandarizan antes de la clasificación.", "proceso"),
    "entren": ("Entrenamiento", "Dataset de compuestos y curvas de respuesta: 360 muestras etiquetadas para entrenar.", "ia"),
    "knn": ("Algoritmo KNN (K-Nearest Neighbors)", "Compara cada lectura con las muestras de referencia y asigna la clase mayoritaria entre sus cinco vecinos más cercanos.", "ia"),
    "decision": ("¿Compuesto detectado?", "Si la clase es distinta de «aire limpio» se activan las alertas.", "decision"),
    "monitoreo": ("Monitoreo continuo", "Si la lectura se clasifica como aire limpio, el sistema continúa el monitoreo.", "decision"),
    "alertas": ("Módulo de alertas", "Coordina las salidas cuando se detecta un compuesto.", "alerta"),
    "ble": ("Interfaz inalámbrica", "Propuesta inicial: Wi-Fi. Implementado: Bluetooth Low Energy hacia la app Android.", "salida"),
    "buzzer": ("Buzzer auditivo", "Alarma sonora para quien está en el lugar.", "salida"),
    "led": ("LED visual", "Indicador luminoso de alerta.", "salida"),
    "registro": ("Registro de eventos", "Historial de lecturas y alertas consultable en la app.", "salida"),
}

# ── APLICACIÓN DE TELÉFONO ──────────────────────────────────────────────────
app_movil = {
    "resumen": "App nativa para Android que se conecta al prototipo por Bluetooth Low Energy y muestra en el "
               "teléfono el estado del aire, el detalle de las lecturas y el historial.",
    "tecnologias": [
        ("Android Studio", "Entorno con el que se desarrolló la app nativa para Android."),
        ("Bluetooth Low Energy", "Canal inalámbrico entre el ESP32 y el teléfono, sin depender de internet."),
        ("ESP32", "Lee los sensores, clasifica con el KNN y envía el resultado por BLE."),
        ("Material Design", "Interfaz oscura con barra de navegación inferior: Panel, Historial y Conexión."),
    ],
    # Pasos de funcionamiento: (título, descripción, zona resaltada en la captura)
    "pasos": [
        ("Conectar", "En «Conexión» el teléfono se vincula con la nariz electrónica por Bluetooth.", "nav"),
        ("Medir en vivo", "Con ▶ la app empieza a recibir las lecturas en tiempo real.", "play"),
        ("Ver el estado", "El indicador superior muestra el resultado de la clasificación: «Óptimo» o la alerta del compuesto detectado.", "estado"),
        ("Revisar el detalle", "Las pestañas Inicio, Detalle y ¿Qué es esto? explican la lectura y el proyecto.", "tabs"),
        ("Consultar el historial", "Con ↻ se carga el historial de lecturas guardadas.", "refresh"),
    ],
}

# ── DATASET ─────────────────────────────────────────────────────────────────
# Los números (exactitud, matriz de confusión, promedios) se calculan solos desde static/datos/Dataset_Muestras.csv.
dataset = {
    "archivo": "Dataset_Muestras.csv",
    "protocolo": [
        ("Cámara cerrada", "Mismo recipiente y mismo protocolo en las diez sesiones."),
        ("30 s de exposición", "El compuesto se acerca a los sensores hasta que la lectura se estabiliza."),
        ("45 s de purga", "Aire limpio entre muestras para regresar a la línea base."),
        ("80 / 20", "360 muestras para entrenar el KNN y 90 reservadas para probarlo."),
    ],
    "columnas": [
        ("muestra_id · sesion · timestamp", "Identificador, sesión (1 a 10) y hora de cada muestra."),
        ("etiqueta · nombre", "Clase real y la sustancia usada."),
        ("mq135_base · mq3_base", "Resistencia del sensor en aire limpio antes de la exposición (R0), en kΩ."),
        ("mq135_estable · mq3_estable", "Resistencia estabilizada durante la exposición (Rs), en kΩ."),
        ("mq135_respuesta · mq3_respuesta", "Razón Rs/R0, sin unidades. Un valor cercano a 1 indica poca variación respecto a la lectura de referencia en aire limpio."),
        ("mq135_adc_max · mq3_adc_max", "Lectura máxima del ADC de 12 bits del ESP32."),
        ("t90_s", "Segundos hasta alcanzar el 90 % de la respuesta (vacío en aire limpio)."),
        ("particion · prediccion · confianza", "Entrenamiento o prueba, clase que predijo el KNN y proporción de vecinos que la votaron."),
    ],
}

# Nombre y color de cada clase en las gráficas
clases = {
    "amoniaco": ("Amoníaco", "#d1495b"),
    "acetona": ("Acetona", "#edae49"),
    "etanol": ("Etanol", "#3a86c8"),
    "vinagre": ("Vinagre", "#8e6cc4"),
    "aire_limpio": ("Aire limpio", "#2a9d8f"),
}

# ── CARCASA ─────────────────────────────────────────────────────────────────
carcasa = {
    "descripcion": "Nueva versión de la carcasa, diseñada en AutoCAD e impresa en 3D. Arrastra para girarla, "
                   "usa la rueda para acercar y separa las piezas para ver el interior.",
    "piezas": [
        ("Base", "195 × 85 × 85 mm", "Postes de fijación, aberturas laterales y soportes internos para la placa."),
        ("Tapa", "195 × 85 × 10 mm", "Ranuras de ventilación para que el aire llegue a los sensores y guías de ajuste."),
    ],
    "descargas": [
        ("Base · STL", "modelos/carcasa_base.stl"),
        ("Tapa · STL", "modelos/carcasa_tapa.stl"),
        ("Plano · DWG", "modelos/carcasa.dwg"),
    ],
}

# ── SPRINTS ─────────────────────────────────────────────────────────────────
# Estados documentados al cierre de cada sprint. El orden de los estados define los colores:
# 1.º verde (Completadas), 2.º ámbar (En proceso), 3.º gris (Pendientes). El Sprint I usa índigo.
sprints = {
    "I": {
        "Planificadas": [
            "Adquisición de componentes",
            "Ensamble en protoboard y verificación de conexiones",
            "Recolección del conjunto de muestras de entrenamiento",
            "Entrenamiento, ajuste y exportación del clasificador KNN",
            "Desarrollo del firmware del ESP32",
            "Validación del clasificador",
            "Medición del tiempo de respuesta y diferenciación de compuestos",
            "Prueba de operación continua y documentación final",
        ],
    },
    "II": {
        "Completadas": ["Adquisición de componentes"],
        "En proceso": ["Montaje en protoboard", "Desarrollo del firmware"],
        "Pendientes": ["Recolección de muestras", "Entrenamiento y exportación del modelo KNN",
                       "Validación del clasificador", "Prueba de respuesta y diferenciación",
                       "Prueba de operación continua y documentación"],
    },
    "III": {
        "Completadas": ["Adquisición de componentes", "Prueba individual del buzzer"],
        "En proceso": ["Montaje en protoboard", "Pruebas individuales de sensores MQ",
                       "Desarrollo del firmware", "Diseño de la carcasa"],
        "Pendientes": ["Recolección de muestras", "Entrenamiento y exportación del modelo KNN",
                       "Validación del clasificador", "Prueba de respuesta y diferenciación",
                       "Prueba de operación continua y documentación"],
    },
    "Estado actual": {
        "Completadas": ["Adquisición de componentes", "Prueba individual del buzzer", "Montaje en protoboard",
                        "Diseño de la carcasa", "Recolección de muestras", "Pruebas individuales de sensores MQ",
                        "Desarrollo del firmware",
                        "Validación del clasificador", "Aplicación Android y aplicación web"],
        "En proceso": ["Entrenamiento y exportación del modelo KNN", "Prueba de respuesta y diferenciación"],
        "Pendientes": ["Prueba de operación continua y documentación"],
    },
}

# ── DECISIONES ──────────────────────────────────────────────────────────────
decisiones = [
    ("Montaje y soldadura",
     "Tras verificar las conexiones en la protoboard, se decidió soldar los componentes."),
    ("Pruebas individuales",
     "Se registraron variaciones en las lecturas de los sensores y se comprobó el funcionamiento del buzzer "
     "por separado. La identificación de sustancias requiere validación experimental."),
    ("Diseño de la carcasa",
     "Se completó el diseño y se imprimió en 3D en el Laboratorio de Inventores. Después se rediseñó una nueva "
     "versión con base de 195 × 85 × 85 mm y tapa ventilada."),
    ("Bluetooth en lugar de Wi-Fi",
     "La propuesta contemplaba Wi-Fi; la app se conecta por Bluetooth Low Energy, que no necesita red ni internet."),
]

# ── ETAPAS ──────────────────────────────────────────────────────────────────
# Cada etapa: (título, descripción, situación, depende de)
# Situación y color: "Completada" verde · "En proceso" azul · "Asignada"/"Por agendar" ámbar ·
# "En espera" u otro texto gris.
etapas = [
    ("Verificar el montaje",
     "El montaje en la protoboard se completó con éxito.",
     "Completada", "Sin dependencias"),
    ("Acordar las condiciones de muestreo",
     "Un alumno de Ingeniería Química preparó las sustancias y realizó las mediciones con el prototipo "
     "(sensores MQ-135 y MQ-3 conectados al ESP32). Se usó una cámara cerrada con ciclos de 30 s de exposición "
     "y 45 s de purga con aire limpio, con el mismo protocolo en las diez sesiones.",
     "Completada", "Sin dependencias"),
    ("Recolectar las muestras",
     "Se recibió el archivo Dataset_Muestras.csv con 450 muestras obtenidas en diez sesiones, del 5 al 15 de "
     "octubre de 2026. Incluye cinco clases con 90 muestras cada una: amoníaco, acetona, etanol, vinagre y aire "
     "limpio. Cada registro contiene las lecturas de ambos sensores y su etiqueta de referencia.",
     "Completada", "Verificar el montaje · Acordar las condiciones de muestreo"),
    ("Entrenar el clasificador",
     "Se realizó un entrenamiento inicial del clasificador KNN en Python con 360 muestras y su exportación al ESP32. "
     "El modelo continúa en evaluación y aún no se ha definido si esta versión será la definitiva. "
     "La versión evaluada acertó 82 de las 90 muestras de prueba (91.1 %).",
     "En proceso", "Recolectar las muestras"),
    ("Validar el sistema",
     "La versión evaluada del clasificador alcanzó una exactitud del 91.1 % en las 90 muestras de prueba, "
     "superando la meta del 85 %. Permanecen pendientes la medición del tiempo de respuesta del sistema integrado "
     "(meta < 2 s) y la prueba de operación continua durante cuatro horas. "
     "Cuatro de las 18 muestras de amoníaco se clasificaron como vinagre; en sentido inverso, "
     "una de las 18 muestras de vinagre se clasificó como amoníaco. "
     "Las pruebas iniciales corresponden al modelo disponible y deberán revisarse si se modifica el entrenamiento.",
     "En proceso", "Entrenar el clasificador"),
]

# ── EVIDENCIAS ──────────────────────────────────────────────────────────────
# clave -> (título, descripción, grupo). El archivo se busca en static/evidencias/<clave>.<jpg|jpeg|png|webp>.
fotos = {
    "montaje": ("Circuito montado",
                "ESP32 con dos sensores MQ, un módulo I2C, el buzzer y dos resistencias soldados sobre la placa.",
                "Circuito y pruebas"),
    "lecturas": ("Prueba de detección de alcoholes",
                 "Muestra impregnada frente al sensor y lecturas del MQ-135 y el MQ-3 en el monitor serie.",
                 "Circuito y pruebas"),
    "buzzer": ("Prueba del buzzer",
               "Buzzer y LED de alerta conectados al ESP32 en la protoboard, verificados por separado.",
               "Circuito y pruebas"),
    "aplicacion": ("Aplicación móvil",
                   "Pantalla de inicio con las secciones Panel, Historial y Conexión, antes de vincular el "
                   "dispositivo por Bluetooth.",
                   "Aplicación"),
    "carcasa_base": ("Carcasa · base",
                     "Caja con cuatro postes de fijación en las esquinas, aberturas rectangulares en las paredes "
                     "laterales y soportes internos para la placa.",
                     "Carcasa · modelo 3D"),
    "carcasa_tapa": ("Carcasa · tapa",
                     "Tapa con dos grupos de ranuras de ventilación, cuatro orificios para tornillos y guías de "
                     "ajuste sobre la base.",
                     "Carcasa · modelo 3D"),
}

# ── EQUIPO ──────────────────────────────────────────────────────────────────
equipo = {
    "integrantes": [
        ("Saavedra Ramírez Vanessa Guadalupe", "Líder del grupo"),
        ("Cerpa Rodríguez Perla Esmeralda", ""),
        ("Macías Cuevas Osvaldo", ""),
        ("Murillo Villegas Marcos Leonel", ""),
    ],
    "asesor": "Gutiérrez Cobian Zeus Emanuel",
}
