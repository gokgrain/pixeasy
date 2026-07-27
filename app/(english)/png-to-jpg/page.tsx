import { ToolPage } from "@/components/tool-page";
import { getToolConfig, toolMetadata } from "@/lib/i18n";
export const metadata = toolMetadata("en", "png-jpg");
export default function Page(){return <ToolPage config={getToolConfig("en","png-jpg")}/>}
