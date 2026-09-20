import { Demo, Section } from "./Section";

const SWATCHES = [
  { name: "--waas-bg", value: "var(--waas-bg)" },
  { name: "--waas-surface", value: "var(--waas-surface)" },
  { name: "--waas-surface-solid", value: "var(--waas-surface-solid)" },
  { name: "--waas-text", value: "var(--waas-text)" },
  { name: "--waas-text-subtle", value: "var(--waas-text-subtle)" },
  { name: "--waas-border", value: "var(--waas-border)" },
  { name: "--waas-ring", value: "var(--waas-ring)" },
  { name: "--waas-danger-9", value: "var(--waas-danger-9)" },
  { name: "--waas-success-9", value: "var(--waas-success-9)" },
  { name: "--waas-warning-9", value: "var(--waas-warning-9)" },
  { name: "--waas-info-9", value: "var(--waas-info-9)" },
] as const;

export function TokenSection() {
  return (
    <Section id="tokens" title="Tokens" blurb="Live semantic variables under the active theme. Toggle Light/Dark/Acme above.">
      <Demo title="Swatches">
        <div className="pg-grid-2">
          {SWATCHES.map((swatch) => (
            <div key={swatch.name} className="pg-row">
              <span
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "var(--waas-radius-md)",
                  background: swatch.value,
                  border: "1px solid var(--waas-border)",
                  flex: "none",
                }}
              />
              <code>{swatch.name}</code>
            </div>
          ))}
        </div>
      </Demo>
      <Demo title="Type + spacing + radius">
        <div style={{ font: "var(--waas-font-display)" }}>Display</div>
        <div style={{ font: "var(--waas-font-h2)" }}>Heading 2</div>
        <div style={{ font: "var(--waas-font-body)" }}>Body text with the active theme.</div>
        <div className="pg-row">
          {(["sm", "md", "lg", "xl", "full"] as const).map((radius) => (
            <span
              key={radius}
              style={{
                padding: "var(--waas-space-sm) var(--waas-space-md)",
                background: "var(--waas-surface)",
                borderRadius: `var(--waas-radius-${radius})`,
                border: "1px solid var(--waas-border)",
              }}
            >
              {radius}
            </span>
          ))}
        </div>
      </Demo>
    </Section>
  );
}
