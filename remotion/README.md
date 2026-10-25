# One Umbrella intro video

The intro is a 1080 × 1920 vertical motion-graphics video at 30 fps, made from the event photography in `public/assets/aistudio`. It uses moving photo crops, staggered type entrances, gold accents and animated brand cards. The editable Remotion composition is in `src/Video.tsx`; the delivered MP4 is `public/one-umbrella-intro.mp4`.

To regenerate the delivered MP4 on Windows, run this from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File remotion/render-intro.ps1
```

`render-intro.mjs` prepares the graphic cards and animated filter graph. The Remotion source remains available for further timing and layout changes.
