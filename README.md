# Space Exploration

An interactive Three.js tour of the solar system. Fly to any planet, change the speed, line the planets
up, and read a few facts about each one. Inspired by [NASA's planets overview](https://science.nasa.gov/solar-system/planets/).

**Live:** https://karen-le.vercel.app/space/

I first built this in 2021 while learning Three.js at Fullstack Academy. In 2026 I rebuilt it: real orbits
instead of fixed positions, a single pinned version of Three.js loaded as ES modules, planet surfaces
painted in code, and an interface that works with a keyboard and on phones.

## How it works

| File | What it does |
| --- | --- |
| `index.html` | Page, interface and an import map that pins Three.js 0.160 from a CDN |
| `src/main.js` | Scene, orbits, camera flights, "align planets", labels and the render loop |
| `src/bodies.js` | Sizes, orbit radii, periods and facts for each body |
| `src/textures.js` | Planet surfaces generated from 3D noise on canvas (no image files) |
| `style.css` | Interface styles |

Sizes and distances are compressed so everything fits on screen. Orbit and day lengths keep their real
ratios: one Earth year takes 30 seconds at 1× speed.

## Run it

It's a static site with no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.
