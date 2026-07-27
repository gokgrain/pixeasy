import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { getMessages, localizedMetadata } from "@/lib/i18n";

const messages = getMessages("en");
export const metadata: Metadata = localizedMetadata("en", "/", messages.home.title, messages.home.description);

export default function Home() {
  return <HomePage locale="en" messages={messages} />;
}
