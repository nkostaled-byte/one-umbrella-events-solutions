import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const work = path.join(root, 'remotion', '.render');
const output = path.join(root, 'public', 'one-umbrella-intro.mp4');
const W = 1080;
const H = 1920;

const cards = [
  { kind: 'intro' },
  { file: 'Hero_image_2868e81b.png', eyebrow: 'THE MOMENTS THAT MATTER', title: ['Made for', 'coming together'], detail: 'Thoughtful setups. Unforgettable celebrations.' },
  { file: 'event_decor_c9ceaebf.png', eyebrow: 'CELEBRATIONS & WEDDINGS', title: ['Every detail,', 'beautifully in place.'], detail: 'Décor and styling that feels like you.' },
  { file: 'Tent_hire_faf66289.png', eyebrow: 'GATHER UNDER ONE ROOF', title: ['Space to make', 'a moment of it.'], detail: 'Marquees and tents for gatherings of every size.' },
  { file: 'Stage_268f7efe.png', eyebrow: 'SET THE SCENE', title: ['Bring your event', 'to life.'], detail: 'Furniture. Staging. Sound and lighting.' },
  { kind: 'outro' },
];

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const svg = (body) => Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#171411" stop-opacity=".13"/><stop offset=".4" stop-color="#171411" stop-opacity=".1"/><stop offset="1" stop-color="#171411" stop-opacity=".83"/></linearGradient><radialGradient id="paper"><stop stop-color="#fffdf8"/><stop offset="1" stop-color="#e8dfd0"/></radialGradient><radialGradient id="night"><stop stop-color="#342c21"/><stop offset="1" stop-color="#171411"/></radialGradient></defs>${body}</svg>`);

await fs.mkdir(work, { recursive: true });
await fs.copyFile('C:/Windows/Fonts/arial.ttf', path.join(work, 'arial.ttf'));
await fs.copyFile('C:/Windows/Fonts/arialbd.ttf', path.join(work, 'arialbd.ttf'));
await fs.copyFile('C:/Windows/Fonts/georgia.ttf', path.join(work, 'georgia.ttf'));
const outputs = [];
for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  const target = path.join(work, `card-${i}.png`);
  let base;
  let overlay;
  if (card.kind === 'intro') {
    base = sharp(svg('<rect width="1080" height="1920" fill="url(#paper)"/>'));
    overlay = svg('<circle cx="540" cy="660" r="96" fill="#221e19"/>');
  } else if (card.kind === 'outro') {
    base = sharp(svg('<rect width="1080" height="1920" fill="url(#night)"/>'));
    overlay = svg('<circle cx="540" cy="640" r="65" fill="none" stroke="#faf8f5" stroke-opacity=".75" stroke-width="2"/>');
  } else {
    const image = path.join(root, 'public', 'assets', 'aistudio', card.file);
    base = sharp(image).resize(W, H, { fit: 'cover', position: 'centre' });
    overlay = svg('<rect width="1080" height="1920" fill="url(#shade)"/>');
  }
  await base.composite([{ input: overlay }]).png().toFile(target);
  outputs.push(target);
}

