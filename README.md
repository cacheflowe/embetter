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

Add `<embetter-media>` elements to your page with the appropriate service attribute:

```html
<!-- Simple: thumbnail auto-derived from ID -->
<embetter-media youtube-id="l9XdkPsaynk"></embetter-media>

<!-- With fallback content for crawlers/progressive enhancement -->
<embetter-media vimeo-id="99276873"><a href="https://vimeo.com/99276873" target="_blank"><img src="https://i.vimeocdn.com/video/..."></a></embetter-media>

<!-- Fallback content also provides the thumbnail to the component -->
<embetter-media soundcloud-id="user/track-name"><a href="https://soundcloud.com/user/track-name" target="_blank"><img src="https://i1.sndcdn.com/..."></a></embetter-media>
```

The `<a><img>` inside the element serves two purposes:
1. **Progressive enhancement** — crawlers and no-JS browsers see a clickable thumbnail
2. **Thumbnail source** — the component reads the `<img src>` for its shadow DOM thumbnail

### Attributes

| Attribute  | Description |
|------------|-------------|
| `aspect-ratio` | Optional ratio override (examples: `16/9`, `1/1`, `4/5`) |
| `autoplay` | Set to `"false"` to disable autoplay on embed (default: `true`) |
| `loops`    | Loop the media on completion |
| `muted`    | Mute the media on embed |

### URL Builder

Build `<embetter-media>` markup from a URL programmatically:

```js
import EmbetterMedia from "embetter";

EmbetterMedia.componentMarkupFromURL("https://www.youtube.com/watch?v=l9XdkPsaynk", (html, service) => {
  document.body.insertAdjacentHTML("beforeend", html);
});
```

### Mobile

On mobile devices, an IntersectionObserver automatically embeds media when it scrolls into view and unembeds it when it leaves the viewport.

### Single Active Player

Only one embed plays at a time. Clicking a new player automatically closes the previously active one.

## Supported Services

| Service     | Attribute         | Thumbnail | Notes |
|-------------|-------------------|-----------|-------|
| YouTube     | `youtube-id`      | Auto      | |
| Vimeo       | `vimeo-id`        | Async     | Use `poster` attribute or thumbnail is fetched via API |
| SoundCloud  | `soundcloud-id`   | Async     | Use `poster` attribute recommended |
| Instagram   | `instagram-id`    | Async     | Supports `p/`, `reel/`, `tv/`; thumbnail + dimensions fetched via oEmbed when available |
| Dailymotion | `dailymotion-id`  | Auto      | |
| Mixcloud    | `mixcloud-id`     | Async     | Use `poster` attribute recommended |
| CodePen     | `codepen-id`      | Auto      | Format: `user/pen/slug` |
| Bandcamp    | `bandcamp-id`     | Manual    | Requires `poster` attribute; ID is `album=123` or `track=456` |
| Giphy       | `giphy-id`        | Auto      | |
| Video       | `video-url`       | Auto      | Native .mp4/.mov/.m4v files |
| GIF         | `gif-url`         | Auto      | Native .gif files |

## Development

```
npm install
npm run dev     # Start dev server
npm run build   # Build for distribution
npm run preview # Preview production build
```
