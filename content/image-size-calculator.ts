import type { ToolKind } from "@/components/image-tool";
import type { Locale } from "@/lib/i18n";

export type CalculatorContent = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  cardDescription: string;
  ui: Record<string,string>;
  presetLabels: Record<string,string>;
  useCases: string[];
  steps: string[];
  practical: { heading:string; body:string }[];
  faqs: { question:string; answer:string }[];
  related: ToolKind[];
};

export const calculatorContent: Record<Locale,CalculatorContent> = {
  en: {
    title:"Image Size Calculator",
    seoTitle:"Image Size Calculator | Convert PX, MM, CM & Inches | PixEasy",
    seoDescription:"Convert pixels, mm, cm, and inches by PPI. Calculate print bleed and presets instantly, free in your browser.",
    description:"Convert pixels, millimeters, centimeters, and inches instantly. Calculate print size, PPI, and bleed without uploads, sign-up, or software.",
    cardDescription:"Convert px, mm, cm, inches, PPI, and print bleed.",
    ui:{
      calculator:"Size calculator",preset:"Preset",customSize:"Custom size",inputUnit:"Input unit",width:"Width",height:"Height",ppi:"PPI",customPpi:"Custom PPI",bleed:"Bleed on each side",none:"None",custom:"Custom",customBleed:"Custom bleed (mm)",results:"Calculated sizes",pixels:"Pixels",millimeters:"Millimeters",centimeters:"Centimeters",inches:"Inches",baseSize:"Trim size",bleedSize:"Size including bleed",ppiNote:"pixels per inch",bleedDifference:"Bleed difference calculator",currentBleed:"Current bleed",targetBleed:"New bleed",perSide:"Change on each side",horizontal:"Total width change",vertical:"Total height change",pixelDifference:"Pixel change per dimension",printPresets:"Print",digitalPresets:"Digital & screen",useful:"When is this useful?",how:"How to use",practical:"Helpful information",faq:"Frequently asked questions",related:"Related tools",trust:"Free · no login · no upload · browser calculation",mm:"mm",px:"px"
    },
    presetLabels:{a6:"A6",a5:"A5",a4:"A4",a3:"A3",a2:"A2",letter:"Letter",legal:"Legal","business-card":"Business Card","instagram-post":"Instagram Post","instagram-story":"Instagram Story","youtube-thumbnail":"YouTube Thumbnail","facebook-cover":"Facebook Cover","x-header":"X Header","linkedin-banner":"LinkedIn Banner",hd:"HD","full-hd":"Full HD","2k":"2K (DCI)","4k":"4K UHD","8k":"8K UHD"},
    useCases:["Convert pixels to millimeters or millimeters to pixels.","Match Figma, Illustrator, and Photoshop dimensions.","Calculate a 300 PPI image size for printing.","Add print bleed to a document or poster size.","Prepare business cards and other print artwork.","Check social media, web, HD, 4K, and 8K image sizes."],
    steps:["Choose a preset or enter width and height in px, mm, cm, or inches.","Select the required PPI and bleed on each side.","Read the converted trim size, bleed size, and pixel dimensions instantly."],
    practical:[
      {heading:"What is a pixel?",body:"A pixel is the smallest addressable picture element in a raster image. Pixel dimensions describe digital image resolution, not a fixed physical size."},
      {heading:"What is PPI?",body:"PPI means pixels per inch. It connects pixel dimensions to physical print dimensions: pixels = inches × PPI."},
      {heading:"Why is 300 PPI common?",body:"300 PPI is a widely used target for detailed print viewed at close range. The correct value still depends on the printer, material, viewing distance, and production specification."},
      {heading:"The web is not limited to 72 PPI",body:"Browsers primarily lay out raster images by CSS pixels and pixel dimensions. A 72 PPI metadata value does not automatically control how large an image appears on every screen."},
      {heading:"Illustrator and Figma units",body:"Illustrator can work with physical print units such as mm and inches, while Figma is primarily pixel-based. PPI is needed when translating a physical print size into raster pixels."},
      {heading:"Why print bleed matters",body:"Bleed extends artwork beyond the trim line so small cutting shifts do not leave white edges. Bleed is outside the final size and is not the same as the safe area inside the trim."},
    ],
    faqs:[
      {question:"What is PPI?",answer:"PPI means pixels per inch. It describes how many image pixels are assigned to one inch of physical output and is used to convert between pixel and print dimensions."},
      {question:"What does 300 PPI mean?",answer:"300 PPI means 300 image pixels are used for each inch of physical output. For example, a 4-inch-wide image needs 1,200 pixels at 300 PPI."},
      {question:"What is the difference between DPI and PPI?",answer:"PPI describes pixels in a digital image per inch. DPI describes printer dots placed per inch. They are related in print workflows but are not the same measurement."},
      {question:"What is bleed in printing?",answer:"Bleed is the extra artwork area that extends beyond the final trim size. It helps prevent unwanted white edges when the printed piece is cut. Adding 3 mm of bleed on every side increases both the total width and height by 6 mm. Always check your printer’s required bleed specification."},
      {question:"How many pixels is 3 mm of bleed?",answer:"At 300 PPI, 3 mm is about 35 pixels on each side. Bleed on both sides adds about 71 pixels to the total width and about 71 pixels to the total height."},
      {question:"How many pixels should I add when changing bleed from 2 mm to 3 mm?",answer:"The change adds 1 mm on each side. At 300 PPI that is about 12 pixels per side, or about 24 pixels to each total dimension."},
    ],
    related:["resize","compress","jpg-png","png-jpg","transparent-background"],
  },
  ko: {
    title:"이미지 크기 계산기",
    seoTitle:"이미지 크기 계산기 | px mm cm inch PPI 변환 | PixEasy",
    seoDescription:"px, mm, cm, inch를 PPI 기준으로 변환하고 인쇄 도련과 규격별 이미지 크기를 무료로 계산하세요.",
    description:"픽셀, 밀리미터, 센티미터, 인치를 즉시 변환하고 인쇄 크기와 PPI, 도련을 계산하세요. 업로드·로그인·설치 없이 브라우저에서 작동합니다.",
    cardDescription:"px, mm, cm, inch, PPI와 인쇄 도련을 계산합니다.",
    ui:{
      calculator:"크기 계산",preset:"프리셋",customSize:"직접 입력",inputUnit:"입력 단위",width:"가로",height:"세로",ppi:"PPI",customPpi:"사용자 지정 PPI",bleed:"사방 도련",none:"없음",custom:"직접 입력",customBleed:"사용자 지정 도련(mm)",results:"계산 결과",pixels:"픽셀",millimeters:"밀리미터",centimeters:"센티미터",inches:"인치",baseSize:"완성 크기",bleedSize:"도련 포함 크기",ppiNote:"인치당 픽셀",bleedDifference:"도련 차이 계산",currentBleed:"현재 도련",targetBleed:"변경할 도련",perSide:"한쪽 기준 변화",horizontal:"가로 전체 변화",vertical:"세로 전체 변화",pixelDifference:"한 변의 전체 픽셀 변화",printPresets:"인쇄",digitalPresets:"디지털·화면",useful:"이럴 때 유용합니다",how:"사용 방법",practical:"알아두면 좋은 정보",faq:"자주 묻는 질문",related:"관련 도구",trust:"무료 · 로그인 없음 · 업로드 없음 · 브라우저 계산",mm:"mm",px:"px"
    },
    presetLabels:{a6:"A6",a5:"A5",a4:"A4",a3:"A3",a2:"A2",letter:"Letter",legal:"Legal","business-card":"명함","instagram-post":"인스타그램 게시물","instagram-story":"인스타그램 스토리","youtube-thumbnail":"유튜브 썸네일","facebook-cover":"페이스북 커버","x-header":"X 헤더","linkedin-banner":"링크드인 배너",hd:"HD","full-hd":"Full HD","2k":"2K (DCI)","4k":"4K UHD","8k":"8K UHD"},
    useCases:["px를 mm로, mm를 px로 변환할 때","Illustrator와 Figma의 작업 크기를 맞출 때","300PPI 인쇄용 이미지 크기를 계산할 때","도련을 포함한 명함·포스터 크기를 계산할 때","온라인 제출용 이미지 규격을 확인할 때","SNS·웹·HD·4K 이미지 크기를 확인할 때"],
    steps:["프리셋을 선택하거나 px, mm, cm, inch 중 원하는 단위로 가로와 세로를 입력합니다.","인쇄 또는 출력에 필요한 PPI와 사방 도련을 선택합니다.","완성 크기, 도련 포함 크기와 픽셀 결과를 즉시 확인합니다."],
    practical:[
      {heading:"Pixel이란?",body:"픽셀은 래스터 이미지를 구성하는 가장 작은 그림 요소입니다. 픽셀 수는 디지털 해상도를 나타내며 그 자체로 고정된 실제 길이를 뜻하지 않습니다."},
      {heading:"PPI란?",body:"PPI는 1인치에 배치되는 이미지 픽셀 수입니다. 픽셀과 실제 인쇄 크기를 연결하며 ‘픽셀 = 인치 × PPI’로 계산합니다."},
      {heading:"300PPI가 많이 사용되는 이유",body:"300PPI는 가까이에서 보는 정밀 인쇄물에 널리 사용되는 기준입니다. 실제 값은 인쇄 방식, 재질, 관람 거리와 제작 사양에 따라 달라질 수 있습니다."},
      {heading:"웹은 72PPI만 사용하는 것이 아닙니다",body:"브라우저는 주로 CSS 픽셀과 이미지의 실제 픽셀 크기로 화면을 구성합니다. 파일의 72PPI 메타데이터만으로 모든 화면 표시 크기가 결정되지는 않습니다."},
      {heading:"Illustrator와 Figma의 단위 차이",body:"Illustrator는 mm나 inch 같은 인쇄 단위를 다루기 쉽고 Figma는 주로 px 기반입니다. 실제 인쇄 크기를 래스터 픽셀로 바꿀 때 PPI가 필요합니다."},
      {heading:"도련이 필요한 이유",body:"도련은 재단 오차로 흰 가장자리가 생기지 않도록 디자인을 재단선 바깥까지 확장하는 영역입니다. 완성선 안쪽의 Safe Area와는 다른 개념입니다."},
    ],
    faqs:[
      {question:"PPI란 무엇인가요?",answer:"PPI는 Pixels Per Inch의 약자로 실제 출력 1인치에 배치되는 이미지 픽셀 수입니다. 픽셀 크기와 인쇄 크기를 서로 변환할 때 사용합니다."},
      {question:"300 PPI는 무엇을 의미하나요?",answer:"실제 출력 1인치마다 이미지 픽셀 300개를 사용한다는 의미입니다. 예를 들어 300PPI에서 가로 4인치 이미지는 1,200픽셀이 필요합니다."},
      {question:"DPI와 PPI는 무엇이 다른가요?",answer:"PPI는 디지털 이미지의 인치당 픽셀 수이고 DPI는 프린터가 인치당 출력하는 잉크 또는 토너 점의 수입니다. 인쇄 과정에서 관련되지만 같은 단위는 아닙니다."},
      {question:"도련(Bleed)이란 무엇인가요?",answer:"도련(Bleed)은 인쇄물을 재단할 때 가장자리에 흰 여백이 생기는 것을 방지하기 위해 완성 크기 바깥쪽까지 디자인을 확장하는 영역입니다. 예를 들어 사방에 3mm 도련을 적용하면 가로와 세로 전체 크기는 각각 6mm씩 커집니다. 실제 필요한 도련 크기는 인쇄소나 제작 사양에 따라 다를 수 있으므로 작업 전 요구사항을 확인하세요."},
      {question:"3mm 도련은 몇 px인가요?",answer:"300PPI 기준으로 3mm는 한쪽에 약 35px입니다. 양쪽 도련을 합하면 전체 가로와 세로 크기가 각각 약 71px씩 증가합니다."},
      {question:"2mm 도련을 3mm로 변경하면 몇 px를 추가해야 하나요?",answer:"각 방향의 한쪽마다 1mm가 추가됩니다. 300PPI 기준 한쪽은 약 12px이며, 가로와 세로 전체 크기에는 각각 약 24px가 추가됩니다."},
    ],
    related:["resize","compress","jpg-png","png-jpg","transparent-background"],
  },
  ja: {
    title:"画像サイズ計算機",
    seoTitle:"画像サイズ計算機 | px・mm・cm・inch・PPI変換 | PixEasy",
    seoDescription:"px、mm、cm、inchをPPI基準で変換。印刷の塗り足しや定番サイズもブラウザで無料計算できます。",
    description:"ピクセル、mm、cm、inchをすぐに変換し、印刷サイズ、PPI、塗り足しを計算できます。アップロード・ログイン・インストール不要です。",
    cardDescription:"px、mm、cm、inch、PPI、印刷の塗り足しを計算します。",
    ui:{
      calculator:"サイズ計算",preset:"プリセット",customSize:"直接入力",inputUnit:"入力単位",width:"幅",height:"高さ",ppi:"PPI",customPpi:"カスタムPPI",bleed:"四方の塗り足し",none:"なし",custom:"カスタム",customBleed:"塗り足しを入力（mm）",results:"計算結果",pixels:"ピクセル",millimeters:"ミリメートル",centimeters:"センチメートル",inches:"インチ",baseSize:"仕上がりサイズ",bleedSize:"塗り足し込みサイズ",ppiNote:"1インチあたりのピクセル",bleedDifference:"塗り足し差分計算",currentBleed:"現在の塗り足し",targetBleed:"変更後の塗り足し",perSide:"片側の変化",horizontal:"幅全体の変化",vertical:"高さ全体の変化",pixelDifference:"各寸法のピクセル変化",printPresets:"印刷",digitalPresets:"デジタル・画面",useful:"こんなときに便利です",how:"使い方",practical:"知っておきたいこと",faq:"よくある質問",related:"関連ツール",trust:"無料・ログイン不要・送信なし・ブラウザ計算",mm:"mm",px:"px"
    },
    presetLabels:{a6:"A6",a5:"A5",a4:"A4",a3:"A3",a2:"A2",letter:"Letter",legal:"Legal","business-card":"名刺","instagram-post":"Instagram投稿","instagram-story":"Instagramストーリー","youtube-thumbnail":"YouTubeサムネイル","facebook-cover":"Facebookカバー","x-header":"Xヘッダー","linkedin-banner":"LinkedInバナー",hd:"HD","full-hd":"Full HD","2k":"2K (DCI)","4k":"4K UHD","8k":"8K UHD"},
    useCases:["pxをmmへ、mmをpxへ変換するとき","IllustratorとFigmaの制作サイズを合わせるとき","300PPIの印刷用画像サイズを計算するとき","塗り足しを含む名刺やポスターのサイズを計算するとき","オンライン提出用の画像規格を確認するとき","SNS・Web・HD・4K画像サイズを確認するとき"],
    steps:["プリセットを選ぶか、px、mm、cm、inchの希望単位で幅と高さを入力します。","必要なPPIと四方の塗り足しを選択します。","仕上がり、塗り足し込み、ピクセルの各サイズをすぐに確認します。"],
    practical:[
      {heading:"ピクセルとは？",body:"ピクセルはラスター画像を構成する最小の画素です。ピクセル寸法はデジタル解像度を表しますが、それだけでは固定の物理サイズを意味しません。"},
      {heading:"PPIとは？",body:"PPIは1インチに割り当てる画像ピクセル数です。ピクセル寸法と印刷寸法を結び付け、「ピクセル = インチ × PPI」で計算します。"},
      {heading:"300PPIがよく使われる理由",body:"300PPIは近くで見る精細な印刷物で広く使われる目安です。実際の指定は印刷方式、素材、閲覧距離、制作仕様によって異なります。"},
      {heading:"Webは72PPIだけではありません",body:"ブラウザは主にCSSピクセルと画像のピクセル寸法で表示します。72PPIというメタデータだけで、すべての画面上の大きさが決まるわけではありません。"},
      {heading:"IllustratorとFigmaの単位",body:"Illustratorはmmやinchなど印刷向け単位を扱いやすく、Figmaは主にpx基準です。物理サイズをラスター画像のピクセルへ変換するときにPPIが必要です。"},
      {heading:"塗り足しが必要な理由",body:"塗り足しは断裁のずれで白い縁が出ないよう、絵柄を仕上がり線の外側まで延ばす領域です。仕上がり線内側のセーフエリアとは別のものです。"},
    ],
    faqs:[
      {question:"PPIとは何ですか？",answer:"PPIはPixels Per Inchの略で、物理出力1インチに割り当てる画像ピクセル数です。ピクセル寸法と印刷寸法の変換に使います。"},
      {question:"300 PPIとはどういう意味ですか？",answer:"物理出力1インチごとに画像ピクセルを300個使うという意味です。たとえば300PPIで幅4インチなら1,200pxが必要です。"},
      {question:"DPIとPPIの違いは何ですか？",answer:"PPIはデジタル画像の1インチあたりのピクセル数、DPIはプリンターが1インチに出力するドット数です。印刷工程では関係しますが同じ単位ではありません。"},
      {question:"印刷の塗り足しとは何ですか？",answer:"塗り足しは、断裁時に白い縁が出るのを防ぐため、絵柄を最終的な仕上がりサイズの外側まで延ばす領域です。四方に3mmの塗り足しを付けると、幅と高さの全体サイズはそれぞれ6mm大きくなります。必要な幅は印刷会社や制作仕様によって異なるため、作業前に確認してください。"},
      {question:"3mmの塗り足しは何pxですか？",answer:"300PPIでは3mmは片側約35pxです。両側を合わせると、幅と高さの全体サイズはそれぞれ約71px増えます。"},
      {question:"2mmの塗り足しを3mmに変えると何px追加しますか？",answer:"各辺で1mm増えます。300PPIでは片側約12px、幅と高さの全体サイズにはそれぞれ約24px追加されます。"},
    ],
    related:["resize","compress","jpg-png","png-jpg","transparent-background"],
  },
};
