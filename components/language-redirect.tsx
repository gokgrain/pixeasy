"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function LanguageRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (localStorage.getItem("pixeasy-locale")) return;
    const language = navigator.language.toLowerCase();
    if (language.startsWith("ko")) router.replace(`/ko${pathname === "/" ? "" : pathname}`);
    else if (language.startsWith("ja")) router.replace(`/ja${pathname === "/" ? "" : pathname}`);
  }, [pathname, router]);
  return null;
}
