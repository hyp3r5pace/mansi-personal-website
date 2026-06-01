import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

export const alt = "Journal entry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "Journal";
  const excerpt = post?.excerpt ?? "";
  const date = post ? dateFmt.format(post.date) : "";
  const tags = post?.tags ?? [];

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
          <div style={{ fontSize: 22, letterSpacing: 2, color: "#B5495B", textTransform: "uppercase" }}>
            Studio Notebook
          </div>
          <div style={{ fontSize: 20, color: "#1F2A56", opacity: 0.75 }}>{date}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 80,
              fontStyle: "italic",
              lineHeight: 1.08,
              color: "#1F2A56",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {excerpt ? (
            <div style={{ fontSize: 26, color: "#2A2620", opacity: 0.75, maxWidth: 980 }}>
              {excerpt}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  border: "1.5px dashed #1F2A56",
                  borderRadius: 4,
                  fontSize: 20,
                  color: "#1F2A56",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "#C97A1A", fontStyle: "italic" }}>
            bubu.studio/blog
          </div>
        </div>
      </div>
    ),
    size,
  );
}
