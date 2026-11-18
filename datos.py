"""Estados documentados al cierre de cada sprint. Editar las listas para actualizar los gráficos."""
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
        "Pendientes": ["Recolección de muestras", "Entrenamiento y exportación del modelo KNN", "Validación del clasificador", "Prueba de respuesta y diferenciación", "Prueba de operación continua y documentación"],
    },
    "III": {
        "Completadas": ["Adquisición de componentes", "Prueba individual del buzzer"],
        "En proceso": ["Montaje en protoboard", "Pruebas individuales de sensores MQ", "Desarrollo del firmware", "Diseño de la carcasa"],
        "Pendientes": ["Recolección de muestras", "Entrenamiento y exportación del modelo KNN", "Validación del clasificador", "Prueba de respuesta y diferenciación", "Prueba de operación continua y documentación"],
    },
    "Estado Actual": {
        "Completadas": ["Adquisición de componentes", "Prueba individual del buzzer","Montaje en protoboard", "Diseño de la carcasa", "Recolección de muestras", ],
        "En proceso": ["Pruebas individuales de sensores MQ", "Desarrollo del firmware", "Entrenamiento y exportación del modelo KNN",],
        "Pendientes": ["Validación del clasificador", "Prueba de respuesta y diferenciación", "Prueba de operación continua y documentación"],
    },
}

decisiones = [
    ("Montaje y soldadura", "Tras verficar el las conexiones en la protoboard, se decidió soldar los componentes."),
    ("Pruebas individuales", "Se registraron variaciones en las lecturas de los sensores y se comprobó el funcionamiento del buzzer por separado. La identificación de sustancias requiere validación experimental."),
    ("Diseño de la carcasa", "El diseño fue completado y se realizó la impresión 3D en el Laboratorio de Inventores."),
]
# COLORES DE LAS ETIQUETAS DE PROGRESO
# La situación es el tercer valor de cada etapa.
# "Completada"  -> verde.
# "En proceso"  -> azul.
# "Asignada"    -> naranja.
# "Por agendar" -> naranja.
# "En espera"   -> gris.
# Otros textos -> gris.
# El HTML selecciona el estilo según la situación y estilo.css define los colores.
# Cambiar la situación aquí actualiza el texto y su color al reiniciar Flask.
# Cada etapa: (título, descripción, situación, depende de)
etapas = [
    ("Verificar el montaje", "El montaje en la protoboard fue compleado con éxito.", "Completada", "Sin dependencias"),
    ("Acordar las condiciones de muestreo", "Pendiente añadir detalles", "Completada", "Sin dependencias"),
    ("Recolectar las muestras", "Pendiente añadir detalles", "Completada", "Verificar el montaje · Acordar las condiciones de muestreo"),
    ("Entrenar el clasificador", "El entrenamiento en Python y la exportación al ESP32 requieren un conjunto de muestras etiquetadas.", "En proceso", "Recolectar las muestras"),
    ("Validar el sistema", "Con el clasificador integrado se evaluarán la exactitud (meta ≥ 85 %), el tiempo de respuesta (meta < 2 s) y la disponibilidad durante cuatro horas.", "En espera", "Entrenar el clasificador"),
]

# Evidencias: clave -> (título, descripción, grupo). El archivo se busca en static/evidencias/<clave>.<jpg|png|jpeg|webp>
fotos = {
    "montaje": ("Circuito montado", "ESP32 con dos sensores MQ, un módulo I2C, el buzzer y dos resistencias sobre la placa de pruebas.", "Circuito real"),
    "lecturas": ("Lecturas de sensores", "Captura de las lecturas individuales de los sensores.", "Circuito real"),
    "buzzer": ("Prueba del buzzer", "Verificación del buzzer por separado.", "Circuito real"),
    "aplicacion": ("Aplicación móvil", "Interfaz móvil del proyecto.", "Circuito real"),
    "carcasa_base": ("Carcasa · base", "Caja con cuatro postes de fijación en las esquinas, aberturas rectangulares en las paredes laterales y soportes internos para la placa.", "Modelo 3D de la carcasa"),
    "carcasa_tapa": ("Carcasa · tapa", "Tapa con dos grupos de ranuras de ventilación, cuatro orificios para tornillos y guías de ajuste sobre la base.", "Modelo 3D de la carcasa"),
}
