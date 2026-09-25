# Book showcase: fan to grid

Branch: `feat/book-showcase`

## Run and explore

```sh
npm install
npm run dev
```

Open the printed local URL. **Timeline demo** starts at the fan:

- **Play transition**: run the timeline; the same button pauses it.
- **Replay**: restart from the fan.
- **Progress**: manually inspect any point, including moving backward.
- **Scroll demo**: scroll down to transform and up to reverse. The stage pins
  while the timeline progresses. The controls below it become read-only.
- Reduced-motion users get the static final layout with no pin or animation.

## What matches the recording

At approximately 30-33 seconds, seven books form a fan. Six move into a
three-column, two-row grid; the seventh exits to the right. The blue panel
fades away and the text appears on the left. This implementation reproduces
that sequence. ScrollTrigger pin/scrub is our implementation choice: the
recording does not expose the original Figma triggers or exact easing.

This is a **learning demo, not a finished Figma reproduction**. Cover artwork is
original CSS sample artwork, labelled on the page. The font, opening text,
background decoration, timing and mobile adaptation are approximations.
The controls and next-step section support the demo; they are not from Figma.
Real exported covers, exact design tokens and the intended CTA destination
remain pending because Figma MCP access reached its seat limit.

## Read the code in this order

1. `src/components/BookShowcase.css`: `.book-0` through `.book-6` define the final
   layout. Six positions form a grid. The seventh is outside the stage.
2. `sampleBooks` in `BookShowcase.jsx`: the cover content, independent of motion.
3. Numbered comments **1-3**: refs, matchMedia, paused timeline and fan geometry.
4. Comments **4-5**: labels, text reveal and the departing seventh cover.
5. ScrollTrigger block: the exact same timeline driven by scroll.
6. Cleanup and button handlers: pausing, restarting, seeking, resize and teardown.

## GSAP ko step by step samjho

### 1. Final layout pehle

CSS books ko final grid mein rakhti hai. Animation off ho tab bhi content
readable hai. React sirf aik dafa seven cards render karta hai; hum unhi cards
ko move karte hain.

### 2. Fan ka starting point

`x = fanLeft - card.offsetLeft`

`offsetLeft` final grid ki position hai. Fan ki desired position minus final
position se required translation milti hai. Isi tarah `y` calculate hota hai.
`(i - 3) * 6` rotations deta hai: -18, -12, -6, 0, 6, 12, 18 degrees.
`scale` cover ko fan mein thora bara karta hai.

### 3. fromTo

`fromTo(cards, fanState, gridState, 0.25)` starting aur ending values specify
karta hai. Last argument timeline ka start time hai. Grid state mein `x: 0`,
`y: 0`, `rotation: 0`, `scale: 1` se cards original CSS position par aate hain.
Seventh card ke liye ending x stage ke bahar hai.

### 4. Labels aur stagger

`addLabel('reveal', 0.45)` aik named time point hai. Background aur intro dono
`reveal` par change hona shuru hote hain. `reveal+=0.5` copy ko thora baad
start karta hai. `stagger: 0.09` copy ke items ke beech 90ms delay rakhta hai.
`autoAlpha` opacity ke saath visibility bhi handle karta hai, taake hidden
CTA keyboard focus na le.

### 5. Timeline vs scroll

Manual mode mein `.play()`, `.pause()`, `.restart()` aur `.progress(0.5)`
timeline ko control karte hain. Scroll mode mein ScrollTrigger wohi kaam
scroll position se karta hai. `scrub: 0.6` progress ko softly catch up karwata
hai, aur `pin: true` stage ko transition ke dauran hold karta hai.

### 6. React cleanup

`useGSAP` aur `matchMedia` animation ki lifecycle manage karte hain. Mode ya
breakpoint change par previous timeline aur ScrollTrigger revert hote hain.
Resize listener bhi remove hota hai. Global `killAll()` use nahi hota, isliye
baqi developers ke sections ki animations affect nahi hongi.

## Practice tasks

Har experiment mein sirf aik value change karo:

1. Rotation multiplier `6` ko `3` karo: fan ki shape compare karo.
2. Cover `duration: 1.8` ko `3` karo: movement slow hoti hai.
3. `stagger.each` ko `0.15` karo: books ki ordering dekho.
4. `reveal+=0.5` ko `reveal+=1` karo: text der se aayega.
5. `scrub: 0.6` ko `true` karo: scroll directly progress control karega.
6. Change undo karo, phir code dekhe baghair simple 3-card version banao.

## Replace sample covers

Save seven image exports under `src/assets/books/`, import them, then pass a
stable array to `<BookShowcase books={books} />` from `App.jsx`:

```jsx
import coverOne from './assets/books/cover-one.webp'

const books = [
  { title: 'Exact book title', src: coverOne },
  // Add the other six covers in the same order as the prototype fan.
]
```

Current order ends as top row 0, 1, 5 and bottom row 2, 3, 4. Index 6 exits.
Image dimensions should ideally be a 2:3 cover ratio.

## Validation

`npm run lint` and `npm run build` verify the source and production bundle.
Browser checks cover playback, seeking, replay, scroll forward/back, mobile
layout, mode-switch pin cleanup and reduced motion. Review the layout again
when replacing sample artwork with Figma assets.

## Reference

- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
