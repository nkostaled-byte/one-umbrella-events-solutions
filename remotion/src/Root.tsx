import { Composition } from 'remotion';
import { BrandIntro } from './Video';

export const RemotionRoot = () => (
  <Composition
    id="OneUmbrellaIntro"
    component={BrandIntro}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={600}
  />
);
