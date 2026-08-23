import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexPage } from "@/components/blog-index-page";
import { isLocalizedLocale, localizedMetadata } from "@/lib/i18n";

const copy={ko:{title:"이미지 가이드와 활용 팁 | PixEasy",description:"이미지 형식, 사진 크기, 사진 규정과 브라우저 이미지 편집을 이해하기 쉽게 안내합니다."},ja:{title:"画像ガイドと活用ヒント | PixEasy",description:"画像形式、写真サイズ、写真規定、ブラウザ編集をわかりやすく解説します。"}};
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocalizedLocale(locale))return {};const item=copy[locale];return localizedMetadata(locale,"/blog",item.title,item.description);}
export default async function LocalizedBlogPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocalizedLocale(locale))notFound();return <BlogIndexPage locale={locale}/>;}
