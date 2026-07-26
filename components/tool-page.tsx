import { ImageTool, type ToolConfig } from "./image-tool";
import { Footer, Header } from "./site-shell";
import { AdPlaceholder } from "./ad-placeholder";

export function ToolPage({ config }: { config: ToolConfig }) {
  return (
    <>
      <Header />
      <main className="wrap tool-main">
        <AdPlaceholder />
        <ImageTool config={config} />
      </main>
      <Footer />
    </>
  );
}