const args = ['-y'];
for (const file of outputs) args.push('-loop', '1', '-framerate', '30', '-t', '3.7', '-i', file);
const fonts = { arial: 'remotion/.render/arial.ttf', bold: 'remotion/.render/arialbd.ttf', georgia: 'remotion/.render/georgia.ttf' };
const filters = outputs.map((_, i) => {
  let chain = `[${i}:v]scale=${W}:${H},setsar=1,format=yuv420p`;
  if (i > 0 && i < 5) chain += `,zoompan=z='min(1.02+0.00045*on\\,1.08)':d=1:s=${W}x${H}:fps=30`;
  chain += ',settb=AVTB,setpts=PTS-STARTPTS';
  const fade = (delay, dur = 0.45) => `if(lt(t\\,${delay})\\,0\\,min((t-${delay})/${dur}\\,1))`;
  if (i === 0) {
    chain += `,drawtext=fontfile=${fonts.georgia}:text='OU':fontsize=54:fontcolor=0xfffbf5:x=516:y=640:alpha='${fade(0.18, 0.6)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.georgia}:text='One Umbrella':fontsize=90:fontcolor=0x2c2825:x='540-text_w/2+if(lt(t\\,1.1)\\,100*(1-min(t/1.1\\,1))\\,0)':y=820:alpha='${fade(0.52, 0.65)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.bold}:text='EVENTS SOLUTIONS':fontsize=22:fontcolor=0x766e63:x='540-text_w/2':y=892:alpha='${fade(0.95, 0.55)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawbox=x=497:y=953:w=86:h=2:color=0xc6a45b:t=fill:enable='gte(t\\,1.2)'`;
    chain += `,drawtext=fontfile=${fonts.arial}:text='Bringing every detail together':fontsize=24:fontcolor=0x5c5346:x='540-text_w/2':y=1005:alpha='${fade(1.5, 0.5)}':enable='between(t\\,0\\,3.7)'`;
  } else if (i === 5) {
    chain += `,drawtext=fontfile=${fonts.georgia}:text='OU':fontsize=46:fontcolor=0xfffbf5:x='540-text_w/2':y='560+if(lt(t\\,0.65)\\,40*(1-min(t/0.65\\,1))\\,0)':alpha='${fade(0.15, 0.5)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.georgia}:text='One Umbrella':fontsize=77:fontcolor=0xfffbf5:x='540-text_w/2+if(lt(t\\,0.95)\\,100*(1-min(t/0.95\\,1))\\,0)':y=790:alpha='${fade(0.4, 0.6)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.bold}:text='EVENTS SOLUTIONS':fontsize=19:fontcolor=0xd4c6a7:x='540-text_w/2':y=848:alpha='${fade(0.8, 0.5)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawbox=x=509:y=908:w=62:h=2:color=0xc6a45b:t=fill:enable='gte(t\\,1)'`;
    chain += `,drawtext=fontfile=${fonts.arial}:text='Your event. All coming together.':fontsize=24:fontcolor=0xefe7da:x='540-text_w/2':y=970:alpha='${fade(1.15, 0.55)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.arial}:text='DECOR  /  MARQUEES  /  FURNITURE  /  PRODUCTION':fontsize=15:fontcolor=0xd4c6a7:x='540-text_w/2':y=1040:alpha='${fade(1.5, 0.5)}':enable='between(t\\,0\\,3.7)'`;
  } else {
    const card = cards[i];
    chain += `,drawtext=fontfile=${fonts.georgia}:text='OU':fontsize=20:fontcolor=0xfffbf5:x=65:y=101:alpha='1':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.georgia}:text='One Umbrella':fontsize=20:fontcolor=0xfffbf5:x=119:y=92:alpha='1':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.bold}:text='EVENTS SOLUTIONS':fontsize=9:fontcolor=0xfffbf5:x=119:y=118:alpha='1':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawbox=x=82:y=1318:w=56:h=3:color=0xc6a45b:t=fill:enable='gte(t\\,0.18)'`;
    chain += `,drawtext=fontfile=${fonts.bold}:text='${card.eyebrow}':fontsize=18:fontcolor=0xfffbf5:x='158+if(lt(t\\,0.35)\\,65*(1-min(t/0.35\\,1))\\,0)':y=1307:alpha='${fade(0.15, 0.32)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.georgia}:text='${card.title[0]}':fontsize=78:fontcolor=0xfffbf5:x='82+if(lt(t\\,0.9)\\,75*(1-min(max((t-0.38)/0.52\\,0)\\,1))\\,0)':y=1434:alpha='${fade(0.38, 0.52)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.georgia}:text='${card.title[1]}':fontsize=78:fontcolor=0xfffbf5:x='82+if(lt(t\\,1.12)\\,75*(1-min(max((t-0.56)/0.56\\,0)\\,1))\\,0)':y=1525:alpha='${fade(0.56, 0.56)}':enable='between(t\\,0\\,3.7)'`;
    chain += `,drawtext=fontfile=${fonts.arial}:text='${card.detail}':fontsize=24:fontcolor=0xfff5e9:x=82:y=1653:alpha='${fade(0.95, 0.55)}':enable='between(t\\,0\\,3.7)'`;
  }
  return `${chain}[v${i}]`;
});
let previous = 'v0';
for (let i = 1; i < outputs.length; i++) {
  const outputLabel = `x${i}`;
  const offset = (3.7 - 0.44) * i;
  filters.push(`[${previous}][v${i}]xfade=transition=fade:duration=0.44:offset=${offset.toFixed(2)}[${outputLabel}]`);
  previous = outputLabel;
}
await fs.writeFile(path.join(work, 'filters.txt'), filters.join(';'));
console.log(`Prepared cards in ${work}`);
console.log(`Output path: ${output}`);
