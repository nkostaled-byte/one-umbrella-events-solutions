import React from 'react';
import { AbsoluteFill, Img, Easing, interpolate, useCurrentFrame, staticFile } from 'remotion';

const cream = '#faf8f5';
const gold = '#c6a45b';
const scenes = [
  { image: 'Hero_image_2868e81b.png', eyebrow: 'THE MOMENTS THAT MATTER', title: 'Made for\ncoming together', detail: 'Thoughtful setups. Unforgettable celebrations.' },
  { image: 'event_decor_c9ceaebf.png', eyebrow: 'CELEBRATIONS & WEDDINGS', title: 'Every detail,\nbeautifully in place.', detail: 'Décor and styling that feels like you.' },
  { image: 'Tent_hire_faf66289.png', eyebrow: 'GATHER UNDER ONE ROOF', title: 'Space to make\na moment of it.', detail: 'Marquees and tents for gatherings of every size.' },
  { image: 'Stage_268f7efe.png', eyebrow: 'SET THE SCENE', title: 'Bring your event\nto life.', detail: 'Furniture. Staging. Sound and lighting.' },
];

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const BrandMark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', border: '1px solid rgba(255,255,255,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: size * .37, color: cream, letterSpacing: -2, background: 'rgba(255,255,255,.12)', boxShadow: 'inset 0 1px 8px rgba(255,255,255,.25)' }}>OU</div>
);

export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const introOut = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const endIn = interpolate(frame, [486, 530], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const activeIndex = Math.min(3, Math.max(0, Math.floor((frame - 66) / 105)));
  const sceneFrame = Math.max(0, frame - (66 + activeIndex * 105));
  const sceneIn = interpolate(sceneFrame, [0, 24], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const sceneOut = interpolate(sceneFrame, [84, 105], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const sceneOpacity = frame < 66 || frame > 486 ? 0 : sceneIn * sceneOut;
  const zoom = interpolate(sceneFrame, [0, 105], [1.08, 1.01], { extrapolateRight: 'clamp' });
  const brandScale = interpolate(frame, [0, 34], [.9, 1], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill style={{ backgroundColor: cream, color: cream, fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {scenes.map((item, i) => {
        const local = frame - (66 + i * 105);
        const enter = interpolate(local, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const leave = interpolate(local, [84, 105], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const alpha = enter * leave;
        const scale = interpolate(local, [0, 105], [1.08, 1.01], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return <AbsoluteFill key={item.image} style={{ opacity: alpha }}>
          <Img src={staticFile(`assets/aistudio/${item.image}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(19,16,12,.15) 0%, rgba(19,16,12,.08) 35%, rgba(19,16,12,.76) 100%)' }} />
        </AbsoluteFill>;
      })}

      <AbsoluteFill style={{ opacity: introOut, transform: `scale(${brandScale})`, background: 'radial-gradient(ellipse at 50% 38%, #fffdf8 0%, #f5f0e7 62%, #e8dfd0 100%)', color: '#2c2825', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          <div style={{ width: 138, height: 138, borderRadius: '50%', background: '#221e19', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cream, fontFamily: 'Georgia,serif', fontSize: 52, fontStyle: 'italic', letterSpacing: -6, boxShadow: '0 25px 65px rgba(47,36,20,.18)' }}>OU</div>
          <div style={{ textAlign: 'center', lineHeight: .9, fontFamily: 'Georgia,serif', letterSpacing: -2 }}>
            <div style={{ fontSize: 95 }}>One Umbrella</div>
            <div style={{ marginTop: 19, color: '#766e63', fontFamily: 'Arial,sans-serif', fontSize: 27, fontWeight: 600, letterSpacing: 8, textTransform: 'uppercase' }}>Events Solutions</div>
          </div>
          <div style={{ width: 84, height: 2, marginTop: 24, background: gold }} />
          <div style={{ color: '#5c5346', fontSize: 25, letterSpacing: 2 }}>Bringing every detail together</div>
        </div>
      </AbsoluteFill>

      {scenes.map((item, i) => {
        const local = frame - (66 + i * 105);
        const enter = interpolate(local, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const leave = interpolate(local, [84, 105], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const alpha = enter * leave;
        const y = interpolate(local, [4, 28], [48, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return <AbsoluteFill key={`${item.image}-copy`} style={{ opacity: alpha, justifyContent: 'flex-end', padding: '0 82px 230px', transform: `translateY(${y}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 27 }}><div style={{ width: 56, height: 2, background: gold }} /><span style={{ fontSize: 21, fontWeight: 700, letterSpacing: 5 }}>{item.eyebrow}</span></div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 81, lineHeight: .98, letterSpacing: -2, whiteSpace: 'pre-line', textShadow: '0 4px 24px rgba(0,0,0,.2)' }}>{item.title}</div>
          <div style={{ fontSize: 27, marginTop: 29, color: 'rgba(255,255,255,.88)', letterSpacing: .3 }}>{item.detail}</div>
          <div style={{ marginTop: 48, display: 'flex', gap: 12 }}>
            {scenes.map((_, n) => <div key={n} style={{ height: 3, width: n === i ? 43 : 18, background: n === i ? gold : 'rgba(255,255,255,.55)', borderRadius: 4 }} />)}
          </div>
        </AbsoluteFill>;
      })}

      <AbsoluteFill style={{ opacity: sceneOpacity, padding: '92px 70px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}><BrandMark size={70} /><div><div style={{ fontFamily: 'Georgia,serif', fontSize: 27 }}>One Umbrella</div><div style={{ fontSize: 11, letterSpacing: 3, marginTop: 4 }}>EVENTS SOLUTIONS</div></div></div>
        <div style={{ color: 'rgba(255,255,255,.86)', fontSize: 15, letterSpacing: 3 }}>SOUTH AFRICA</div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: endIn, background: 'radial-gradient(ellipse at 50% 45%, #342c21 0%, #171411 76%)', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${interpolate(frame, [486, 535], [35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })}px)` }}>
          <BrandMark size={114} />
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 75, marginTop: 34, letterSpacing: -1 }}>One Umbrella</div>
          <div style={{ color: '#d4c6a7', fontWeight: 600, letterSpacing: 8, fontSize: 20, marginTop: 11 }}>EVENTS SOLUTIONS</div>
          <div style={{ width: 66, height: 2, background: gold, margin: '38px 0 31px' }} />
          <div style={{ fontSize: 24, color: '#efe7da' }}>Your event. All coming together.</div>
          <div style={{ marginTop: 49, fontSize: 15, letterSpacing: 3, color: '#d4c6a7' }}>DÉCOR  ·  MARQUEES  ·  FURNITURE  ·  PRODUCTION</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
