# Ojo David Oluwadarasimi | Portfolio

Cinematic Engineering portfolio. Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure
- `index.html` page markup, SEO and Open Graph tags
- `css/style.css` design tokens, layout, motion and responsive rules
- `js/main.js` menu, scroll reveals, particle field, copy email, parallax
- `assets/` transparent portrait (`portrait.webp`, `portrait-sm.webp`), `og.jpg`, `favicon.svg`

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Deploy
Netlify: drag this folder in, or connect the repository (publish directory is the root, no build command).

## Project banners
Banners live in `assets/scorewise.webp` and `assets/kicks-and-cuffs.webp`. To change one, replace the file keeping the same name; each `.vis` block in `index.html` sets its own aspect ratio with `--ar`.

## Design tokens
Accent `#00E676`, background `#090B0D`. Change them in `:root` at the top of `css/style.css`.

## Upgrade notes
- New sections: Engineering Approach, Currently Building, case studies (inside each project), Engineering Notebook, Systems Lab, GitHub.
- `css/sections.css` styles the new sections. `js/data.js` holds Notebook articles, planned lab experiments and the repo list: add real entries there only.
- `js/github.js` loads public repo info from the GitHub API and falls back to static text if it fails.
- Résumé: `assets/Ojo-David-Oluwadarasimi-Resume.pdf` (linked from About and Contact).

## Capabilities
- `css/capabilities.css`: "What I Can Build" (6 cards, real screenshots for 01 to 03, labelled illustrative graphics for 04 to 06).

## Motion layer
- `js/typing.js`: About "Read more" types the rest of the text like a person (variable speed, punctuation pauses, hesitations, corrected typos). Runs on timers, so it continues while scrolling. "Skip typing" finishes instantly.
- `js/motion.js` + `css/motion.css`: scroll progress bar, cards that fold open as they scroll in, 3D tilt and spotlight on hover, magnetic buttons, skills marquee bands, and the eyes that peek in, follow the pointer and blink.
- `js/bg.js`: now also draws a 3D wireframe that spins with scroll and leans toward the pointer.
- All of it is off for visitors who prefer reduced motion.

## Background tire
A faint vertical tire sits at the right edge and rolls with scroll (js/bg.js, tire()). Opacity and size are set on the `vis` and `R` lines if you want it even quieter.

## What I Can Build
Shows the three cards that have real screenshots.

## 3D vehicle (optional, needs your model)
`js/vehicle.js` (Three.js bundled, source in the build step) loads `assets/car.glb` if it exists. Until you add that file nothing runs and the tire stays.
- assets/car.glb is the Revuelto 3.0 by SDC PERFORMANCE (CC BY 4.0), resized and compressed. The footer credit is required by that licence, keep it. Replace the file to use another model (Draco and Meshopt work).
- If the car faces the wrong way, change `facing` in the CFG line of the source (Math.PI or 0) and rebuild.
- Shows only in About, Approach, Technologies, Currently Building and Interests at low opacity; hidden in Hero, Projects, What I Can Build, Notebook, Lab, GitHub and Contact.
- Engine sound is synthesised with Web Audio (no recordings). It is off until the visitor presses the Engine button.
