# Ansari Tours & Rent a Car — Website

A cinematic, multi-page marketing site: plain HTML/CSS/JS, no build step,
so you can host it anywhere and edit it directly.

## Files
```
index.html      Home — cinematic hero, services, fleet & tour previews
fleet.html      Full fleet listing with filters (sedan / SUV / coaster)
tours.html      Tour packages: Northern PK, Murree/Galiyat, All-PK, Custom
about.html      Story + values
contact.html    Booking form (opens pre-filled WhatsApp) + contact details
css/style.css   All design tokens, layout, components
js/main.js      Nav, scroll reveal, parallax, route-line animation, form
robots.txt      SEO — allow crawling
sitemap.xml     SEO — page list for search engines
```

## First things to replace (search for these)
1. **Phone / WhatsApp number** — currently `923001234567` (shown as
   `+92 300 1234567`). It appears in every page's footer, the floating
   WhatsApp button, the hero CTA, and `data-whatsapp` on the contact form.
   Do a find-and-replace across all `.html` files for `923001234567`.
2. **Email** — `info@ansaritravels.pk`, in every footer + contact.html.
3. **Address** — "Mandi Bahauddin, Punjab, Pakistan", in every footer +
   contact.html + the JSON-LD block in `index.html`.
4. **Photos** — every `<img>` and `background-image` currently points to a
   stock Unsplash photo (clearly placeholder). Replace `src`/`url(...)`
   with your own photos of your actual cars, drivers, and past trips —
   this is the single biggest upgrade you can make to the site's realism.
5. **Prices** — fleet.html and the homepage fleet preview have sample
   daily rates (Rs 5,500 – Rs 28,000). Update to your real, current rates.
6. **Testimonials** — the 3 reviews on the homepage are placeholders,
   clearly labeled. Swap in real customer quotes once you have them.
7. **Domain** — `https://www.ansaritravels.pk/` is used in canonical tags,
   Open Graph tags, and sitemap.xml. Update once you register a domain.

## How the "cinematic" parts work
- **Hero depth**: two image layers (`hero-layer bg` / `hero-layer mid`)
  move at different speeds on mouse-move and slow-zoom (Ken Burns) on
  load — that's the parallax/tilt effect.
- **Parallax bands**: the full-width photo sections (e.g. "Hunza and
  Skardu don't need a filter") shift slower than the page scroll via
  `data-parallax` + `js/main.js`.
- **Route line**: the thin gold line running down the left edge on wide
  screens draws itself as you scroll — a signature motif tying the whole
  site to "a journey." It's pure SVG + scroll math, no library.
- **Scroll reveals**: sections fade/rise into view via `IntersectionObserver`
  (the `.reveal` class). Add `class="reveal"` to any new block to get it.
- All motion respects `prefers-reduced-motion` automatically.

## Editing content
No templating system — each page is a full standalone HTML file, so
edits are a normal find-and-replace. If you later move to a CMS or the
MERN stack (you already know it), the fleet/tour cards are simple enough
to generate from a JSON array or a small Express API without changing
the visual design.

## SEO checklist already in place
- Unique `<title>` and meta description per page
- `canonical` tags, Open Graph tags, JSON-LD `TravelAgency` schema on the
  homepage
- Descriptive `alt` text on every image
- `robots.txt` + `sitemap.xml`
- Semantic headings (one `<h1>` per page)

Still to do once live: submit the sitemap in Google Search Console, and
add real, non-stock photos (search engines and users both favor original
images over generic stock).

## Performance / maintainability notes
- No frameworks or build step — open any `.html` file and edit directly.
- Images are `loading="lazy"` except the hero.
- Fonts load from Google Fonts (Fraunces, Manrope, Space Mono); swap the
  `<link>` in each page's `<head>` if you change the type system.
- Mobile nav, filters, and the booking form are all vanilla JS in
  `js/main.js` — no dependencies to keep updated.

## Deploying
Any static host works: Vercel, Netlify, GitHub Pages, or a shared
hosting cPanel. Drop the whole folder in — no build command needed.

## Next steps worth doing
- Wire the contact form to a real backend (Formspree, Google Sheets via
  Apps Script, or your own Express/MongoDB endpoint) if you want
  submissions saved somewhere besides WhatsApp.
- Add a Google Maps embed on contact.html once you have a fixed office
  location.
- Replace all Unsplash placeholders with real fleet/location photography.
