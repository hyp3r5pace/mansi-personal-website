import { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/lib/mdx";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? "Project";
  const category = project?.category ?? "Studio";
  const year = project?.year ?? "";
  const palette = (project?.palette ?? []).slice(0, 6);

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
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, letterSpacing: 2, color: "#C97A1A", textTransform: "uppercase" }}>
            {`${category} · ${year}`}
          </div>
          <div style={{ fontSize: 22, color: "#1F2A56", fontStyle: "italic" }}>Bubu — Studio</div>
        </div>

        <div
          style={{
            fontSize: 92,
            fontStyle: "italic",
            lineHeight: 1.05,
            color: "#1F2A56",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {palette.length > 0
              ? palette.map((swatch) => (
                  <div
                    key={swatch.hex}
                    style={{
                      width: 56,
                      height: 56,
                      background: swatch.hex,
                      borderRadius: 4,
                      border: "1px solid rgba(31,42,86,0.15)",
                    }}
                  />
                ))
              : null}
          </div>
          <div style={{ fontSize: 22, opacity: 0.75 }}>bubu.studio/projects</div>
        </div>
      </div>
    ),
    size,
  );
}
