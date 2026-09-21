import Image from "next/image";
import type { Locale } from "@/lib/i18n";

const copy = {
  en: {
    examplesTitle: "See What Image Inversion Does",
    examplesIntro: "Image inversion replaces each color with its opposite value, creating a negative version of the original image. Upload your own image in the tool above to preview the same transformation.",
    before: "Before",
    after: "After",
    examples: [
      { title: "Turn a Photo into a Negative", before: "Original", after: "Inverted", description: "Invert a photo to create a negative-style effect. Bright areas become dark, dark areas become bright, and colors shift to their complementary values.", note: "Use the tool above to upload your own photo, adjust the inversion strength, and compare the live result." },
      { title: "Preview a Scanned Film Negative", before: "Film negative", after: "Inverted preview", description: "A simple inversion can provide a quick positive-looking preview of a scanned film negative before further editing.", note: "Simple RGB inversion is only a preview. Accurate color-negative conversion may require correction for film characteristics such as the orange mask." },
      { title: "Make Subtle Details Easier to Inspect", before: "Original", after: "Inverted", description: "Changing light and dark relationships can make some existing faint lines, edges, or low-contrast details easier to inspect visually.", note: "Inversion does not recover missing information. It only displays the original pixel values in an inverted form." },
    ],
    meaningTitle: "What Does It Mean to Invert an Image?",
    meaning: "Inverting an image reverses its color values. Each color is replaced by its opposite value, producing an effect similar to a photographic negative. White becomes black, black becomes white, and RGB colors shift toward their complementary values.",
    usefulTitle: "When Is Image Inversion Useful?",
    uses: [
      ["Create a negative effect", "Upload a photo above when you want a negative-style visual for artwork, graphics, or creative editing."],
      ["Preview scanned film negatives", "Use the live preview for a quick look at the contents of a scanned negative before doing more precise color correction."],
      ["Inspect faint lines and low-contrast details", "Try the inversion controls to change the visual relationship between details and their background without claiming to restore missing data."],
      ["Check drawings and scanned documents", "A light drawing or document can be previewed on a dark background, which may be easier to examine in some situations."],
      ["Creative image editing", "Adjust strength, RGB channels, hue, saturation, brightness, and contrast to build a controlled visual effect."],
    ],
    differenceTitle: "Invert Image vs. Flip Image: What's the Difference?",
    difference: "Inverting an image changes its colors; it does not move or rotate the image. Flipping changes orientation while keeping the original colors.",
    invert: "Changes colors",
    flipH: "Changes left/right orientation",
    flipV: "Changes top/bottom orientation",
    worksTitle: "How Image Color Inversion Works",
    works: "Digital images commonly store red, green, and blue values from 0 to 255. At full strength, the tool replaces each selected channel with 255 minus its original value. For example, RGB(255, 0, 0) becomes RGB(0, 255, 255), so red becomes cyan.",
    privacyTitle: "Private, Browser-Based Image Processing",
    privacy: "PixEasy processes the image directly in your browser. It does not need to upload the file to a server to apply the inversion effect, generate the preview, or create the download.",
    cta: "Try it with your own image",
  },
  ko: {
    examplesTitle: "이미지 색상 반전 결과 살펴보기",
    examplesIntro: "이미지 색상 반전은 각 색을 반대 값으로 바꿔 원본의 네거티브 버전을 만듭니다. 위 도구에 이미지를 올리면 같은 변화를 바로 미리 볼 수 있습니다.",
    before: "반전 전",
    after: "반전 후",
    examples: [
      { title: "사진을 네거티브 이미지로 만들기", before: "원본", after: "색상 반전", description: "밝은 부분은 어둡게, 어두운 부분은 밝게 바뀌고 색상은 보색 값으로 이동해 네거티브 효과가 만들어집니다.", note: "위 도구에서 사진을 올리고 반전 강도를 조절하며 결과를 비교할 수 있습니다." },
      { title: "스캔한 필름 네거티브 미리보기", before: "필름 네거티브", after: "반전 미리보기", description: "단순 색상 반전으로 스캔한 필름 네거티브에 담긴 내용을 빠르게 확인할 수 있습니다.", note: "RGB 반전은 간단한 미리보기입니다. 정확한 컬러 네거티브 변환에는 오렌지 마스크 같은 필름 특성 보정이 추가로 필요할 수 있습니다." },
      { title: "희미한 디테일 살펴보기", before: "원본", after: "색상 반전", description: "명암 관계를 바꾸면 원본에 있는 가는 선이나 가장자리, 낮은 대비의 디테일을 시각적으로 살펴보기 쉬워질 수 있습니다.", note: "색상 반전은 원본에 없는 정보를 복원하지 않으며, 기존 픽셀 값을 반대로 표시할 뿐입니다." },
    ],
    meaningTitle: "이미지 색상 반전이란 무엇인가요?",
    meaning: "이미지 색상 반전은 각 색상 값을 반대 값으로 바꾸는 작업입니다. 사진 네거티브와 비슷한 효과가 생기며 흰색은 검정색, 검정색은 흰색으로 바뀌고 RGB 색상은 보색에 가까운 값으로 이동합니다.",
    usefulTitle: "이미지 색상 반전은 언제 유용한가요?",
    uses: [
      ["네거티브 효과 만들기", "작품, 그래픽, 창작 편집에 네거티브 느낌이 필요하면 위 도구에 사진을 올려 바로 적용할 수 있습니다."],
      ["스캔한 필름 네거티브 확인", "정밀한 색 보정 전에 필름에 담긴 내용을 빠르게 살펴보는 미리보기로 사용할 수 있습니다."],
      ["희미한 선과 낮은 대비 확인", "반전 컨트롤로 디테일과 배경의 시각적 관계를 바꿔 볼 수 있지만, 사라진 정보를 복원하는 기능은 아닙니다."],
      ["도면과 스캔 문서 확인", "밝은 문서나 선화를 어두운 배경으로 바꿔 특정 상황에서 더 편하게 살펴볼 수 있습니다."],
      ["창작 이미지 편집", "강도와 RGB 채널, 색조, 채도, 밝기, 대비를 조절해 원하는 색상 효과를 만들 수 있습니다."],
    ],
    differenceTitle: "색상 반전과 좌우·상하 반전은 무엇이 다른가요?",
    difference: "색상 반전은 이미지의 색을 바꾸며 위치나 방향은 변경하지 않습니다. 좌우·상하 반전은 원래 색을 유지한 채 이미지의 방향을 바꿉니다.",
    invert: "색상을 변경",
    flipH: "좌우 방향을 변경",
    flipV: "상하 방향을 변경",
    worksTitle: "이미지 색상 반전의 원리",
    works: "디지털 이미지는 보통 0부터 255까지의 빨강, 초록, 파랑 값으로 색을 표현합니다. 100% 반전에서는 선택한 채널을 255에서 원래 값을 뺀 값으로 바꿉니다. 예를 들어 RGB(255, 0, 0)은 RGB(0, 255, 255)가 되어 빨강이 시안으로 바뀝니다.",
    privacyTitle: "브라우저에서만 처리되는 이미지",
    privacy: "이미지 반전, 미리보기, 다운로드 파일 생성은 브라우저에서 직접 이루어집니다. 반전 효과를 적용하기 위해 파일을 서버에 업로드할 필요가 없습니다.",
    cta: "내 이미지 색상 반전하기",
  },
  ja: {
    examplesTitle: "画像の色反転でどう変わるか",
    examplesIntro: "画像の色反転は各色を反対の値に置き換え、元画像のネガ版を作ります。上のツールに自分の画像を追加すると、同じ変化をすぐに確認できます。",
    before: "反転前",
    after: "反転後",
    examples: [
      { title: "写真をネガ画像にする", before: "元画像", after: "色反転", description: "明るい部分は暗く、暗い部分は明るくなり、色は補色側へ変わってネガ風の効果になります。", note: "上のツールで写真を選び、反転の強さを調整しながら結果を比較できます。" },
      { title: "スキャンしたフィルムネガを確認", before: "フィルムネガ", after: "反転プレビュー", description: "単純な色反転は、スキャンしたフィルムネガの内容を追加編集の前に素早く確認する用途に使えます。", note: "RGB反転は簡易プレビューです。正確なカラーネガ変換にはオレンジマスクなどフィルム特性の補正が必要な場合があります。" },
      { title: "淡いディテールを確認", before: "元画像", after: "色反転", description: "明暗の関係を変えることで、元画像にある細い線や輪郭、低コントラストの細部を見やすくできる場合があります。", note: "色反転は失われた情報を復元しません。既存のピクセル値を反対に表示する処理です。" },
    ],
    meaningTitle: "画像の色を反転するとは？",
    meaning: "画像の色反転とは、各色の値を反対に変える処理です。写真のネガに似た効果になり、白は黒、黒は白へ変わり、RGBの色は補色側へ移ります。",
    usefulTitle: "画像の色反転はどんなときに便利ですか？",
    uses: [
      ["ネガ効果を作る", "アートやグラフィックにネガ風の表現が必要なときは、上のツールに写真を追加してすぐに試せます。"],
      ["スキャンしたフィルムネガを確認する", "正確な色補正を行う前に、フィルムの内容を素早く見るためのプレビューとして使えます。"],
      ["淡い線や低コントラストを確認する", "反転設定で細部と背景の見え方を変えられますが、失われた情報を復元する機能ではありません。"],
      ["線画やスキャン文書を確認する", "明るい文書や線画を暗い背景へ変え、状況に応じて見やすくできます。"],
      ["クリエイティブな画像編集", "強さ、RGBチャンネル、色相、彩度、明るさ、コントラストを調整して効果を整えられます。"],
    ],
    differenceTitle: "色反転と左右・上下反転の違いは？",
    difference: "色反転は画像の色を変え、位置や向きは変えません。左右・上下反転は元の色を保ったまま画像の向きを変えます。",
    invert: "色を変更",
    flipH: "左右の向きを変更",
    flipV: "上下の向きを変更",
    worksTitle: "画像の色反転の仕組み",
    works: "デジタル画像は一般に0〜255の赤・緑・青の値で色を表します。100%反転では、選択した各チャンネルを255から元の値を引いた値へ置き換えます。RGB(255, 0, 0)はRGB(0, 255, 255)となり、赤はシアンに変わります。",
    privacyTitle: "ブラウザ内で完結する画像処理",
    privacy: "色反転、プレビュー、ダウンロードファイルの作成はブラウザ内で直接行われます。反転処理のために画像をサーバーへアップロードする必要はありません。",
    cta: "自分の画像で色反転を試す",
  },
} as const;

