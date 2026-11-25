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
