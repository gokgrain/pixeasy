import type { Locale } from "@/lib/i18n";
import type { ToolKind } from "@/components/image-tool";

export type ToolSeoContent = {
  useCases: string[];
  faqLead: { question: string; answer: string };
  steps: string[];
  practical: { heading: string; body: string }[];
  extraFaqs: { question: string; answer: string }[];
  related: ToolKind[];
};

type ToolSeoContentCore = Omit<ToolSeoContent, "useCases" | "faqLead">;

const useCases: Record<Locale, Record<ToolKind, string[]>> = {
  en: {
    compress: ["Meet a website or online form upload limit.", "Reduce a photo before attaching it to an email.", "Prepare image files for an online application.", "Make high-resolution smartphone photos easier to share.", "Save storage space while keeping practical visual quality.", "Match a specific KB or MB file-size requirement."],
    "jpg-png": ["Keep logos, text, and graphic edges clear in a PNG file.", "Prepare an image for transparent-background editing.", "Avoid another round of JPG compression during later edits.", "Create PNG assets for a design or interface project.", "Convert an image before intentionally removing a light background."],
    "png-jpg": ["Reduce the size of photographic images used on a website.", "Create a file that is easier to upload to common forms.", "Replace transparency with a chosen background for general photo use.", "Prepare a smaller image for an email attachment.", "Help image-heavy pages load faster."],
    resize: ["Fit an image neatly into a blog post or article.", "Match the pixel dimensions requested by an online marketplace.", "Prepare a profile or account photo.", "Fit an image into a presentation slide.", "Adjust dimensions before printing or placing in a document."],
    grayscale: ["Inspect contrast without color influencing the result.", "Prepare an image for black-and-white printing.", "Create a restrained monochrome visual style.", "Reduce color distractions while editing a composition.", "Compare lighting and tonal balance more clearly."],
    invert: ["View photographed or scanned film negatives more easily.", "Improve the readability of some scanned documents.", "Reveal different details in dark or low-contrast images.", "Check contrast while editing graphics.", "Create an intentional inverted-color effect."],
  },
  ko: {
    compress: ["웹사이트나 온라인 양식의 업로드 용량 제한을 맞출 때", "이메일에 첨부하기 전에 사진 용량을 줄일 때", "온라인 지원서에 넣을 이미지 파일을 준비할 때", "고화질 스마트폰 사진을 더 가볍게 공유할 때", "실용적인 화질을 유지하며 저장 공간을 줄일 때", "정해진 KB 또는 MB 용량에 맞춰야 할 때"],
    "jpg-png": ["로고, 글자, 그래픽 윤곽을 PNG로 선명하게 보관할 때", "투명 배경 편집을 시작하기 전에 이미지를 준비할 때", "반복 편집 과정에서 JPG 재압축을 피하고 싶을 때", "디자인 작업에 사용할 PNG 파일이 필요할 때", "밝은 배경을 제거하기 전에 형식을 변환할 때"],
    "png-jpg": ["웹사이트에 사용할 사진 이미지의 용량을 줄일 때", "온라인 양식에 더 쉽게 올릴 수 있는 파일이 필요할 때", "투명 영역에 배경색을 넣어 일반 사진처럼 사용할 때", "이메일 첨부용 이미지를 가볍게 준비할 때", "이미지가 많은 페이지의 로딩 부담을 줄일 때"],
    resize: ["블로그나 게시글에 맞는 이미지 크기를 만들 때", "온라인 판매 페이지의 업로드 규격을 맞출 때", "프로필 사진을 원하는 픽셀 크기로 준비할 때", "프레젠테이션 슬라이드에 이미지를 맞출 때", "인쇄하거나 문서에 넣기 전에 크기를 조정할 때"],
    grayscale: ["색상의 영향 없이 이미지 명암을 분석할 때", "흑백 인쇄용 이미지를 준비할 때", "차분한 모노크롬 효과를 만들 때", "편집 중 색상으로 인한 시각적 방해를 줄일 때", "조명과 밝기 균형을 더 분명하게 비교할 때"],
    invert: ["필름 네거티브를 보기 쉬운 색상으로 확인할 때", "스캔 문서의 글자와 배경 구분을 개선해 볼 때", "어둡거나 대비가 낮은 이미지의 다른 디테일을 찾을 때", "그래픽 편집 중 명암 대비를 점검할 때", "의도적인 색상 반전 효과를 만들 때"],
  },
  ja: {
    compress: ["Webサイトやオンラインフォームの容量制限に合わせるとき", "メールに添付する前に写真を軽くしたいとき", "オンライン応募用の画像ファイルを準備するとき", "高画質のスマートフォン写真を共有しやすくするとき", "実用的な画質を保ちながら保存容量を減らすとき", "指定されたKBまたはMBに合わせるとき"],
    "jpg-png": ["ロゴ、文字、グラフィックの輪郭を鮮明に保存したいとき", "透明背景の編集を始める前に画像を準備するとき", "繰り返し編集でJPGの再圧縮を避けたいとき", "デザイン制作に使うPNG素材が必要なとき", "明るい背景を削除する前に形式を変換するとき"],
    "png-jpg": ["Webサイト用の写真画像を軽くしたいとき", "一般的なフォームへアップロードしやすくするとき", "透明部分に背景色を入れて通常の写真として使うとき", "メール添付用の画像を小さくしたいとき", "画像の多いページを読み込みやすくしたいとき"],
    resize: ["ブログ記事に合う画像サイズへ整えるとき", "オンライン販売ページの指定寸法に合わせるとき", "プロフィール画像を必要なピクセル数で準備するとき", "プレゼンテーションのスライドへ画像を収めるとき", "印刷や文書への配置前に寸法を調整するとき"],
    grayscale: ["色に左右されず画像のコントラストを確認するとき", "白黒印刷用の画像を準備するとき", "落ち着いたモノクロ表現を作るとき", "編集時の色による視覚的な影響を減らすとき", "光と明暗のバランスを比較するとき"],
    invert: ["撮影またはスキャンしたフィルムネガを見やすくするとき", "スキャン文書の文字を読みやすくできるか確認するとき", "暗い画像や低コントラスト画像の別の細部を見るとき", "グラフィック編集でコントラストを点検するとき", "意図的な色反転エフェクトを作るとき"],
  },
};

