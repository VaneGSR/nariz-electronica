import csv
from functools import lru_cache
from pathlib import Path

from flask import Flask, render_template, request

from datos import (app_movil, carcasa, clases, dataset, decisiones, diagrama, equipo, etapas, fotos,
                   motivo, proyecto, sprints)

app = Flask(__name__)

EXTENSIONES = ("jpg", "jpeg", "png", "webp")
ULTIMO = list(sprints)[-1]  # El sprint más reciente se muestra por defecto.
CSV = Path(app.static_folder) / "datos" / dataset["archivo"]


def etiqueta(clave):
    """Nombre visible de un sprint: «Sprint II» o el texto tal cual («Estado actual»)."""
    return f"Sprint {clave}" if clave in ("I", "II", "III", "IV", "V", "VI") else clave


def resumen(estados):
    """Conteos y porcentaje de avance de un sprint."""
    total = sum(len(t) for t in estados.values())
    hechas = len(estados.get("Completadas", []))
    return {"total": total, "hechas": hechas, "pct": round(100 * hechas / total) if total else 0}


def buscar_imagen(clave):
    carpeta = Path(app.static_folder) / "evidencias"
    for extension in EXTENSIONES:
        if (carpeta / f"{clave}.{extension}").is_file():
            return f"evidencias/{clave}.{extension}"
    return ""


def _num(valor):
    try:
        return float(valor)
    except (TypeError, ValueError):
        return None


@lru_cache(maxsize=1)
def estadisticas():
    """Lee el CSV del dataset y calcula todo lo que muestran las gráficas. Devuelve None si no existe."""
    if not CSV.is_file():
        return None
    with CSV.open(encoding="utf-8-sig", newline="") as f:
        filas = list(csv.DictReader(f))
    orden = [c for c in clases if any(r["etiqueta"] == c for r in filas)]
    orden += sorted({r["etiqueta"] for r in filas} - set(orden))

    puntos, sesiones = [], set()
    for r in filas:
        sesiones.add(r["sesion"])
        puntos.append({
            "id": r["muestra_id"], "s": int(r["sesion"]), "c": r["etiqueta"], "p": r["prediccion"],
            "part": r["particion"], "conf": _num(r["confianza"]), "t90": _num(r["t90_s"]),
            "x": _num(r["mq135_respuesta"]), "y": _num(r["mq3_respuesta"]),
            "a135": int(_num(r["mq135_adc_max"]) or 0), "a3": int(_num(r["mq3_adc_max"]) or 0),
        })

    prueba = [p for p in puntos if p["part"] == "prueba"]
    matriz = {c: {d: 0 for d in orden} for c in orden}
    for p in prueba:
        if p["c"] in matriz and p["p"] in matriz[p["c"]]:
            matriz[p["c"]][p["p"]] += 1
    aciertos = sum(1 for p in prueba if p["c"] == p["p"])
    confusion = max(((matriz[c][d], c, d) for c in orden for d in orden if c != d), default=(0, "", ""))

    def media(valores):
        valores = [v for v in valores if v is not None]
        return round(sum(valores) / len(valores), 3) if valores else None

    por_clase = []
    for c in orden:
        grupo = [p for p in puntos if p["c"] == c]
        grupo_prueba = [p for p in prueba if p["c"] == c]
        por_clase.append({
            "clave": c, "nombre": clases.get(c, (c, "#888"))[0], "color": clases.get(c, (c, "#888"))[1],
            "n": len(grupo), "mq135": media(p["x"] for p in grupo), "mq3": media(p["y"] for p in grupo),
            "t90": media(p["t90"] for p in grupo),
            "recall": round(100 * matriz[c][c] / len(grupo_prueba), 1) if grupo_prueba else None,
            "n_prueba": len(grupo_prueba),
        })

    confianzas = {}
    for p in prueba:
        confianzas[p["conf"]] = confianzas.get(p["conf"], 0) + 1

    return {
        "total": len(puntos), "sesiones": len(sesiones),
        "entrenamiento": sum(1 for p in puntos if p["part"] == "entrenamiento"), "prueba": len(prueba),
        "aciertos": aciertos, "exactitud": round(100 * aciertos / len(prueba), 1) if prueba else None,
        "t90": media(p["t90"] for p in puntos),
        "desde": min(r["timestamp"] for r in filas)[:10], "hasta": max(r["timestamp"] for r in filas)[:10],
        "orden": orden, "por_clase": por_clase, "matriz": matriz,
        "confusion": {"n": confusion[0], "real": confusion[1], "pred": confusion[2],
                      "de": sum(1 for p in prueba if p["c"] == confusion[1])},
        "confianzas": sorted(confianzas.items()), "puntos": puntos,
    }


app.jinja_env.globals["etiqueta"] = etiqueta


@app.get("/")
@app.get("/diapositivas")
def tablero():
    sprint = request.args.get("sprint", ULTIMO)
    if sprint not in sprints:
        sprint = ULTIMO
    estados = sprints[sprint]
    estado = request.args.get("estado")
    if estado not in estados:
        estado = next(iter(estados))
    escala = max(1, max(len(t) for grupo in sprints.values() for t in grupo.values()))

    grupos = {}
    for clave, (titulo, descripcion, grupo) in fotos.items():
        grupos.setdefault(grupo, []).append(
            {"titulo": titulo, "descripcion": descripcion, "ruta": buscar_imagen(clave)})

    return render_template(
        "panel.html",
        sprint=sprint, estado=estado, estados=estados, sprints=sprints, escala=escala,
        resumen=resumen(estados), actual=resumen(sprints[ULTIMO]), ultimo=ULTIMO,
        decisiones=decisiones, etapas=etapas, grupos=grupos, proyecto=proyecto, equipo=equipo,
        motivo=motivo, diagrama=diagrama, app_movil=app_movil, dataset=dataset, clases=clases,
        carcasa=carcasa, stats=estadisticas(),
    )


if __name__ == "__main__":
    app.run()
