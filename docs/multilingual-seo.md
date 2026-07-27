# PixEasy multilingual SEO

## Structure

- `messages/en.json`, `ko.json`, and `ja.json` are the translation source of truth.
- `lib/i18n.ts` owns supported locales, URL generation, hreflang, metadata, and tool configuration.
- English keeps unprefixed URLs. Korean and Japanese use `/ko` and `/ja`.
- `app/[locale]/page.tsx` renders localized homepages.
- `app/[locale]/[slug]/page.tsx` statically renders localized tools and legal pages.

## Add a language

1. Copy `messages/en.json` and translate every value with native search language.
2. Add the locale to `locales`, `localizedLocales`, and `dictionaries` in `lib/i18n.ts`.
3. Add its label to `components/language-switcher.tsx`.
4. Add its Open Graph locale mapping in `localizedMetadata`.

Static routes, canonical URLs, hreflang links, and sitemap entries are then generated automatically.

## Add or translate a page

Shared interface text belongs in the matching message group. Tool content belongs under `tools`. Add a new tool kind and slug to `toolKinds`; the localized route, related links, metadata, and sitemap can then use the same configuration without duplicating components.

Future blog pages should use `localePath(locale, "/blog")` and `localizedMetadata(locale, path, title, description, keywords)`. A post can use the same route pattern and language alternates.

## Metadata and hreflang

`localizedMetadata` creates a language-specific title, description, keywords, Open Graph, X card, canonical URL, and `en`, `ko`, `ja`, and `x-default` alternates. Each canonical points to the current language URL. Tool JSON-LD uses localized copy and `inLanguage`.

## Sitemap

The sitemap combines the central locale list with every indexable path and emits localized URLs plus XHTML hreflang alternates. Adding a locale to the central list automatically adds its URLs.

## Maintenance checklist

- Never translate search keywords literally; use phrases native speakers search.
- Keep equivalent content and slugs aligned across message files.
- Add every indexable route to the sitemap path registry.
- Verify canonical and hreflang on each language after changes.
- Do not redirect visitors or crawlers based on language. Every localized URL renders its own indexable page, and language changes happen only through crawlable user-selected links.
