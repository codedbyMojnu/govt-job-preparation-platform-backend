import { createCanvas } from '@napi-rs/canvas';
import { registerFonts } from '../src/features/slide/domain/render/fonts.js';

registerFonts();
const ctx = createCanvas(10, 10).getContext('2d');
const dari = '\u0964';

for (const fam of ['NotoSansBengali', 'NotoSans']) {
  for (const w of ['normal', 'bold']) {
    ctx.font = `${w} 28px ${fam}`;
    console.log(fam, w, 'dari width=', ctx.measureText(dari).width);
  }
}

ctx.font = 'bold 28px NotoSansBengali';
console.log('২ alone', ctx.measureText('২').width);
console.log('dari alone bold BN', ctx.measureText(dari).width);
console.log('২+dari bold BN', ctx.measureText(`২${dari}`).width);
console.log('expected sum', ctx.measureText('২').width + ctx.measureText(dari).width);
