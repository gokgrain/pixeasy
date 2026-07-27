import "../globals.css";
import { notFound } from "next/navigation";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";
import { isLocalizedLocale } from "@/lib/i18n";
export const metadata=rootMetadata;
export const viewport=rootViewport;
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocalizedLocale(locale))notFound();return <RootDocument locale={locale}>{children}</RootDocument>}
