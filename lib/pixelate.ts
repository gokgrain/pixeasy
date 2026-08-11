export type ColorLevel = "original" | 32 | 16 | 8;
export type PixelStyle = "pixelated" | "pixel-art";
export type RgbColor = readonly [number,number,number];

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

type ColorBox={colors:Array<[number,number,number]>;range:number;channel:0|1|2};

function describeBox(colors:Array<[number,number,number]>):ColorBox{
  const min=[255,255,255],max=[0,0,0];
  for(const color of colors) for(let channel=0;channel<3;channel++){
    min[channel]=Math.min(min[channel],color[channel]);
    max[channel]=Math.max(max[channel],color[channel]);
  }
  const ranges=[max[0]-min[0],max[1]-min[1],max[2]-min[2]];
  const channel=ranges[1]>ranges[0]?(ranges[2]>ranges[1]?2:1):(ranges[2]>ranges[0]?2:0);
  return {colors,range:ranges[channel],channel:channel as 0|1|2};
}

/** Extracts a representative image palette using median-cut quantization. */
export function medianCutPalette(data:Uint8ClampedArray,maxColors:number,maxSamples=200_000):RgbColor[]{
  const pixelCount=Math.floor(data.length/4);
  const stride=Math.max(1,Math.ceil(pixelCount/maxSamples));
  const samples:Array<[number,number,number]>=[];
  for(let pixel=0;pixel<pixelCount;pixel+=stride){
    const index=pixel*4;
    if(data[index+3]===0) continue;
    samples.push([data[index],data[index+1],data[index+2]]);
  }
  if(samples.length===0) return [[0,0,0]];
  const target=Math.max(2,Math.min(64,Math.round(maxColors)));
  const boxes=[describeBox(samples)];
  while(boxes.length<target){
    boxes.sort((a,b)=>(b.range*b.colors.length)-(a.range*a.colors.length));
    const box=boxes.shift();
    if(!box||box.colors.length<2||box.range===0){if(box)boxes.unshift(box);break;}
    box.colors.sort((a,b)=>a[box.channel]-b[box.channel]);
    const middle=Math.ceil(box.colors.length/2);
    boxes.push(describeBox(box.colors.slice(0,middle)),describeBox(box.colors.slice(middle)));
  }
  return boxes.map(({colors})=>{
    const total=colors.reduce((sum,color)=>[sum[0]+color[0],sum[1]+color[1],sum[2]+color[2]],[0,0,0]);
    return [Math.round(total[0]/colors.length),Math.round(total[1]/colors.length),Math.round(total[2]/colors.length)] as RgbColor;
  });
}

function nearestColor(red:number,green:number,blue:number,palette:RgbColor[]):RgbColor{
  let nearest=palette[0],nearestDistance=Number.POSITIVE_INFINITY;
  for(const color of palette){
    const redDelta=red-color[0],greenDelta=green-color[1],blueDelta=blue-color[2];
    const distance=redDelta*redDelta+greenDelta*greenDelta+blueDelta*blueDelta;
    if(distance<nearestDistance){nearest=color;nearestDistance=distance;}
  }
  return nearest;
}

/** Maps pixels to a representative palette, optionally with Floyd-Steinberg dithering. */
export function mapPixelsToPalette(data:Uint8ClampedArray,width:number,height:number,palette:RgbColor[],dithering=false){
  const output=new Uint8ClampedArray(data);
  if(!dithering){
    for(let index=0;index<output.length;index+=4){
      if(output[index+3]===0) continue;
      const color=nearestColor(output[index],output[index+1],output[index+2],palette);
      output[index]=color[0];output[index+1]=color[1];output[index+2]=color[2];
    }
    return output;
  }
  const working=new Float32Array(data.length);
  for(let index=0;index<data.length;index++) working[index]=data[index];
  const diffuse=(x:number,y:number,errors:number[],factor:number)=>{
    if(x<0||x>=width||y<0||y>=height)return;
    const index=(y*width+x)*4;
    if(working[index+3]===0)return;
    for(let channel=0;channel<3;channel++)working[index+channel]+=errors[channel]*factor;
  };
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const index=(y*width+x)*4;
    if(working[index+3]===0)continue;
    const color=nearestColor(working[index],working[index+1],working[index+2],palette);
    const errors=[working[index]-color[0],working[index+1]-color[1],working[index+2]-color[2]];
    output[index]=color[0];output[index+1]=color[1];output[index+2]=color[2];
    diffuse(x+1,y,errors,7/16);diffuse(x-1,y+1,errors,3/16);diffuse(x,y+1,errors,5/16);diffuse(x+1,y+1,errors,1/16);
  }
  return output;
}