const examples = [
  ["/examples/invert-landscape-original.svg", "/examples/invert-landscape-result.svg", "landscape"],
  ["/examples/invert-film-original.svg", "/examples/invert-film-result.svg", "film"],
  ["/examples/invert-lines-original.svg", "/examples/invert-lines-result.svg", "lines"],
] as const;

export function InvertSeoGuide({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <>
    <section className="support-section invert-examples" aria-labelledby="invert-examples-title">
      <h2 id="invert-examples-title">{t.examplesTitle}</h2>
      <p className="section-intro">{t.examplesIntro}</p>
      <div className="invert-example-grid">
        {t.examples.map((item, index) => <article key={item.title}>
          <h3>{item.title}</h3>
          <div className="invert-example-pair">
            <figure><Image src={examples[index][0]} width={480} height={300} alt={`${item.before} ${examples[index][2]} before color inversion`} /><figcaption>{t.before}: {item.before}</figcaption></figure>
            <figure><Image src={examples[index][1]} width={480} height={300} alt={`${item.after} ${examples[index][2]} after color inversion`} /><figcaption>{t.after}: {item.after}</figcaption></figure>
          </div>
          <p>{item.description}</p><small>{item.note}</small>
        </article>)}
      </div>
    </section>
    <section className="support-section invert-definition" aria-labelledby="invert-meaning-title">
      <h2 id="invert-meaning-title">{t.meaningTitle}</h2><p>{t.meaning}</p>
      <div className="color-inversion-map" aria-label={t.meaningTitle}><span>White → Black</span><span>Black → White</span><span>Red → Cyan</span><span>Green → Magenta</span><span>Blue → Yellow</span></div>
    </section>
    <section className="support-section" aria-labelledby="invert-useful-title">
      <h2 id="invert-useful-title">{t.usefulTitle}</h2>
      <div className="practical-grid">{t.uses.map(([heading, body]) => <article key={heading}><h3>{heading}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className="support-section" aria-labelledby="invert-difference-title">
      <h2 id="invert-difference-title">{t.differenceTitle}</h2><p className="section-intro">{t.difference}</p>
      <dl className="invert-difference-grid"><div><dt>Invert</dt><dd>{t.invert}</dd></div><div><dt>Flip horizontally</dt><dd>{t.flipH}</dd></div><div><dt>Flip vertically</dt><dd>{t.flipV}</dd></div></dl>
    </section>
    <section className="support-section" aria-labelledby="invert-works-title"><h2 id="invert-works-title">{t.worksTitle}</h2><p className="section-intro">{t.works}</p><code className="invert-formula">Inverted RGB = (255 − R, 255 − G, 255 − B)</code></section>
    <section className="support-section invert-privacy" aria-labelledby="invert-privacy-title"><h2 id="invert-privacy-title">{t.privacyTitle}</h2><p>{t.privacy}</p><a className="primary-btn invert-return-cta" href="#invert-tool">{t.cta}</a></section>
  </>;
}
