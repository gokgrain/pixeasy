import { ToolPage } from "@/components/tool-page";
import { getToolConfig, toolMetadata } from "@/lib/i18n";
export const metadata = toolMetadata("en", "transparent-background");
export default function Page(){return <ToolPage config={getToolConfig("en","transparent-background")}/>}
