export type City = {
  id:string; zone:string; flag:string; code:string;
  name:{en:string;ko:string;ja:string}; country:{en:string;ko:string;ja:string};
  region?:{en:string;ko:string;ja:string}; aliases:string[]; popular?:boolean;
};

const c=(id:string,zone:string,flag:string,code:string,n:[string,string,string],country:[string,string,string],aliases:string[],popular=false,region?:[string,string,string]):City=>({id,zone,flag,code,name:{en:n[0],ko:n[1],ja:n[2]},country:{en:country[0],ko:country[1],ja:country[2]},aliases,popular,...(region?{region:{en:region[0],ko:region[1],ja:region[2]}}:{})});
const KR:[string,string,string]=["Republic of Korea","대한민국","大韓民国"];
const US:[string,string,string]=["United States","미국","アメリカ合衆国"];

export const cities:readonly City[]=[
  c("seoul","Asia/Seoul","🇰🇷","KR",["Seoul","서울","ソウル"],KR,["korea","republic of korea","south korea","대한민국","한국","韓国"],true),
  c("busan","Asia/Seoul","🇰🇷","KR",["Busan","부산","釜山"],KR,["pusan","korea","south korea"]),
  c("new-york","America/New_York","🇺🇸","US",["New York","뉴욕","ニューヨーク"],US,["nyc","new york city","america","usa"],true,["New York","뉴욕주","ニューヨーク州"]),
  c("los-angeles","America/Los_Angeles","🇺🇸","US",["Los Angeles","로스앤젤레스","ロサンゼルス"],US,["la","lax","california","usa"],true,["California","캘리포니아","カリフォルニア州"]),
  c("chicago","America/Chicago","🇺🇸","US",["Chicago","시카고","シカゴ"],US,["chi","illinois","usa"],false,["Illinois","일리노이","イリノイ州"]),
  c("denver","America/Denver","🇺🇸","US",["Denver","덴버","デンバー"],US,["colorado","mountain time","usa"],false,["Colorado","콜로라도","コロラド州"]),
  c("honolulu","Pacific/Honolulu","🇺🇸","US",["Honolulu","호놀룰루","ホノルル"],US,["hawaii","hnl","usa"],false,["Hawaii","하와이","ハワイ州"]),
  c("anchorage","America/Anchorage","🇺🇸","US",["Anchorage","앵커리지","アンカレッジ"],US,["alaska","usa"],false,["Alaska","알래스카","アラスカ州"]),
  c("london","Europe/London","🇬🇧","GB",["London","런던","ロンドン"],["United Kingdom","영국","イギリス"],["uk","gb","britain","england","gmt","bst"],true),
  c("paris","Europe/Paris","🇫🇷","FR",["Paris","파리","パリ"],["France","프랑스","フランス"],["fr","cet","cest"],true),
  c("berlin","Europe/Berlin","🇩🇪","DE",["Berlin","베를린","ベルリン"],["Germany","독일","ドイツ"],["de","cet","cest"]),
  c("madrid","Europe/Madrid","🇪🇸","ES",["Madrid","마드리드","マドリード"],["Spain","스페인","スペイン"],["es","cet","cest"]),
  c("rome","Europe/Rome","🇮🇹","IT",["Rome","로마","ローマ"],["Italy","이탈리아","イタリア"],["roma","it","cet"]),
  c("helsinki","Europe/Helsinki","🇫🇮","FI",["Helsinki","헬싱키","ヘルシンキ"],["Finland","핀란드","フィンランド"],["fi","eet"]),
  c("moscow","Europe/Moscow","🇷🇺","RU",["Moscow","모스크바","モスクワ"],["Russia","러시아","ロシア"],["ru","msk"]),
  c("dubai","Asia/Dubai","🇦🇪","AE",["Dubai","두바이","ドバイ"],["United Arab Emirates","아랍에미리트","アラブ首長国連邦"],["uae","ae","gst"],true),
  c("delhi","Asia/Kolkata","🇮🇳","IN",["New Delhi","뉴델리","ニューデリー"],["India","인도","インド"],["delhi","india","in","ist"],true),
  c("mumbai","Asia/Kolkata","🇮🇳","IN",["Mumbai","뭄바이","ムンバイ"],["India","인도","インド"],["bombay","india","in","ist"]),
  c("kathmandu","Asia/Kathmandu","🇳🇵","NP",["Kathmandu","카트만두","カトマンズ"],["Nepal","네팔","ネパール"],["nepal","np","npt"],true),
  c("karachi","Asia/Karachi","🇵🇰","PK",["Karachi","카라치","カラチ"],["Pakistan","파키스탄","パキスタン"],["pakistan","pk"]),
  c("dhaka","Asia/Dhaka","🇧🇩","BD",["Dhaka","다카","ダッカ"],["Bangladesh","방글라데시","バングラデシュ"],["bangladesh","bd"]),
  c("bangkok","Asia/Bangkok","🇹🇭","TH",["Bangkok","방콕","バンコク"],["Thailand","태국","タイ"],["th","bkk"],true),
  c("singapore","Asia/Singapore","🇸🇬","SG",["Singapore","싱가포르","シンガポール"],["Singapore","싱가포르","シンガポール"],["sg","sgt"],true),
  c("hong-kong","Asia/Hong_Kong","🇭🇰","HK",["Hong Kong","홍콩","香港"],["Hong Kong","홍콩","香港"],["hk","hkt"],true),
  c("shanghai","Asia/Shanghai","🇨🇳","CN",["Shanghai","상하이","上海"],["China","중국","中国"],["china","cn","cst"],true),
  c("beijing","Asia/Shanghai","🇨🇳","CN",["Beijing","베이징","北京"],["China","중국","中国"],["peking","china","cn"]),
  c("tokyo","Asia/Tokyo","🇯🇵","JP",["Tokyo","도쿄","東京"],["Japan","일본","日本"],["jp","jst","東京"],true),
  c("osaka","Asia/Tokyo","🇯🇵","JP",["Osaka","오사카","大阪"],["Japan","일본","日本"],["jp","jst","大阪"]),
  c("sydney","Australia/Sydney","🇦🇺","AU",["Sydney","시드니","シドニー"],["Australia","호주","オーストラリア"],["au","aedt","aest"],true,["New South Wales","뉴사우스웨일스","ニューサウスウェールズ州"]),
  c("melbourne","Australia/Melbourne","🇦🇺","AU",["Melbourne","멜버른","メルボルン"],["Australia","호주","オーストラリア"],["au","aedt","aest"],false,["Victoria","빅토리아","ビクトリア州"]),
  c("adelaide","Australia/Adelaide","🇦🇺","AU",["Adelaide","애들레이드","アデレード"],["Australia","호주","オーストラリア"],["au","acdt","acst"],true,["South Australia","사우스오스트레일리아","南オーストラリア州"]),
  c("perth","Australia/Perth","🇦🇺","AU",["Perth","퍼스","パース"],["Australia","호주","オーストラリア"],["au","awst"],false,["Western Australia","웨스턴오스트레일리아","西オーストラリア州"]),
  c("auckland","Pacific/Auckland","🇳🇿","NZ",["Auckland","오클랜드","オークランド"],["New Zealand","뉴질랜드","ニュージーランド"],["nz","nzdt","nzst"],true),
  c("chatham","Pacific/Chatham","🇳🇿","NZ",["Chatham Islands","채텀 제도","チャタム諸島"],["New Zealand","뉴질랜드","ニュージーランド"],["chatham","nz","chadt","chast"],true),
  c("toronto","America/Toronto","🇨🇦","CA",["Toronto","토론토","トロント"],["Canada","캐나다","カナダ"],["canada","ca","ontario"],true,["Ontario","온타리오","オンタリオ州"]),
  c("vancouver","America/Vancouver","🇨🇦","CA",["Vancouver","밴쿠버","バンクーバー"],["Canada","캐나다","カナダ"],["canada","ca","bc"],false,["British Columbia","브리티시컬럼비아","ブリティッシュコロンビア州"]),
  c("mexico-city","America/Mexico_City","🇲🇽","MX",["Mexico City","멕시코시티","メキシコシティ"],["Mexico","멕시코","メキシコ"],["cdmx","mx"]),
  c("sao-paulo","America/Sao_Paulo","🇧🇷","BR",["São Paulo","상파울루","サンパウロ"],["Brazil","브라질","ブラジル"],["sao paulo","br","brazil"],true),
  c("buenos-aires","America/Argentina/Buenos_Aires","🇦🇷","AR",["Buenos Aires","부에노스아이레스","ブエノスアイレス"],["Argentina","아르헨티나","アルゼンチン"],["argentina","ar"]),
  c("cairo","Africa/Cairo","🇪🇬","EG",["Cairo","카이로","カイロ"],["Egypt","이집트","エジプト"],["egypt","eg"]),
  c("johannesburg","Africa/Johannesburg","🇿🇦","ZA",["Johannesburg","요하네스버그","ヨハネスブルグ"],["South Africa","남아프리카공화국","南アフリカ"],["joburg","za","south africa"]),
  c("nairobi","Africa/Nairobi","🇰🇪","KE",["Nairobi","나이로비","ナイロビ"],["Kenya","케냐","ケニア"],["kenya","ke"]),
];

export function cityById(id:string){return cities.find((city)=>city.id===id);}
export function cityForZone(zone:string){return cities.find((city)=>city.zone===zone);}
const fold=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase().trim();
export function searchCities(query:string,selected:string[]=[]){
  const q=fold(query); const selectedSet=new Set(selected);
  const scored=cities.map((city,index)=>{
    const values=[...Object.values(city.name),...Object.values(city.country),...Object.values(city.region??{}),city.code,...city.aliases].map(fold);
    const exact=values.some((value)=>value===q), prefix=values.some((value)=>value.startsWith(q)), includes=values.some((value)=>value.includes(q));
    return {city,index,score:q?(exact?0:prefix?1:includes?2:99):(city.popular?0:1)};
  }).filter(({score})=>score<99).sort((a,b)=>a.score-b.score||Number(selectedSet.has(a.city.id))-Number(selectedSet.has(b.city.id))||a.index-b.index);
  return scored.map(({city})=>city);
}
