import Link from "next/link";
import { FaqAccordion } from "./faq-accordion";
import { localePath } from "@/lib/i18n";
import type { ToolConfig } from "./image-tool";
import type { ToolSeoContent } from "@/content/tool-seo";
import type { ReactNode } from "react";

const labels = {
  en: { useful: "When is this useful?", how: "How to use", practical: "Helpful information", why: "Why PixEasy?", faq: "Frequently asked questions", related: "Related tools" },
  ko: { useful: "이럴 때 유용합니다", how: "사용 방법", practical: "도움이 되는 정보", why: "왜 PixEasy인가요?", faq: "자주 묻는 질문", related: "관련 도구" },
  ja: { useful: "こんなときに便利です", how: "使い方", practical: "役立つ情報", why: "PixEasyが選ばれる理由", faq: "よくある質問", related: "関連ツール" },
} as const;

const trustLabels = {
  en: ["100% free", "No login", "No installation", "No server upload", "Works on any device"],
  ko: ["100% 무료", "로그인 불필요", "설치 불필요", "서버 업로드 없음", "모든 기기에서 사용"],
  ja: ["100%無料", "ログイン不要", "インストール不要", "サーバー送信なし", "すべての端末で利用可能"],
} as const;

const whyItems = {
  en: [
    ["Private browser processing", "Your image stays on your device. PixEasy does not upload, inspect, or store it on a server."],
    ["No account or installation", "Open the tool in a modern browser and start immediately—no signup, app, or extension required."],
    ["Works across devices", "Use the same focused workflow on mobile, tablet, or desktop without moving files to another service."],
    ["Free image tools", "Core processing and downloads are free, with no watermark added to your result."],
  ],
  ko: [
    ["브라우저에서 안전하게 처리", "이미지는 기기에 그대로 남습니다. PixEasy는 파일을 서버로 전송하거나 확인·저장하지 않습니다."],
    ["로그인과 설치 불필요", "최신 브라우저에서 바로 시작하세요. 회원가입, 앱, 확장 프로그램이 필요하지 않습니다."],
    ["모든 기기에서 사용", "모바일, 태블릿, 데스크톱 어디서나 파일을 다른 서비스로 옮기지 않고 같은 방식으로 작업할 수 있습니다."],
    ["무료 이미지 도구", "핵심 이미지 처리와 다운로드는 무료이며 결과에 워터마크를 추가하지 않습니다."],
  ],
  ja: [
    ["ブラウザ内で安全に処理", "画像は端末内に残ります。PixEasyがサーバーへ送信、確認、保存することはありません。"],
    ["ログイン・インストール不要", "最新ブラウザですぐに開始できます。会員登録、アプリ、拡張機能は必要ありません。"],
    ["すべての端末で利用可能", "スマートフォン、タブレット、パソコンで、ファイルを別サービスへ移さず同じ手順で使えます。"],
    ["無料の画像ツール", "基本の画像処理とダウンロードは無料で、結果に透かしは追加されません。"],
  ],
} as const;

