export type ColorLevel = "original" | 32 | 16 | 8;

export function pixelatedDimensions(width:number,height:number,pixelSize:number){
  const size=Math.max(2,Math.min(64,Math.round(pixelSize)));
  return {width:Math.max(1,Math.ceil(width/size)),height:Math.max(1,Math.ceil(height/size))};
}

export function quantizePixels(data:Uint8ClampedArray,colors:ColorLevel){
  if(colors==="original") return data;
  const levels=Math.max(2,Math.round(Math.cbrt(colors)));
  const step=255/(levels-1);
  const output=new Uint8ClampedArray(data);
  for(let i=0;i<output.length;i+=4){
    output[i]=Math.round(output[i]/step)*step;
    output[i+1]=Math.round(output[i+1]/step)*step;
    output[i+2]=Math.round(output[i+2]/step)*step;
  }
  return output;
}
