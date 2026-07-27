import { Footer, Header } from "./site-shell";
import type { Locale, Messages } from "@/lib/i18n";
export function LegalPage({ locale, messages, title, children }: { locale:Locale; messages:Messages; title:string; children:React.ReactNode }) {
  return <><Header locale={locale} messages={messages}/><main className="wrap legal"><p className="eyebrow">PixEasy</p><h1>{title}</h1>{children}</main><Footer locale={locale} messages={messages}/></>;
}
