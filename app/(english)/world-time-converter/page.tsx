import { WorldTimeConverterPage } from "@/components/world-time-converter-page";
import { worldTimeMetadata } from "@/lib/i18n";
export const metadata=worldTimeMetadata("en");
export default function Page(){return <WorldTimeConverterPage locale="en"/>}