const faqLeads: Record<Locale, Record<ToolKind, ToolSeoContent["faqLead"]>> = {
  en: {
    compress: { question: "When should I compress an image to a target size?", answer: "Use target-size compression when a form, website, email, or application requires an image below a specific KB or MB limit." },
    "jpg-png": { question: "When should I convert JPG to PNG?", answer: "Convert to PNG when you need crisp graphic edges, a lossless editing file, or the option to create a transparent background." },
    "png-jpg": { question: "When should I convert PNG to JPG?", answer: "Convert photographic PNG files to JPG when transparency is not needed and a smaller, widely accepted image file is more useful." },
    resize: { question: "When should I resize an image instead of compressing it?", answer: "Resize when a page, slide, profile, print layout, or upload form requires specific pixel dimensions." },
    grayscale: { question: "When is grayscale more useful than color?", answer: "Grayscale helps when checking contrast and lighting, preparing black-and-white printing, or creating a monochrome visual style." },
    invert: { question: "When should I invert image colors?", answer: "Invert colors to inspect film negatives, test graphic contrast, explore dark-image detail, or create a deliberate negative effect." },
  },
  ko: {
    compress: { question: "목표 용량 이미지 압축은 언제 필요한가요?", answer: "온라인 양식, 웹사이트, 이메일, 지원서에서 특정 KB 또는 MB 이하의 이미지가 필요할 때 사용하세요." },
    "jpg-png": { question: "JPG를 PNG로 변환해야 하는 경우는 언제인가요?", answer: "그래픽 윤곽을 선명하게 유지하거나 무손실 편집 파일, 투명 배경 작업용 이미지가 필요할 때 적합합니다." },
    "png-jpg": { question: "PNG를 JPG로 변환해야 하는 경우는 언제인가요?", answer: "투명도가 필요 없는 사진형 PNG를 더 작고 폭넓게 사용할 수 있는 이미지 파일로 만들 때 유용합니다." },
    resize: { question: "이미지 압축 대신 크기 조절이 필요한 경우는 언제인가요?", answer: "게시글, 슬라이드, 프로필, 인쇄물, 업로드 양식에서 정확한 픽셀 크기를 요구할 때 사용하세요." },
    grayscale: { question: "컬러보다 흑백 이미지가 유용한 경우는 언제인가요?", answer: "명암과 조명을 확인하거나 흑백 인쇄를 준비할 때, 모노크롬 분위기를 만들 때 유용합니다." },
    invert: { question: "이미지 색상 반전은 언제 사용하면 좋나요?", answer: "필름 네거티브를 확인하거나 그래픽 대비를 점검할 때, 어두운 이미지의 다른 디테일이나 네거티브 효과를 보고 싶을 때 사용하세요." },
  },
  ja: {
    compress: { question: "画像を目標容量へ圧縮するのはどんなときですか？", answer: "フォーム、Webサイト、メール、応募書類などで指定のKBまたはMB以下にする必要があるときに使います。" },
    "jpg-png": { question: "JPGをPNGへ変換するのはどんなときですか？", answer: "グラフィックの輪郭を鮮明に保ちたいとき、可逆編集や透明背景の作業用ファイルが必要なときに適しています。" },
    "png-jpg": { question: "PNGをJPGへ変換するのはどんなときですか？", answer: "透明度が不要な写真系PNGを、より小さく一般的に扱いやすい画像へ変えたいときに便利です。" },
    resize: { question: "圧縮ではなく画像サイズ変更が必要なのはどんなときですか？", answer: "記事、スライド、プロフィール、印刷物、アップロードフォームで指定ピクセル寸法が必要なときに使います。" },
    grayscale: { question: "カラーよりグレースケールが役立つのはどんなときですか？", answer: "コントラストや光を確認するとき、白黒印刷の準備、モノクロ表現の作成に役立ちます。" },
    invert: { question: "画像の色反転はどんなときに使いますか？", answer: "フィルムネガの確認、グラフィックのコントラスト点検、暗い画像の別の細部確認、ネガ効果の作成に使えます。" },
  },
};

