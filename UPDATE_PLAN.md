# Embetter modernization plan

Embetter is a web component that provides a modern way to embed content from various platforms like YouTube, Vimeo, and more. The goal is to modernize the codebase, improve performance, and enhance maintainability.

The old style of embed looked like this:

```html
<div class="embetter" data-youtube-id="l9XdkPsaynk"><a href="https://www.youtube.com/watch?v=l9XdkPsaynk" target="_blank"><img src="http://img.youtube.com/vi/l9XdkPsaynk/0.jpg"></a></div>
```

The new style of embed will look like this:

```html
<embetter-media youtube-id="l9XdkPsaynk"></embetter-media>
```

Some of the embeds might need a poster attribute, like this,. if the thumbail can't be inferred from the ID:

```html
<embetter-media shadertoy-id="4dfGzs" poster="https://www.shadertoy.com/media/shaders/embed.jpg"></embetter-media>
```


- [x] Replace normalize.css and skeleton.css with picocss
- [x] Start embetter-media web component
  - [x] Use the template from `.github/copilot-instructions.md`
  - [x] Use shadow root so the component looks the same on all sites
  - [ ] [WIP] Add support for additional embed types (e.g., Vimeo, SoundCloud)
- [ ] Replace `reqwest` with `fetch`
- [x] Move embetter.js into the web component
  - [ ] [WIP] Externalize services into indivdual files (Youtube, Vimeo, etc.)
    - [ ] [WIP] Start with youtube and convert from there
  - [x] Handle thumbnail - poster vs. auto-inferred
  - [ ] Handle "autoplay" attribute
  - [ ] Handle "loops" attribute
  - [ ] Handle "muted" attribute
  - [ ] Handle "loading" attribute
  - [ ] Handle "ready" attribute
  - [ ] Handle "playing" attribute
  - [ ] [WIP] Move embetter-builder.js functions into the service-specific files
  - [ ] Turn specific files into es6 modules
- [ ] Modernize embetter.css
  - [x] Scope styles to live inside Web Component
  - [x] Use host: pseudo-class to style the component
  - [ ] [WIP] Add custom css per service for different aspect ratios
- [ ] Build embetter.js into a global and module js file to use on other sites
  - [ ] Should be a Vite build step?
- [ ] Change default background img to an svg instead of base64 image
- [ ] Change any thumbnails to an svg instead of base64 image. gif loader for example
- [x] Rebuild embetter-builder interface to generate `embetter-media` elements
  - [ ] Use ./sample-data to help test loading embeds
  - [ ] Revisit latest embed techniques from each service
  - [ ] Keep <a><img></a> fallback in embed code for old embeds / non-JS browsers. But we could have a "lite" embed with just the <embetter-media> tag.
- [ ] Default behavior:
  - [x] Opening a player closes any other open players - need to add a document event 
  - [ ] On mobile, scrolling a player into view should auto-embed
  - [ ] Playlist legacy behavior
    - [ ] API integrations to enable playlist behavior
    - [ ] Opening a player should scroll the page to the player
- [ ] Add a dark/light theme