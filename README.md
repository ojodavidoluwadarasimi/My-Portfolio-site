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

## Adding project screenshots
In `index.html`, inside each `.vis` block, add above the `.plate` div:
`<img src="assets/scorewise.webp" alt="..." loading="lazy" onload="this.parentElement.classList.add('has-shot')">`
The placeholder panel hides itself once the image loads.

## Design tokens
Accent `#00E676`, background `#090B0D`. Change them in `:root` at the top of `css/style.css`.