const content: Record<Locale, Record<ToolKind, ToolSeoContentCore>> = {
  en: {
    compress: {
      steps: ["Upload a large photo or image.", "Choose the target file size.", "Compress and download the result."],
      practical: [
        { heading: "How target-size compression works", body: "JPG and WebP are encoded repeatedly with an adaptive quality search. PixEasy keeps the best practical result at or below the target, and can reduce dimensions proportionally when quality changes alone are not enough." },
        { heading: "Quality and dimensions", body: "Lower quality can reduce photographic detail without changing pixel dimensions. Dimension reduction removes pixels but can achieve much smaller files while preserving the original aspect ratio." },
        { heading: "PNG and transparency", body: "PNG uses lossless compression and can preserve transparency, so its size may not fall as much as JPG or WebP. Format conversion is optional and never happens without your selection." },
        { heading: "Why smartphone photos are large", body: "Modern phones capture many megapixels and retain substantial color and detail. That is useful for editing and printing, but often more data than an online form, email, or profile image needs." },
        { heading: "Private browser processing", body: "The source image is decoded and compressed locally in your browser. It is not uploaded, stored, or sent to an external image-processing service." },
      ],
      extraFaqs: [
        { question: "Can I compress high-resolution smartphone photos?", answer: "Yes, when your device has enough memory. Very large images may work better in a desktop browser." },
        { question: "What happens if the target cannot be reached?", answer: "PixEasy shows the closest achievable result and clearly marks that the target was not reached." },
      ],
      related: ["resize", "jpg-png", "png-jpg", "grayscale", "invert"],
    },
    "jpg-png": {
      steps: ["Upload a JPG or JPEG image.", "Choose Standard PNG or Transparent PNG.", "Check the preview and download the PNG."],
      practical: [
        { heading: "When PNG is useful", body: "PNG is a good choice for logos, interface graphics, screenshots, and images that may need transparency. It uses lossless compression, so saving the converted file again does not introduce another round of JPG compression." },
        { heading: "Conversion does not restore lost detail", body: "A JPG has already discarded some image data. Converting it to PNG preserves the pixels currently visible, but it cannot recreate detail removed by the original JPG compression." },
        { heading: "Transparency is optional", body: "Standard PNG keeps every white and off-white pixel. Choose Transparent PNG only when you intentionally want to remove a light background, then adjust the tolerance while checking the checkerboard preview." },
      ],
      extraFaqs: [
        { question: "Does converting JPG to PNG improve image quality?", answer: "No. It prevents additional JPG compression in the new file, but it cannot restore detail already lost from the source JPG." },
        { question: "Can a JPG become transparent after conversion?", answer: "Yes, when you explicitly choose Transparent PNG. Standard PNG keeps the original background and all white objects unchanged." },
      ],
      related: ["png-jpg", "resize", "grayscale", "invert"],
    },
    "png-jpg": {
      steps: ["Upload a PNG image.", "Choose a background color and JPG quality.", "Review the result and download the JPG."],
      practical: [
        { heading: "Why convert PNG to JPG", body: "JPG is widely accepted by websites, forms, email services, and social platforms. Photographic images can also be smaller as JPG files, depending on the selected quality and the source artwork." },
        { heading: "How transparency is handled", body: "JPG cannot store transparent pixels. PixEasy places the white, black, or custom background you select behind transparent areas before creating the JPG." },
        { heading: "Choosing a quality setting", body: "A higher setting keeps more visual detail but usually creates a larger file. The 90% default is a practical starting point; inspect edges, text, and gradients in the preview before downloading." },
      ],
      extraFaqs: [
        { question: "Can JPG files have a transparent background?", answer: "No. The JPG format has no transparency channel, so transparent PNG areas must be filled with a background color." },
        { question: "Does PNG to JPG reduce file size?", answer: "It often does for photographs, but the result depends on image content, dimensions, and the quality setting you choose." },
      ],
      related: ["jpg-png", "resize", "grayscale", "invert"],
    },
    resize: {
      steps: ["Upload a JPG, PNG, or WebP image.", "Set a width, height, or exact dimensions.", "Preview the resized image and download it."],
      practical: [
        { heading: "Preserving proportions", body: "Set only the width or height when you want PixEasy to calculate the other dimension from the original aspect ratio. This avoids accidental stretching or squeezing." },
        { heading: "Using exact dimensions", body: "Exact mode is useful when a form, marketplace, or layout requires a fixed pixel size. If that size has a different aspect ratio, the image will be reshaped to fit the dimensions you enter." },
        { heading: "Upscaling and sharpness", body: "Making an image larger creates new pixels but cannot add original camera detail. For the cleanest result, start with the largest available source and avoid enlarging more than necessary." },
      ],
      extraFaqs: [
        { question: "Will resizing change the aspect ratio?", answer: "Width or height mode preserves it automatically. Exact mode uses both dimensions exactly and may change the proportions." },
        { question: "Can resizing make a small image sharper?", answer: "No. Enlarging increases pixel dimensions but cannot recreate detail that was not present in the source." },
      ],
      related: ["jpg-png", "png-jpg", "grayscale", "invert"],
    },
    grayscale: {
      steps: ["Upload a JPG, PNG, or WebP image.", "Select Grayscale and choose an output format.", "Compare the result and download it."],
      practical: [
        { heading: "How the grayscale result is calculated", body: "PixEasy uses weighted luminance instead of averaging red, green, and blue equally. This better reflects how people perceive brightness and keeps the result visually balanced." },
        { heading: "PNG or JPG output", body: "Choose PNG when transparency or crisp graphic edges matter. JPG is often convenient for photographs and lets you adjust quality to balance detail and file size." },
        { heading: "Useful reasons to remove color", body: "Grayscale can simplify a busy image, create a classic monochrome look, prepare a reference image, or help you inspect contrast without the influence of hue." },
      ],
      extraFaqs: [
        { question: "Is grayscale the same as pure black and white?", answer: "Not exactly. Grayscale contains many shades between black and white, preserving more tonal detail than a two-color image." },
        { question: "Can I switch back to the original preview?", answer: "Yes. Use the Original option to compare the source with the grayscale result before downloading." },
      ],
      related: ["invert", "resize", "jpg-png", "png-jpg"],
    },
    invert: {
      steps: ["Upload a JPG, PNG, or WebP image.", "Select Invert and choose an output format.", "Check the color-negative preview and download it."],
      practical: [
        { heading: "What color inversion does", body: "Each red, green, and blue channel is replaced with its opposite value. Light areas become dark, dark areas become light, and colors shift to their digital complements." },
        { heading: "Common uses", body: "An inverted image can create a photographic-negative effect, reveal contrast in technical images, or provide a fast starting point for experimental graphics and artwork." },
        { heading: "Output and transparency", body: "PNG output can preserve transparent pixels, while JPG output places the image in a non-transparent format. Compare the live result before choosing the file you need." },
      ],
      extraFaqs: [
        { question: "Does inverting an image damage the original file?", answer: "No. PixEasy creates a separate result in your browser and does not modify the source file on your device." },
        { question: "Can I invert the image back to its original colors?", answer: "Applying the same inversion again returns the color values to their original state, apart from any separate lossy JPG encoding." },
      ],
      related: ["grayscale", "resize", "jpg-png", "png-jpg"],
    },
  },
  ko: {
    compress: {
      steps: ["고화질 사진이나 큰 이미지를 선택합니다.", "원하는 목표 파일 용량을 선택합니다.", "압축한 뒤 결과를 다운로드합니다."],
      practical: [
        { heading: "목표 용량 압축 방식", body: "JPG와 WebP는 적응형 품질 탐색으로 여러 품질을 비교해 목표 이하의 가장 좋은 실용적 결과를 찾습니다. 품질만으로 부족하면 가로세로 비율을 유지하며 픽셀 크기를 줄일 수 있습니다." },
        { heading: "품질과 이미지 크기의 차이", body: "품질을 낮추면 픽셀 크기는 유지하면서 사진의 세부 표현이 줄어듭니다. 픽셀 크기를 줄이면 이미지 자체가 작아지지만 훨씬 작은 파일을 만들 수 있습니다." },
        { heading: "PNG와 투명도", body: "PNG는 무손실 압축과 투명도를 유지할 수 있어 JPG나 WebP만큼 용량이 줄지 않을 수 있습니다. 형식 변환은 사용자가 직접 선택한 경우에만 진행됩니다." },
        { heading: "스마트폰 사진 용량이 큰 이유", body: "최근 스마트폰은 높은 픽셀 수와 풍부한 색상 정보를 저장합니다. 편집과 인쇄에는 유용하지만 온라인 양식, 이메일, 프로필 이미지에는 필요 이상으로 큰 데이터일 수 있습니다." },
        { heading: "기기에서만 처리", body: "원본 이미지 읽기와 압축은 브라우저에서 이루어집니다. 파일은 업로드되거나 저장되지 않고 외부 이미지 처리 서비스로 전송되지 않습니다." },
      ],
      extraFaqs: [
        { question: "고화질 스마트폰 사진도 압축할 수 있나요?", answer: "기기 메모리가 충분하면 가능합니다. 매우 큰 이미지는 데스크톱 브라우저에서 더 안정적으로 처리될 수 있습니다." },
        { question: "목표 용량에 도달하지 못하면 어떻게 되나요?", answer: "가장 가까운 결과를 표시하고 목표를 달성하지 못했다는 사실을 명확하게 안내합니다." },
      ],
      related: ["resize", "jpg-png", "png-jpg", "grayscale", "invert"],
    },
    "jpg-png": {
      steps: ["JPG 또는 JPEG 이미지를 선택합니다.", "일반 PNG 또는 투명 PNG를 선택합니다.", "미리보기를 확인하고 PNG를 다운로드합니다."],
      practical: [
        { heading: "PNG가 유용한 경우", body: "PNG는 로고, 화면 캡처, UI 그래픽처럼 선명한 경계가 중요하거나 투명 배경이 필요한 이미지에 적합합니다. 무손실 압축을 사용하므로 변환 후 다시 저장해도 JPG 압축이 추가되지 않습니다." },
        { heading: "변환으로 원본 화질이 좋아지지는 않습니다", body: "JPG에 이미 손실된 세부 정보는 PNG로 바꿔도 복원되지 않습니다. 변환은 현재 보이는 픽셀을 PNG 형식으로 보존하는 작업입니다." },
        { heading: "배경 투명화는 선택 사항입니다", body: "일반 PNG는 흰색 물체와 미색 픽셀까지 그대로 유지합니다. 밝은 배경을 없애려는 경우에만 투명 PNG를 선택하고 체크무늬 미리보기를 보며 허용 범위를 조절하세요." },
      ],
      extraFaqs: [
        { question: "JPG를 PNG로 변환하면 화질이 좋아지나요?", answer: "아니요. 이후 JPG 재압축은 피할 수 있지만 원본 JPG에서 이미 손실된 디테일은 복원되지 않습니다." },
        { question: "JPG PNG 변환 후 배경을 투명하게 만들 수 있나요?", answer: "네. 투명 PNG를 직접 선택한 경우에만 밝은 배경을 제거합니다. 일반 PNG는 원본 배경을 유지합니다." },
      ],
      related: ["png-jpg", "resize", "grayscale", "invert"],
    },
    "png-jpg": {
      steps: ["PNG 이미지를 선택합니다.", "배경색과 JPG 품질을 설정합니다.", "결과를 확인하고 JPG를 다운로드합니다."],
      practical: [
        { heading: "PNG를 JPG로 바꾸는 이유", body: "JPG는 웹사이트, 온라인 양식, 이메일, SNS에서 폭넓게 지원됩니다. 사진 중심의 PNG는 품질 설정에 따라 JPG로 변환했을 때 파일 크기가 줄어들 수 있습니다." },
        { heading: "투명 영역 처리 방식", body: "JPG는 투명도를 저장할 수 없습니다. PixEasy는 사용자가 선택한 흰색, 검은색 또는 사용자 지정 색상을 투명한 픽셀 뒤에 배치한 후 JPG를 만듭니다." },
        { heading: "품질 설정 선택", body: "품질을 높이면 세부 표현이 더 많이 남지만 파일이 커질 수 있습니다. 기본값 90%에서 시작해 글자, 윤곽선, 그라데이션을 미리보기로 확인하세요." },
      ],
      extraFaqs: [
        { question: "JPG도 투명 배경을 지원하나요?", answer: "아니요. JPG에는 투명도 채널이 없어 투명 영역을 선택한 배경색으로 채워야 합니다." },
        { question: "PNG를 JPG로 바꾸면 용량이 줄어드나요?", answer: "사진은 줄어드는 경우가 많지만 이미지 내용, 픽셀 크기, 선택한 품질에 따라 달라집니다." },
      ],
      related: ["jpg-png", "resize", "grayscale", "invert"],
    },
    resize: {
      steps: ["JPG, PNG 또는 WebP 이미지를 선택합니다.", "너비, 높이 또는 정확한 크기를 입력합니다.", "미리보기를 확인하고 결과를 다운로드합니다."],
      practical: [
        { heading: "원본 비율 유지하기", body: "너비 또는 높이 모드를 사용하면 나머지 값이 원본 가로세로 비율에 맞게 자동 계산됩니다. 이미지가 의도치 않게 늘어나거나 눌리는 것을 피할 수 있습니다." },
        { heading: "정확한 크기가 필요한 경우", body: "온라인 양식, 쇼핑몰, 레이아웃처럼 고정 픽셀 규격이 있을 때는 정확한 크기 모드를 사용하세요. 원본과 비율이 다르면 입력한 크기에 맞게 형태가 바뀝니다." },
        { heading: "확대와 선명도", body: "작은 이미지를 크게 만들면 픽셀 수는 늘지만 원본에 없던 디테일이 생기지는 않습니다. 가능한 한 큰 원본을 사용하고 필요한 범위만 확대하는 것이 좋습니다." },
      ],
      extraFaqs: [
        { question: "크기 변경 시 가로세로 비율이 유지되나요?", answer: "너비 또는 높이 모드에서는 자동으로 유지됩니다. 정확한 크기 모드는 두 값을 그대로 적용합니다." },
        { question: "작은 이미지를 키우면 선명해지나요?", answer: "아니요. 픽셀 크기는 커지지만 원본에 없던 세부 정보까지 복원되지는 않습니다." },
      ],
      related: ["jpg-png", "png-jpg", "grayscale", "invert"],
    },
    grayscale: {
      steps: ["JPG, PNG 또는 WebP 이미지를 선택합니다.", "흑백 효과와 출력 형식을 선택합니다.", "원본과 결과를 비교하고 다운로드합니다."],
      practical: [
        { heading: "자연스러운 흑백 변환 방식", body: "PixEasy는 빨강, 초록, 파랑을 단순 평균하지 않고 사람이 느끼는 밝기에 가까운 가중치를 적용합니다. 밝고 어두운 부분의 균형이 자연스럽게 유지됩니다." },
        { heading: "PNG와 JPG 선택", body: "투명도나 그래픽 윤곽이 중요하면 PNG가 적합합니다. 사진은 JPG로 저장할 수 있으며 품질을 조절해 세부 표현과 파일 크기의 균형을 맞출 수 있습니다." },
        { heading: "흑백 이미지 활용", body: "복잡한 색을 단순화하거나 클래식한 분위기를 만들 때, 참고 이미지를 준비할 때, 색상의 영향 없이 명암 대비를 확인할 때 유용합니다." },
      ],
      extraFaqs: [
        { question: "그레이스케일과 완전한 흑백 이미지는 같은가요?", answer: "다릅니다. 그레이스케일은 검정과 흰색 사이의 여러 회색 단계를 사용해 더 많은 명암 정보를 유지합니다." },
        { question: "변환 전에 원본과 비교할 수 있나요?", answer: "네. 원본 옵션을 선택해 흑백 결과와 비교한 뒤 다운로드할 수 있습니다." },
      ],
      related: ["invert", "resize", "jpg-png", "png-jpg"],
    },
    invert: {
      steps: ["JPG, PNG 또는 WebP 이미지를 선택합니다.", "색상 반전과 출력 형식을 선택합니다.", "네거티브 결과를 확인하고 다운로드합니다."],
      practical: [
        { heading: "색상 반전 원리", body: "빨강, 초록, 파랑 채널의 값을 각각 반대 값으로 바꿉니다. 밝은 부분은 어두워지고 어두운 부분은 밝아지며 색상은 디지털 보색으로 변합니다." },
        { heading: "활용 방법", body: "필름 네거티브와 비슷한 표현을 만들거나 기술 이미지의 대비를 확인할 때, 실험적인 그래픽과 창작 이미지의 출발점을 만들 때 사용할 수 있습니다." },
        { heading: "출력 형식과 투명도", body: "PNG 출력은 투명 픽셀을 유지할 수 있고 JPG는 투명도를 지원하지 않습니다. 실시간 결과를 비교한 뒤 필요한 형식을 선택하세요." },
      ],
      extraFaqs: [
        { question: "색상 반전이 원본 파일을 변경하나요?", answer: "아니요. 브라우저에서 별도의 결과를 만들며 기기에 저장된 원본 파일은 수정하지 않습니다." },
        { question: "반전된 이미지를 다시 원래 색으로 돌릴 수 있나요?", answer: "같은 반전을 한 번 더 적용하면 색상 값은 원래 상태로 돌아옵니다. 단, 별도의 JPG 압축 손실은 제외됩니다." },
      ],
      related: ["grayscale", "resize", "jpg-png", "png-jpg"],
    },
  },
  ja: {
    compress: {
      steps: ["高画質写真または大きな画像を選びます。", "目標ファイルサイズを選びます。", "圧縮して結果をダウンロードします。"],
      practical: [
        { heading: "目標サイズ圧縮の仕組み", body: "JPGとWebPは適応型品質検索で複数の品質を比較し、目標以下で実用的な最良結果を探します。品質だけで足りない場合は縦横比を保って寸法を縮小できます。" },
        { heading: "品質と画像寸法の違い", body: "品質を下げるとピクセル寸法を保ちながら写真の細部が減ります。寸法を縮小するとピクセル数は減りますが、より小さいファイルを作れます。" },
        { heading: "PNGと透明度", body: "PNGは可逆圧縮と透明度を保持できるため、JPGやWebPほど小さくならない場合があります。形式変換はユーザーが明示的に選んだ場合だけ行います。" },
        { heading: "スマートフォン写真が大きい理由", body: "最近のスマートフォンは多くのピクセルと豊富な色情報を保存します。編集や印刷には便利ですが、フォーム、メール、プロフィール画像には必要以上に大きい場合があります。" },
        { heading: "端末内で処理", body: "元画像の読み込みと圧縮はブラウザ内で行われます。ファイルはアップロード、保存、外部画像処理サービスへの送信をされません。" },
      ],
      extraFaqs: [
        { question: "高画質のスマートフォン写真も圧縮できますか？", answer: "端末に十分なメモリがあれば可能です。非常に大きい画像はデスクトップブラウザのほうが安定します。" },
        { question: "目標サイズに到達できない場合は？", answer: "最も近い結果を表示し、目標未達であることを明確に案内します。" },
      ],
      related: ["resize", "jpg-png", "png-jpg", "grayscale", "invert"],
    },
    "jpg-png": {
      steps: ["JPGまたはJPEG画像を選択します。", "標準PNGまたは透過PNGを選びます。", "プレビューを確認してPNGを保存します。"],
      practical: [
        { heading: "PNGが適している画像", body: "PNGはロゴ、スクリーンショット、UI素材など、輪郭の鮮明さや透明背景が必要な画像に向いています。可逆圧縮のため、変換後のファイルに新たなJPG圧縮は加わりません。" },
        { heading: "変換しても失われた画質は戻りません", body: "元のJPGですでに失われた細部は、PNGへ変換しても復元できません。変換は現在見えているピクセルをPNG形式で保持する処理です。" },
        { heading: "背景の透過は任意です", body: "標準PNGは白い物体や白に近い色もそのまま保持します。明るい背景を消したい場合だけ透過PNGを選び、チェック柄のプレビューを見ながら許容範囲を調整してください。" },
      ],
      extraFaqs: [
        { question: "JPGをPNGに変換すると画質は良くなりますか？", answer: "いいえ。新たなJPG再圧縮は避けられますが、元画像ですでに失われた細部は復元できません。" },
        { question: "JPGから透明なPNGを作れますか？", answer: "はい。透過PNGを明示的に選んだ場合だけ明るい背景を削除します。標準PNGは背景を保持します。" },
      ],
      related: ["png-jpg", "resize", "grayscale", "invert"],
    },
    "png-jpg": {
      steps: ["PNG画像を選択します。", "背景色とJPG品質を設定します。", "仕上がりを確認してJPGを保存します。"],
      practical: [
        { heading: "PNGをJPGにする場面", body: "JPGはWebサイト、フォーム、メール、SNSなどで広く利用できます。写真中心のPNGは、品質設定によってJPGのほうが小さくなる場合があります。" },
        { heading: "透明部分の扱い", body: "JPGは透明度を保存できません。PixEasyは選択した白、黒、またはカスタム色を透明部分の背景として配置してからJPGを作成します。" },
        { heading: "品質設定の選び方", body: "高い品質は細部を残しやすい一方、ファイルが大きくなる傾向があります。初期値の90%から始め、文字や輪郭、グラデーションをプレビューで確認してください。" },
      ],
      extraFaqs: [
        { question: "JPGは透明背景に対応していますか？", answer: "いいえ。JPGには透明度チャンネルがないため、透明部分を選択した背景色で塗りつぶします。" },
        { question: "PNGをJPGにすると容量は小さくなりますか？", answer: "写真では小さくなることが多いですが、画像内容、寸法、選択した品質によって変わります。" },
      ],
      related: ["jpg-png", "resize", "grayscale", "invert"],
    },
    resize: {
      steps: ["JPG、PNG、WebP画像を選択します。", "幅、高さ、または正確な寸法を設定します。", "プレビューを確認して保存します。"],
      practical: [
        { heading: "縦横比を保つ方法", body: "幅または高さモードでは、もう一方の値が元画像の縦横比から自動計算されます。意図しない引き伸ばしや押しつぶしを防げます。" },
        { heading: "正確な寸法を使う場合", body: "フォーム、ECサイト、レイアウトなどで固定ピクセルが指定されている場合に便利です。元画像と比率が異なると、入力した寸法に合わせて形が変わります。" },
        { heading: "拡大と鮮明さ", body: "小さな画像を大きくしても、元にない撮影情報は増えません。できるだけ大きな元画像を使い、必要以上の拡大を避けると自然な結果になります。" },
      ],
      extraFaqs: [
        { question: "サイズ変更で縦横比は維持されますか？", answer: "幅または高さモードでは自動的に維持されます。正確な寸法モードは入力した両方の値を使います。" },
        { question: "小さい画像を拡大すると鮮明になりますか？", answer: "いいえ。ピクセル寸法は増えますが、元画像に存在しない細部は復元できません。" },
      ],
      related: ["jpg-png", "png-jpg", "grayscale", "invert"],
    },
    grayscale: {
      steps: ["JPG、PNG、WebP画像を選択します。", "グレースケールと出力形式を選びます。", "元画像と比較して結果を保存します。"],
      practical: [
        { heading: "自然なグレースケールの計算", body: "PixEasyはRGBを単純に平均せず、人が感じる明るさに近い輝度の重み付けを使います。明部と暗部のバランスを保った自然な仕上がりになります。" },
        { heading: "PNGとJPGの選択", body: "透明度やグラフィックの輪郭が重要ならPNGが適しています。写真にはJPGも利用でき、品質を調整して細部と容量のバランスを取れます。" },
        { heading: "色を除く目的", body: "複雑な色を整理したいとき、クラシックなモノクロ表現を作りたいとき、色相の影響を受けずに明暗のコントラストを確認したいときに便利です。" },
      ],
      extraFaqs: [
        { question: "グレースケールと二値の白黒は同じですか？", answer: "同じではありません。グレースケールは黒から白まで多くの灰色を使い、より多くの階調を保持します。" },
        { question: "変換前に元画像と比較できますか？", answer: "はい。Originalを選択してグレースケールの結果と比較してから保存できます。" },
      ],
      related: ["invert", "resize", "jpg-png", "png-jpg"],
    },
    invert: {
      steps: ["JPG、PNG、WebP画像を選択します。", "色反転と出力形式を選びます。", "ネガ効果を確認して保存します。"],
      practical: [
        { heading: "色反転の仕組み", body: "赤、緑、青の各チャンネルを反対の値に置き換えます。明るい部分は暗く、暗い部分は明るくなり、色はデジタル上の補色へ変わります。" },
        { heading: "主な用途", body: "写真ネガのような表現、技術画像のコントラスト確認、実験的なグラフィックやアートワークの出発点などに利用できます。" },
        { heading: "出力形式と透明度", body: "PNG出力では透明ピクセルを保持できます。JPGは透明度に対応しません。ライブプレビューを比較して必要な形式を選んでください。" },
      ],
      extraFaqs: [
        { question: "色反転で元ファイルは変更されますか？", answer: "いいえ。ブラウザ内で別の結果を作成し、端末にある元ファイルは変更しません。" },
        { question: "反転画像を元の色に戻せますか？", answer: "同じ反転をもう一度適用すると色の値は元に戻ります。ただし、別途行われたJPG圧縮の影響は除きます。" },
      ],
      related: ["grayscale", "resize", "jpg-png", "png-jpg"],
    },
  },
};

export function getToolSeoContent(locale: Locale, kind: ToolKind) {
  return { ...content[locale][kind], useCases: useCases[locale][kind], faqLead: faqLeads[locale][kind] };
}
