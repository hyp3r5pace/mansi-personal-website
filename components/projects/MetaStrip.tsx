import type { Project } from "@/lib/mdx";

const Cell = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">{label}</p>
    <p className="font-display text-ink-indigo mt-1 text-lg italic">{value}</p>
  </div>
);

/**
 * Compact key-value strip for a case study. Year, role, materials,
 * collaborators — read at a glance like a colophon.
 */
export function MetaStrip({ project }: { project: Project }) {
  return (
    <section className="border-char-ink/12 mx-auto w-full max-w-6xl border-y px-6 py-8 sm:px-10">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Cell label="Year" value={project.year} />
        <Cell label="Role" value={project.role} />
        <Cell
          label="Materials"
          value={project.materials.length > 0 ? project.materials.join(", ") : "—"}
        />
        <Cell
          label="Collaborators"
          value={project.collaborators.length > 0 ? project.collaborators.join(", ") : "—"}
        />
      </dl>
    </section>
  );
}
