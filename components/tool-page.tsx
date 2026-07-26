import { ImageTool, type ToolConfig } from "./image-tool";
import { Footer, Header } from "./site-shell";

export function ToolPage({ config }: { config: ToolConfig }) {
  return (
    <>
      <Header />
      <main className="wrap tool-main">
        <header className="tool-intro"><p className="eyebrow">Free online image tool</p><h1>{config.title}</h1><p>{config.description}</p></header>
        <ImageTool config={config} />
      </main>
      <Footer />
    </>
  );
}
