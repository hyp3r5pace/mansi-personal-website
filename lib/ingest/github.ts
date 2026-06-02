import fs from "node:fs/promises";
import path from "node:path";

/**
 * Publish a project file.
 *
 * Production commits the MDX to the repo via the GitHub contents API — that
 * push triggers a Vercel redeploy. Local development (no GITHUB_TOKEN) writes
 * the file straight into content/projects so the flow is testable end-to-end.
 */

export type PublishResult = { committed: boolean; commitUrl?: string };

const GH_API = "https://api.github.com";

function ghConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !repo) return null;
  return { token, repo, branch };
}

async function getFileSha(
  cfg: { token: string; repo: string; branch: string },
  filePath: string,
): Promise<string | undefined> {
  const res = await fetch(
    `${GH_API}/repos/${cfg.repo}/contents/${filePath}?ref=${cfg.branch}`,
    {
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "mansi-studio-ingest",
      },
    },
  );
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}).`);
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

export async function publishProjectFile(
  slug: string,
  mdx: string,
): Promise<PublishResult> {
  const filePath = `content/projects/${slug}.mdx`;
  const cfg = ghConfig();

  // Dev fallback → write locally.
  if (!cfg) {
    const abs = path.join(process.cwd(), filePath);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, mdx, "utf8");
    return { committed: false };
  }

  const sha = await getFileSha(cfg, filePath);
  const res = await fetch(`${GH_API}/repos/${cfg.repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "mansi-studio-ingest",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `feat: add project ${slug} via studio import`,
      content: Buffer.from(mdx, "utf8").toString("base64"),
      branch: cfg.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Couldn't publish to the repository (${res.status}).`);
  }
  const data = (await res.json()) as { commit?: { html_url?: string } };
  return { committed: true, commitUrl: data.commit?.html_url };
}

export async function deleteProjectFile(slug: string): Promise<PublishResult> {
  const filePath = `content/projects/${slug}.mdx`;
  const cfg = ghConfig();

  if (!cfg) {
    await fs.rm(path.join(process.cwd(), filePath), { force: true });
    return { committed: false };
  }

  const sha = await getFileSha(cfg, filePath);
  if (!sha) return { committed: false };
  const res = await fetch(`${GH_API}/repos/${cfg.repo}/contents/${filePath}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "mansi-studio-ingest",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `chore: remove project ${slug} via studio`,
      sha,
      branch: cfg.branch,
    }),
  });
  if (!res.ok) throw new Error(`Couldn't remove the project (${res.status}).`);
  const data = (await res.json()) as { commit?: { html_url?: string } };
  return { committed: true, commitUrl: data.commit?.html_url };
}
