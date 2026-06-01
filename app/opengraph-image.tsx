import { ImageResponse } from "next/og";
import { SITE, SITE_DOMAIN, TITLE_DEFAULT } from "@/lib/site";

export const alt = TITLE_DEFAULT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6EFE2",
          padding: "80px",
          fontFamily: "serif",
          color: "#1F2A56",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 28, letterSpacing: 2, color: "#C97A1A", textTransform: "uppercase" }}>
            {`Studio · ${SITE.shortName}`}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: i % 2 === 0 ? "#E8A33D" : "#B5495B",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontStyle: "italic",
              lineHeight: 1.05,
              color: "#1F2A56",
              maxWidth: 920,
            }}
          >
            {SITE.ogHeadline}
          </div>
          <div style={{ fontSize: 32, color: "#2A2620", opacity: 0.8, maxWidth: 920 }}>
            {SITE.ogSubhead}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#1F2A56",
            opacity: 0.8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8A33D" }} />
            {SITE_DOMAIN}
          </div>
          <div style={{ fontStyle: "italic" }}>{SITE.copyrightLine}</div>
        </div>
      </div>
    ),
    size,
  );
}
