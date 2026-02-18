# Embetter

#### Because iframes are janky

Media embeds can quickly bog your site down, so let's lazy-load them! Embetter is a self-contained web component (`<embetter-media>`) that displays a thumbnail with a play button, then lazy-loads the actual iframe embed when clicked.

#### Demo

Check out the [demo](http://cacheflowe.github.io/embetter).

## Installation

### npm

```
npm install embetter
```

```js
import "embetter";
```

### Script tag

```html
<script type="module" src="dist/embetter-media.js"></script>
```

## Usage

There are two ways to use Embetter:

### Minimal markup (thumbnail auto-derived)

For services that can derive a thumbnail from the ID alone (YouTube, Dailymotion, Giphy, CodePen), you only need the service attribute:

```html
<embetter-media youtube-id="l9XdkPsaynk"></embetter-media>

<embetter-media dailymotion-id="x14y6rv"></embetter-media>

<embetter-media giphy-id="26FfiRH4zeXJM7saY"></embetter-media>

<embetter-media codepen-id="cacheflowe/pen/domZpQ"></embetter-media>
```

### Full progressive-enhanced markup (recommended)

For the best experience, include an `<a><img>` inside the element. This serves as both a fallback for crawlers/no-JS browsers and the thumbnail source for the component. Use the URL builder (below) to generate this markup, or construct it by hand:

```html
<!-- YouTube -->
<embetter-media youtube-id="l9XdkPsaynk">
  <a href="https://www.youtube.com/watch?v=l9XdkPsaynk">
    <img src="http://img.youtube.com/vi/l9XdkPsaynk/0.jpg" />
  </a>
</embetter-media>

<!-- Vimeo (thumbnail must be fetched via API or provided manually) -->
<embetter-media vimeo-id="99276873">
  <a href="https://vimeo.com/99276873">
    <img src="https://i.vimeocdn.com/video/480405928-...-d_640" />
  </a>
</embetter-media>

<!-- SoundCloud -->
<embetter-media soundcloud-id="swufm/dan-kelly-with-sinjin-hawke">
  <a href="https://soundcloud.com/swufm/dan-kelly-with-sinjin-hawke">
    <img src="https://i1.sndcdn.com/artworks-...-t500x500.jpg" />
  </a>
</embetter-media>

<!-- Bandcamp (album/track ID and thumbnail must be scraped or provided manually) -->
<embetter-media bandcamp-id="album=462033739">
  <a href="https://client03.bandcamp.com/album/testbed-assembly">
    <img src="https://f4.bcbits.com/img/a2546679205_16.jpg" />
  </a>
</embetter-media>

<!-- Mixcloud -->
<embetter-media mixcloud-id="Rumpel_Star/the-sound-of-the-eighties-7-a-funky-soulful-trip-through-the-80s-lost-treasures/">
  <a href="https://www.mixcloud.com/Rumpel_Star/the-sound-of-the-eighties-7-a-funky-soulful-trip-through-the-80s-lost-treasures/">
    <img src="https://thumbnailer.mixcloud.com/unsafe/600x600/extaudio/c/4/d/9/9235-5d20-4caf-8ec6-2f05c76dec34" />
  </a>
</embetter-media>

<!-- Native video file -->
<embetter-media video-url="videos/my-video.mp4" loops>
  <a href="videos/my-video.mp4">
    <img src="videos/my-video-poster.jpg" />
  </a>
</embetter-media>

<!-- Native GIF -->
<embetter-media gif-url="images/animation.gif">
  <a href="images/animation.gif">
    <img src="images/animation-poster.png" />
  </a>
</embetter-media>
```

### Attributes

| Attribute      | Description |
|----------------|-------------|
| `autoplay`     | Set to `"false"` to disable autoplay on embed (default: `true`) |
| `loops`        | Loop the media on completion (YouTube, Vimeo, native video) |
| `muted`        | Mute the media on embed |

### URL Builder

Build full `<embetter-media>` markup from a URL programmatically. This fetches thumbnails from service APIs and generates the complete progressive-enhanced markup:

```js
import EmbetterMedia from "embetter";

EmbetterMedia.componentMarkupFromURL("https://www.youtube.com/watch?v=l9XdkPsaynk", (html, service) => {
  // html contains the full <embetter-media> element with <a><img> fallback
  document.body.insertAdjacentHTML("beforeend", html);
});
```

### Legacy Upgrade

If you have old Embetter embeds using the `<div class="embetter" data-*-id="...">` format, upgrade them all to web components with a single call:

```js
import EmbetterMedia from "embetter";

EmbetterMedia.upgradeLegacyEmbeds(); // upgrades all .embetter divs on the page
EmbetterMedia.upgradeLegacyEmbeds(myContainer); // or scope to a specific container
```

### Mobile

On mobile devices, an IntersectionObserver automatically embeds media when it scrolls into view and unembeds it when it leaves the viewport.

### Single Active Player

Only one embed plays at a time. Clicking a new player automatically closes the previously active one.

## Supported Services

| Service     | Attribute         | Thumbnail        | Notes |
|-------------|-------------------|------------------|-------|
| YouTube     | `youtube-id`      | Auto from ID     | |
| Vimeo       | `vimeo-id`        | Needs `<a><img>` | Thumbnail URL fetched via Vimeo API or provided manually |
| SoundCloud  | `soundcloud-id`   | Needs `<a><img>` | Thumbnail via oEmbed proxy or provided manually |
| Dailymotion | `dailymotion-id`  | Auto from ID     | |
| Mixcloud    | `mixcloud-id`     | Needs `<a><img>` | Thumbnail via oEmbed proxy or provided manually |
| CodePen     | `codepen-id`      | Auto from ID     | Format: `user/pen/slug` |
| Bandcamp    | `bandcamp-id`     | Needs `<a><img>` | ID is `album=123` or `track=456`; thumbnail provided manually |
| Giphy       | `giphy-id`        | Auto from ID     | |
| Video       | `video-url`       | Needs `<a><img>` | Native .mp4/.mov/.m4v files |
| GIF         | `gif-url`         | Needs `<a><img>` | Native .gif files |

## Development

```
npm install
npm run dev     # Start dev server
npm run build   # Build for distribution
npm run preview # Preview production build
```
