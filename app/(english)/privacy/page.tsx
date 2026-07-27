import { LegalPage } from "@/components/legal-page";
import { getMessages, localizedMetadata } from "@/lib/i18n";
const messages=getMessages("en"); const page=messages.legal.privacy;
export const metadata=localizedMetadata("en","/privacy",page.seoTitle,page.seoDescription);
export default function Page(){return <LegalPage locale="en" messages={messages} title={page.title}>{page.sections.map((item)=><section key={item.heading||item.body}>{item.heading&&<h2>{item.heading}</h2>}<p>{item.body}</p></section>)}</LegalPage>}
