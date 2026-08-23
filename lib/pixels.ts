export type PixelMode = "original" | "invert" | "grayscale";
export type InvertAdjustments = {
  strength: number;
  channels: { red: boolean; green: boolean; blue: boolean };
  hue: number;
  saturation: number;
  brightness: number;
  contrast: number;
};

export const defaultInvertAdjustments:InvertAdjustments={strength:100,channels:{red:true,green:true,blue:true},hue:0,saturation:0,brightness:0,contrast:0};

function rgbToHsl(red:number,green:number,blue:number){
  const r=red/255,g=green/255,b=blue/255,max=Math.max(r,g,b),min=Math.min(r,g,b),lightness=(max+min)/2;
  if(max===min)return [0,0,lightness] as const;
  const delta=max-min;const saturation=lightness>.5?delta/(2-max-min):delta/(max+min);
  let hue=max===r?(g-b)/delta+(g<b?6:0):max===g?(b-r)/delta+2:(r-g)/delta+4;
  hue/=6;return [hue,saturation,lightness] as const;
}

function hslToRgb(hue:number,saturation:number,lightness:number){
  if(saturation===0){const gray=Math.round(lightness*255);return [gray,gray,gray] as const;}
  const hueToRgb=(p:number,q:number,t:number)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
  const q=lightness<.5?lightness*(1+saturation):lightness+saturation-lightness*saturation,p=2*lightness-q;
  return [Math.round(hueToRgb(p,q,hue+1/3)*255),Math.round(hueToRgb(p,q,hue)*255),Math.round(hueToRgb(p,q,hue-1/3)*255)] as const;
}

export function adjustInvertPixels(data:Uint8ClampedArray,options:InvertAdjustments):Uint8ClampedArray{
  const output=new Uint8ClampedArray(data);const strength=Math.max(0,Math.min(100,options.strength))/100;
  const brightness=Math.max(-100,Math.min(100,options.brightness))*2.55;
  const contrastValue=Math.max(-100,Math.min(100,options.contrast))*2.55;
  const contrast=(259*(contrastValue+255))/(255*(259-contrastValue));
  for(let index=0;index<output.length;index+=4){
    let red=options.channels.red?output[index]*(1-strength)+(255-output[index])*strength:output[index];
    let green=options.channels.green?output[index+1]*(1-strength)+(255-output[index+1])*strength:output[index+1];
    let blue=options.channels.blue?output[index+2]*(1-strength)+(255-output[index+2])*strength:output[index+2];
    if(options.hue!==0||options.saturation!==0){const [h,s,l]=rgbToHsl(red,green,blue);const nextHue=(h+options.hue/360+1)%1;const nextS=Math.max(0,Math.min(1,s*(1+options.saturation/100)));[red,green,blue]=hslToRgb(nextHue,nextS,l);}
    output[index]=contrast*(red+brightness-128)+128;output[index+1]=contrast*(green+brightness-128)+128;output[index+2]=contrast*(blue+brightness-128)+128;
  }
  return output;
}

export function transformPixels(data: Uint8ClampedArray, mode: PixelMode): Uint8ClampedArray {
  const output = new Uint8ClampedArray(data);
  if (mode === "original") return output;
  for (let index = 0; index < output.length; index += 4) {
    if (mode === "invert") {
      output[index] = 255 - output[index]; output[index + 1] = 255 - output[index + 1]; output[index + 2] = 255 - output[index + 2];
    } else {
      const gray = Math.round(.299 * output[index] + .587 * output[index + 1] + .114 * output[index + 2]);
      output[index] = gray; output[index + 1] = gray; output[index + 2] = gray;
    }
  }
  return output;
}

export function removeWhitePixels(data: Uint8ClampedArray, tolerance: number): Uint8ClampedArray {
  const output = new Uint8ClampedArray(data);
  const threshold = Math.max(0, Math.min(100, tolerance)) * Math.sqrt(3);
  const feather = 24;
  for (let index = 0; index < output.length; index += 4) {
    const distance = Math.hypot(255 - output[index], 255 - output[index + 1], 255 - output[index + 2]);
    if (distance <= threshold) output[index + 3] = 0;
    else if (distance < threshold + feather) output[index + 3] = Math.round(output[index + 3] * ((distance - threshold) / feather));
  }
  return output;
}
