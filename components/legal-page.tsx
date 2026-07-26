import { Footer, Header } from "./site-shell";
export function LegalPage({ title, children }: { title:string; children:React.ReactNode }) {
  return <><Header/><main className="wrap legal"><p className="eyebrow">PixEasy</p><h1>{title}</h1>{children}</main><Footer/></>;
}
