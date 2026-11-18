from pathlib import Path
from flask import Flask, render_template, request
from datos import sprints, decisiones, etapas, fotos

app = Flask(__name__)

@app.get("/")
@app.get("/diapositivas")
def tablero():
    sprint = request.args.get("sprint", "III")
    if sprint not in sprints:
        sprint = "III"
    estados = sprints[sprint]
    estado = request.args.get("estado")
    if estado not in estados:
        estado = next(iter(estados))
    escala = max(1, max(len(tareas) for grupo in sprints.values() for tareas in grupo.values()))
    imagenes = {}
    for clave in fotos:
        for extension in ("jpg", "png", "jpeg", "webp"):
            archivo = f"evidencias/{clave}.{extension}"
            if (Path(app.static_folder) / archivo).is_file():
                imagenes[clave] = archivo
                break
    grupos = {}
    for clave, (titulo, descripcion, grupo) in fotos.items():
        grupos.setdefault(grupo, []).append({"titulo": titulo, "descripcion": descripcion,
                                             "ruta": imagenes.get(clave, "")})
    return render_template("panel.html", sprint=sprint, estado=estado, estados=estados,
                           sprints=sprints, escala=escala, decisiones=decisiones, etapas=etapas,
                           grupos=grupos, total=sum(map(len, estados.values())))

if __name__ == "__main__":
    app.run()
