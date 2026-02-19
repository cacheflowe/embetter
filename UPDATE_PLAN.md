# Embetter modernization plan

Embetter is a web component that provides a modern way to embed content from various platforms like YouTube, Vimeo, and more. The goal is to modernize the codebase, improve performance, and enhance maintainability.

The old style of embed looked like this:

```html
<div class="embetter" data-youtube-id="l9XdkPsaynk"><a href="https://www.youtube.com/watch?v=l9XdkPsaynk" target="_blank"><img src="http://img.youtube.com/vi/l9XdkPsaynk/0.jpg"></a></div>
```

The new style of embed looks like this:

```html
<embetter-media youtube-id="l9XdkPsaynk"><a href="https://www.youtube.com/watch?v=l9XdkPsaynk" target="_blank"><img src="http://img.youtube.com/vi/l9XdkPsaynk/0.jpg"></a></embetter-media>
```

Some embeds need a poster attribute if the thumbnail can't be inferred from the ID:

```html
<embetter-media bandcamp-id="album=2659930103" poster="https://f4.bcbits.com/img/a0883249002_16.jpg"></embetter-media>
```

- [x] Replace normalize.css and skeleton.css with picocss
- [x] Start embetter-media web component
  - [x] Use the template from `.github/copilot-instructions.md`
  - [x] Use shadow root so the component looks the same on all sites
  - [x] Add support for all embed types
- [x] Replace `reqwest` with `fetch`
- [x] Move embetter.js into the web component
  - [x] Externalize services into individual files (YouTube, Vimeo, etc.)
    - [x] YouTube
    - [x] Vimeo (async thumbnail via API)
    - [x] SoundCloud (oEmbed proxy for thumbnails, embed via soundcloud.com URL)
    - [x] Instagram (embed only, no thumbnail — Instagram blocks server-side access)
    - [x] Dailymotion
    - [x] Mixcloud (oEmbed proxy for thumbnails)
    - [x] CodePen (thumbnail via codepen.io image URL)
    - [x] Bandcamp (proxy to scrape album/track ID and thumbnail from page HTML)
    - [x] Giphy
    - [x] Video (native .mp4/.mov/.m4v)
    - [x] GIF (native .gif)
    - [x] Shadertoy (commented out — Shadertoy blocks iframe embedding via X-Frame-Options)
    - [x] Kuula (commented out — needs verification)
    - Skipped: Vine, Ustream, Imgur, Slideshare (defunct/broken)
  - [x] Handle thumbnail - poster vs. auto-inferred vs. light DOM `<a><img>` fallback
  - [x] Handle "autoplay" attribute
  - [x] Handle "loops" attribute (YouTube, Vimeo, native video)
  - [x] Handle "muted" attribute
  - [x] Handle "loading" attribute (set before thumbnail loads)
  - [x] Handle "ready" attribute (set when thumbnail loads or errors)
  - [x] Handle "playing" attribute (set when embed is active)
  - [x] Handle "aspect-ratio" attribute (custom CSS property)
  - [x] Move embetter-builder.js functions into the service-specific files
  - [x] Turn specific files into ES6 modules
- [x] Modernize embetter.css
  - [x] Scope styles to live inside Web Component
  - [x] Use :host pseudo-class to style the component
  - [x] Add custom CSS per service (audio services get round play button)
  - [x] CSS-only loading spinner (replaced base64 GIF)
  - [x] Support for `img.gif` and `video` elements in playing state
- [x] Build embetter.js into a global and module JS file to use on other sites
  - [x] Vite library mode: dist/embetter-media.js (ES) and dist/embetter-media.umd.js (UMD)
  - [x] package.json with "main", "module", "exports" fields
- [x] Rebuild embetter-builder interface to generate `embetter-media` elements
  - [x] `EmbetterMedia.componentMarkupFromURL()` converts URLs to component markup
  - [x] Paste-URL-to-build-embed demo in index.html
  - [x] Generated markup includes `<a><img>` fallback for crawlers/progressive enhancement
  - [x] Component reads thumbnail from light DOM `<img>` if no poster attribute
- [x] Default behavior:
  - [x] Opening a player closes any other open players via EMBETTER_ACTIVATED event
  - [x] On mobile, IntersectionObserver auto-embeds/unembeds on scroll
- [x] Vite dev server proxies for CORS-blocked APIs:
  - [x] `/api/mixcloud` → Mixcloud oEmbed
  - [x] `/api/soundcloud` → SoundCloud oEmbed
  - [x] `/api/bandcamp` → custom middleware (fetches page HTML, scrapes album/track ID + thumbnail)
- [x] Updated README.md with new web component API
- [x] Publish to npmx

## Remaining / Future work

- [ ] API integrations to enable playlist behavior
- [ ] Opening a player should scroll the page to the player
- [ ] Re-enable Shadertoy if they allow iframe embedding again
- [ ] Re-enable Kuula after verifying it works
