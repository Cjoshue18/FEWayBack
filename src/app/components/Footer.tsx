import { Link } from "react-router";
import { Instagram, Youtube } from "lucide-react";

const CATEGORIES = [
  { id: "pantalon", label: "Pantalón" },
  { id: "falda", label: "Falda" },
  { id: "shorts", label: "Shorts" },
  { id: "jogger", label: "Jogger" },
  { id: "camisetas", label: "Camisetas" },
  { id: "sueteres", label: "Suéteres" },
  { id: "chaquetas", label: "Chaquetas" },
  { id: "sets-baggy", label: "Sets Baggy" },
  { id: "sets-denim", label: "Sets Denim" },
  { id: "sets-deportivos", label: "Sets Deportivos" },
  { id: "sets-tejidos", label: "Sets Tejidos" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0d0d0d", color: "#fff" }}>
      {/* top: brand mark */}
      <div
        className="container mx-auto px-6 pt-16 pb-10"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand column */}
          <div style={{ maxWidth: 260 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.25em",
                color: "#fff",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 16,
              }}
            >
              WAYBACK
            </span>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Moda Y2K de archivo. Prendas vintage seleccionadas
              para quienes saben lo que quieren.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor = "#7c3aed";
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.color = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor =
                    "rgba(255,255,255,0.12)";
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.color = "rgba(255,255,255,0.5)";
                }}
                aria-label="Instagram"
              >
                <Instagram style={{ width: 15, height: 15 }} />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor = "#7c3aed";
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.color = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor =
                    "rgba(255,255,255,0.12)";
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.color = "rgba(255,255,255,0.5)";
                }}
                aria-label="YouTube"
              >
                <Youtube style={{ width: 15, height: 15 }} />
              </a>
              {/* TikTok icon (SVG inline) */}
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor = "#7c3aed";
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.color = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderColor =
                    "rgba(255,255,255,0.12)";
                  (
                    e.currentTarget as HTMLAnchorElement
                  ).style.color = "rgba(255,255,255,0.5)";
                }}
                aria-label="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: 14, height: 14 }}
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.84a8.2 8.2 0 004.79 1.53V6.93a4.85 4.85 0 01-1.02-.24z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Categorías
            </p>
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 32px",
              }}
            >
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/categoria/${cat.id}`}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.02em",
                      display: "inline-block",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Información
            </p>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                "Contacto",
                "Envíos",
                "Devoluciones",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Contacto" ? "/contacto" : "#"}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.02em",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ minWidth: 220 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Newsletter
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Drops exclusivos y novedades directas a tu correo.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="tu@correo.com"
                className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-white/20 focus:outline-none"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRight: "none",
                  fontSize: 13,
                }}
              />
              <button
                className="px-4 py-2.5 text-white transition-colors flex-shrink-0"
                style={{
                  background: "#7c3aed",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.background = "#6d28d9";
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.background = "#7c3aed";
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.06em",
          }}
        >
          © 2026 WAYBACK · Todos los derechos reservados
        </p>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.04em",
          }}
        >
          Moda Y2K · Vintage Archive · SS25
        </p>
      </div>
    </footer>
  );
}