function commonFaqs(config: ToolConfig) {
  const formats = config.info.input;
  if (config.locale === "ko") return [
    { question: "PixEasy는 무료인가요?", answer: "네. 이 도구의 이미지 처리와 결과 다운로드는 무료이며 워터마크가 추가되지 않습니다." },
    { question: "로그인이나 회원가입이 필요한가요?", answer: "아니요. 계정을 만들거나 로그인하지 않아도 바로 사용할 수 있습니다." },
    { question: "이미지가 서버로 업로드되거나 저장되나요?", answer: "아니요. 이미지 읽기, 처리, 미리보기, 다운로드 파일 생성은 브라우저에서 이루어지며 서버로 전송되거나 저장되지 않습니다." },
    { question: "모바일에서도 사용할 수 있나요?", answer: "네. 최신 브라우저가 있는 스마트폰, 태블릿, 데스크톱에서 사용할 수 있습니다. 매우 큰 이미지는 기기 메모리에 따라 처리 속도가 달라질 수 있습니다." },
    { question: "앱이나 프로그램을 설치해야 하나요?", answer: "아니요. 별도 앱이나 확장 프로그램 없이 웹브라우저에서 바로 사용할 수 있습니다." },
    { question: "어떤 이미지 형식을 지원하나요?", answer: `이 도구의 입력 형식은 ${formats}입니다. 결과 형식은 ${config.info.output}입니다.` },
  ];
  if (config.locale === "ja") return [
    { question: "PixEasyは無料ですか？", answer: "はい。このツールの画像処理と結果のダウンロードは無料で、透かしも追加されません。" },
    { question: "ログインや会員登録は必要ですか？", answer: "いいえ。アカウント作成やログインなしですぐに利用できます。" },
    { question: "画像はサーバーへアップロードまたは保存されますか？", answer: "いいえ。画像の読み込み、処理、プレビュー、ダウンロードファイルの作成はブラウザ内で行われ、サーバーへ送信・保存されません。" },
    { question: "スマートフォンでも使えますか？", answer: "はい。最新ブラウザがあるスマートフォン、タブレット、パソコンで利用できます。非常に大きな画像は端末のメモリにより処理速度が変わる場合があります。" },
    { question: "アプリやソフトのインストールは必要ですか？", answer: "いいえ。アプリや拡張機能を追加せず、Webブラウザですぐに利用できます。" },
    { question: "対応している画像形式は？", answer: `このツールの入力形式は${formats}です。出力形式は${config.info.output}です。` },
  ];
  return [
    { question: "Is PixEasy free to use?", answer: "Yes. Image processing and result downloads are free, and PixEasy does not add a watermark." },
    { question: "Do I need to log in or create an account?", answer: "No. You can use the tool immediately without an account or login." },
    { question: "Is my image uploaded to or stored on a server?", answer: "No. Reading, processing, previewing, and creating the download all happen in your browser. Your image is never uploaded or stored." },
    { question: "Can I use this tool on mobile?", answer: "Yes. It works in modern browsers on phones, tablets, and desktop computers. Very large images may process differently depending on device memory." },
    { question: "Do I need to install an app or extension?", answer: "No. The tool runs directly in your web browser without an app, program, or extension." },
    { question: "Which image formats are supported?", answer: `This tool accepts ${formats}. Its output format is ${config.info.output}.` },
  ];
}

export function visibleToolFaqs(config: ToolConfig, content: ToolSeoContent) {
  return [content.faqLead, ...content.extraFaqs.slice(0, 1), ...commonFaqs(config)];
}

export function ToolTrustRow({ locale }: Pick<ToolConfig, "locale">) {
  return <ul className="tool-trust-row" aria-label={locale === "ko" ? "PixEasy 이용 안내" : locale === "ja" ? "PixEasyの利用案内" : "PixEasy benefits"}>{trustLabels[locale].map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>;
}

export function ToolSeoContent({ config, content, advertisement }: { config: ToolConfig; content: ToolSeoContent; advertisement?: ReactNode }) {
  const t = labels[config.locale];
  const faqs = visibleToolFaqs(config, content);
  return (
    <div className="tool-supporting-content">
      <section className="support-section useful-section" aria-labelledby="useful-title">
        <h2 id="useful-title">{t.useful}</h2>
        <ul className="useful-list">
          {content.useCases.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
        </ul>
      </section>
      {advertisement}
      <section className="support-section" aria-labelledby="how-to-title">
        <h2 id="how-to-title">{t.how}</h2>
        <ol className="how-to-steps">
          {content.steps.map((step) => <li key={step}><span>{step}</span></li>)}
        </ol>
      </section>
      <section className="support-section" aria-labelledby="practical-title">
        <h2 id="practical-title">{t.practical}</h2>
        <div className="practical-grid">
          {content.practical.map((item) => <article key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></article>)}
        </div>
        <p className="privacy-note">{config.about}</p>
      </section>
      <section className="support-section" aria-labelledby="why-title">
        <h2 id="why-title">{t.why}</h2>
        <div className="why-grid">
          {whyItems[config.locale].map(([heading, body]) => <article key={heading}><h3>{heading}</h3><p>{body}</p></article>)}
        </div>
      </section>
      <section className="support-section" aria-labelledby="faq-title">
        <h2 id="faq-title">{t.faq}</h2>
        <FaqAccordion items={faqs} />
      </section>
      <section className="support-section" aria-labelledby="related-title">
        <h2 id="related-title">{t.related}</h2>
        <nav className="related-tool-grid" aria-label={t.related}>
          {content.related.map((kind) => {
            const tool = config.messages.tools[kind];
            return <Link key={kind} href={localePath(config.locale, `/${tool.slug}`)}><strong>{tool.title}</strong><span>{tool.description}</span></Link>;
          })}
        </nav>
      </section>
    </div>
  );
}
