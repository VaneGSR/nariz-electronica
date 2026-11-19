/* Visor 3D de la carcasa (three.js local en static/vendor/three).
   Modelos: static/modelos/carcasa_base.stl y carcasa_tapa.stl (mm, Z hacia arriba, ya centrados). */
import * as THREE from "three";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { STLLoader } from "three/addons/STLLoader.js";

const caja = document.querySelector("[data-visor3d]");
const ctl = document.querySelector("[data-visor3d-ctl]");
const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function webglDisponible() {
    try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; }
}

if (caja && webglDisponible()) iniciar();

function iniciar() {
    const carga = caja.querySelector(".visor3d-carga");
    carga.hidden = false;

    /* Escena con fondo cálido y luz suave, al estilo de una maqueta isométrica */
    const FONDO = 0xefebe7;
    const escena = new THREE.Scene();
    escena.background = new THREE.Color(FONDO);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-label", "Modelo 3D interactivo de la carcasa. Arrastra para girar y usa la rueda para acercar.");
    renderer.domElement.setAttribute("role", "img");
    caja.appendChild(renderer.domElement);

    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000);
    const CAM_INICIAL = new THREE.Vector3(330, 280, 330);
    camara.position.copy(CAM_INICIAL);

    const controles = new OrbitControls(camara, renderer.domElement);
    controles.target.set(0, 50, 0);
    controles.enableDamping = true;
    controles.dampingFactor = 0.08;
    controles.minZoom = 0.5; controles.maxZoom = 4;
    controles.maxPolarAngle = Math.PI * 0.49;
    controles.autoRotate = !reducido;
    controles.autoRotateSpeed = 1.1;

    escena.add(new THREE.HemisphereLight(0xfff8f2, 0xc9bfb8, 1.6));
    const sol = new THREE.DirectionalLight(0xffffff, 2.1);
    sol.position.set(-160, 320, 200);
    sol.castShadow = true;
    sol.shadow.mapSize.set(2048, 2048);
    Object.assign(sol.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 10, far: 900 });
    sol.shadow.radius = 6;
    sol.shadow.bias = -0.0005;
    escena.add(sol);
    const relleno = new THREE.DirectionalLight(0xffe9e4, 0.6);
    relleno.position.set(220, 120, -160);
    escena.add(relleno);

    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.ShadowMaterial({ opacity: 0.16 }));
    suelo.rotation.x = -Math.PI / 2;
    suelo.receiveShadow = true;
    escena.add(suelo);

    /* Material del filamento y bordes para el modo rayos X */
    let color = new THREE.Color(ctl.querySelector("[data-color]")?.dataset.color || "#e8b4bc");
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.02, side: THREE.DoubleSide });
    const matBordes = new THREE.LineBasicMaterial({ color: 0x5b3a44, transparent: true, opacity: 0 });

    const grupoBase = new THREE.Group(), grupoTapa = new THREE.Group(), pivoteTapa = new THREE.Group();
    escena.add(grupoBase); escena.add(pivoteTapa); pivoteTapa.add(grupoTapa);
    const medidas = new THREE.Group(); medidas.visible = false; escena.add(medidas);

    function malla(geo) {
        geo.rotateX(-Math.PI / 2);             // Z arriba (AutoCAD) → Y arriba (three.js)
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = true; m.receiveShadow = true;
        const g = new THREE.Group();
        g.add(m, new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), matBordes));
        return g;
    }

    const loader = new STLLoader();
    const cargar = (url) => new Promise((ok, mal) => loader.load(url, ok, undefined, mal));
    Promise.all([cargar(caja.dataset.base), cargar(caja.dataset.tapa)]).then(([gBase, gTapa]) => {
        grupoBase.add(malla(gBase));
        const tapa = malla(gTapa);
        // La tapa se imprime con las guías hacia arriba: para ensamblarla se voltea y se apoya sobre la base.
        tapa.rotation.x = Math.PI;
        grupoTapa.add(tapa);
        crearMedidas();
        caja.classList.add("listo");
        carga.hidden = true;
        ctl.hidden = false;
        aplicarVista("explosionada", true);
        ajustar();
        animar();
    }).catch(() => { carga.textContent = "No se pudo cargar el modelo 3D."; });

    /* Cotas: 195 × 85 × 85 mm */
    function texto(t) {
        const c = document.createElement("canvas"); c.width = 256; c.height = 64;
        const x = c.getContext("2d");
        x.fillStyle = "rgba(255,255,255,.92)"; x.beginPath(); x.roundRect(8, 10, 240, 44, 22); x.fill();
        x.fillStyle = "#13262f"; x.font = "600 28px system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
        x.fillText(t, 128, 33);
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
        s.scale.set(64, 16, 1); s.renderOrder = 10;
        return s;
    }
    function cota(a, b, etiqueta, desplaz) {
        const linea = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]),
            new THREE.LineDashedMaterial({ color: 0x00665f, dashSize: 4, gapSize: 3, depthTest: false }));
        linea.computeLineDistances(); linea.renderOrder = 9;
        const t = texto(etiqueta); t.position.copy(a).add(b).multiplyScalar(0.5).add(desplaz);
        medidas.add(linea, t);
    }
    function crearMedidas() {
        cota(new THREE.Vector3(-97.5, 0, 52), new THREE.Vector3(97.5, 0, 52), "195 mm", new THREE.Vector3(0, 0, 14));
        cota(new THREE.Vector3(108, 0, -42.5), new THREE.Vector3(108, 0, 42.5), "85 mm", new THREE.Vector3(22, 0, 0));
        cota(new THREE.Vector3(108, 0, 52), new THREE.Vector3(108, 85, 52), "85 mm", new THREE.Vector3(22, 0, 0));
    }

    /* Vistas con transición suave */
    let objetivo = { lift: 0, inclin: 0, base: 1, tapa: 1 }, estado = { lift: 0, inclin: 0, base: 1, tapa: 1 };
    function aplicarVista(v, inmediato) {
        objetivo = {
            ensamblada: { lift: 0, inclin: 0, base: 1, tapa: 1 },
            explosionada: { lift: 75, inclin: -0.18, base: 1, tapa: 1 },
            base: { lift: 75, inclin: 0, base: 1, tapa: 0 },
            tapa: { lift: -40, inclin: 0, base: 0, tapa: 1 },
        }[v];
        if (inmediato) estado = { ...objetivo };
        ctl.querySelectorAll("[data-vista]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vista === v)));
    }

    ctl.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.vista) aplicarVista(b.dataset.vista);
        if (b.dataset.color) {
            mat.color.set(b.dataset.color);
            ctl.querySelectorAll("[data-color]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        }
        const op = b.dataset.op;
        if (op === "girar") { controles.autoRotate = !controles.autoRotate; b.setAttribute("aria-pressed", String(controles.autoRotate)); }
        if (op === "rayos") {
            const on = b.getAttribute("aria-pressed") !== "true";
            b.setAttribute("aria-pressed", String(on));
            mat.transparent = on; mat.opacity = on ? 0.28 : 1; mat.depthWrite = !on; mat.needsUpdate = true;
            matBordes.opacity = on ? 0.85 : 0;
        }
        if (op === "medidas") { medidas.visible = !medidas.visible; b.setAttribute("aria-pressed", String(medidas.visible)); }
        if (op === "reiniciar") { camara.position.copy(CAM_INICIAL); camara.zoom = 1; controles.target.set(0, 50, 0); camara.updateProjectionMatrix(); }
    });

    /* Tamaño y bucle de render (solo cuando el visor está en pantalla) */
    function ajustar() {
        const w = caja.clientWidth, h = caja.clientHeight, aspecto = w / h, alto = 300;
        camara.left = -alto * aspecto / 2; camara.right = alto * aspecto / 2; camara.top = alto / 2; camara.bottom = -alto / 2;
        camara.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener("resize", ajustar);
    let visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(caja);

    function animar() {
        requestAnimationFrame(animar);
        if (!visible || document.hidden) return;
        const k = reducido ? 1 : 0.09;
        for (const p in estado) estado[p] += (objetivo[p] - estado[p]) * k;
        pivoteTapa.position.y = 90 + estado.lift;
        pivoteTapa.rotation.z = estado.inclin;
        grupoBase.visible = estado.base > 0.02; grupoTapa.visible = estado.tapa > 0.02;
        grupoBase.scale.setScalar(0.85 + 0.15 * estado.base);
        grupoTapa.scale.setScalar(0.85 + 0.15 * estado.tapa);
        controles.update();
        renderer.render(escena, camara);
    }
}
