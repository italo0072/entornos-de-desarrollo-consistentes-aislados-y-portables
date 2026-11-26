import Estado from "./estado";

export default function Home() {
  return (
    <div className="sheet">
      <header>
        <span className="brand">
          <span className="mark" aria-hidden="true">
            ▰
          </span>
          Muelle
        </span>
        <span className="mono">Laboratorio de software</span>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">Operaciones / Contenedores</p>
            <h1>
              Bitácora
              <br />
              de carga<span>.</span>
            </h1>
            <p className="lead">
              Una aplicación Next.js empaquetada con Docker. Consultá el
              servidor para verificar el entorno en el que se está ejecutando.
            </p>
          </div>
          <figure aria-label="Ilustración de un contenedor de carga verde">
            <div className="cargo" aria-hidden="true">
              <i className="roof" />
              <i className="side">
                <b>MUELLE</b>
              </i>
              <i className="doors" />
            </div>
            <figcaption>
              <span>Fig. 01</span>Unidad de carga
            </figcaption>
          </figure>
        </section>
        <Estado />
      </main>
      <footer>
        <span>Muelle / Práctica de contenerización</span>
        <span>Next.js + Docker</span>
      </footer>
    </div>
  );
}
