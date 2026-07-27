import { ToolPage } from "@/components/tool-page";
import { getToolConfig, toolMetadata } from "@/lib/i18n";
export const metadata = toolMetadata("en", "jpg-png");
export default function Page(){return <ToolPage config={getToolConfig("en","jpg-png")}/>}
