"use client";

import { useRef, useState } from "react";

type Lectura = { entorno: string; node: string; fecha: string };

export default function Estado() {
  const [lectura, setLectura] = useState<Lectura | null>(null);
  const [fase, setFase] = useState<"inicial" | "cargando" | "ok" | "error">(
    "inicial",
  );
  const ocupado = useRef(false);

  async function verificar() {
    if (ocupado.current) return;
    ocupado.current = true;
    setFase("cargando");
    try {
      const respuesta = await fetch("/api/estado", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!respuesta.ok) throw new Error("El servidor devolvió un error.");
      const datos = await respuesta.json();
      if (datos.estado !== "ok") throw new Error("Respuesta inesperada.");
      setLectura(datos);
      setFase("ok");
    } catch {
      setLectura(null);
      setFase("error");
    } finally {
      ocupado.current = false;
    }
  }

  const mensajes = {
    inicial: "Pendiente de consulta",
    cargando: "Consultando…",
    ok: "Servidor en línea",
    error: "Falló la consulta. Volvé a intentarlo.",
  };
  return (
    <section className="station" aria-labelledby="servidor">
      <div className="station-head">
        <div>
          <p className="eyebrow">Diagnóstico</p>
          <h2 id="servidor">Estado del servidor</h2>
        </div>
        <button
          type="button"
          onClick={verificar}
          disabled={fase === "cargando"}
        >
          {fase === "cargando" ? "Consultando…" : "Verificar conexión"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <p className={"indicator " + fase}>
          <i aria-hidden="true" />
          {mensajes[fase]}
        </p>
        <dl>
          <div>
            <dt>Entorno</dt>
            <dd>{lectura?.entorno ?? "—"}</dd>
          </div>
          <div>
            <dt>Versión de Node.js</dt>
            <dd>{lectura ? "v" + lectura.node : "—"}</dd>
          </div>
          <div>
            <dt>Última respuesta (UTC)</dt>
            <dd>
              {lectura
                ? new Date(lectura.fecha).toISOString().slice(11, 19)
                : "—"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
