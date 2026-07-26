export type ToolInfo = { tool: string; purpose: string; input: string; output: string };
export function ToolInfoCard({ info }: { info: ToolInfo }) {
  const rows = [["Tool", info.tool], ["Purpose", info.purpose], ["Input", info.input], ["Output", info.output], ["Processing", "Locally in your browser"], ["Cost", "100% free"], ["Watermark", "None"]];
  return (
    <section className="info-card" aria-labelledby="tool-info-title">
      <h2 id="tool-info-title">Tool information</h2>
      <dl className="info-list">{rows.map(([label, value]) => <div key={label} style={{display:"contents"}}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>
  );
}
