# Embetter

#### Because iframes are janky

Media embeds can quickly bog your site down, so let's lazy-load them! The basic Embetter player consists of a tiny template with a progressively-enhanced thumbnail image, a play button, and the essential data needed to construct the responsive iframe embed code. Add a dash of javascript &amp; css to your web page, and you have a simple, lightweight media player.

#### Mobile-happy

Since media generally can't autoplay on mobile devices, we work around that by populating the embed's iframe when an Embetter player is at least partially visible in the mobile viewport. By doing this, we still lazy-load (and unload) as much as possible, but each embed only needs a single tap to start playing.

#### Demo

Check out the [demo](http://cacheflowe.github.io/embetter) with the embed builder, see an [auto-playthrough playlist](http://cacheflowe.github.io/embetter/playlist/#/2-step-chunes/oG_La5R9HQk|C4xDtB_9SZM|QFxdkHRpz7Q|0Yt_Ts26PLM|VIOMoOYOTQQ|IlNNrXzi60o|F73WxhZPvJ4|4_uggscguzs|5sDW7AMoHVs|gXCN1DhHTZA|xy3RjUX3UeQ|ewHYBOCypXc|uNWTlETtuGM|B1JK9FJf0cE|mIE92NdE4ww|qpa09-OuZek|IqrYbXNnGmc|yUrOSCkoJ6w|VDqBbSBjsuw|nves7T9ThZI|OhKypM3H0iY|Z7nvb8kTPl8|Shtc5vtjui0|Aw4I7-jHw7s|YDi9i5JT5Co|lZ3KM5E8wl8|E48rwBeHf-A|MFu-PSawX1k|SgaHZIobQms|oG_La5R9HQk|mapbdUAbcrY) or see it out [in the wild](http://plasticsoundsupply.com/video).

#### Usage

Add Embetter embed codes to your markup:

```
<div class="embetter" data-vimeo-id="99276873">
  <a href="https://vimeo.com/99276873" target="_blank"><img src="https://i.vimeocdn.com/video/480405928_640.webp"></a>
</div>
```

Tell Embetter's JavaScript to activate any players on the page, or within a specific container. Be sure to pass in the 3rd-party services you'd like to enable:

```
var embedServices = [
  window.embetter.services.youtube,
  window.embetter.services.vimeo,
  window.embetter.services.soundcloud
];
window.embetter.utils.initMediaPlayers(document.body, embedServices);
```

Dispose any existing players before you switch pages in your single-page app:

```
window.embetter.utils.disposePlayers();
```

Stop all active embeds, in case you need to:

```
window.embetter.utils.unembedPlayers(document.body)
```

Get media complete callbacks from YouTube, Vimeo and Soundcloud embeds via their iframe .js APIs. This is useful to scroll your page to the next player contained in an element with `data-embetter-playlist="true"`.

```
window.embetter.apiEnabled = true;
window.embetter.apiAutoplayCallback = function(playerEl) {
  window.scrollTo(0, window.scrollY - playerEl.offsetTop + 50);
};

```

#### How it works

On it's own, an Embetter embed code is just a clickable thumbnail that takes you to the source 3rd-party media page. After activation via `initMediaPlayers`, each Embetter player becomes clickable and has all of the data it needs to construct an iframe, which stretches to match the size of the preview thumbnail. This information is stored as a data attribute on the `.embetter` wrapper div and is extracted via API calls, regex capturing, or metatag scraping. Additional operations on this data helps us handle special cases per service. The `embetter-builder.js` file contains the logic to properly extract the necessary data for each type of embed, and operates on URLs, CORS-enabled APIs (usually oembed services), or locally-`curl`ed demo files to explain and test the behavior. Most likely, you'd want to port this behavior to your backend if you need to do this on the fly. Some services have several types of embeds that require different data to be stored, and some have extra css that adds custom layout and state behavior. When it comes down to it, however, we only need a single string (an id of some kind) to interpolate into a predefined iframe src template per service.


## Supported services & URL formats:

##### YouTube
  * Formats:
    * `https://www.youtube.com/watch?v=Fb4bCgWkZRc`
    * `https://youtube.com/watch?v=Fb4bCgWkZRc`
    * `https://youtube.com/v/Fb4bCgWkZRc`
    * `http://youtu.be/Fb4bCgWkZRc`
  * Regex:
    * `/(?:.+?)?(?:youtube\.com\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/`
    * Captures id: `Fb4bCgWkZRc`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 4:3

##### Vimeo
  * Formats:
    * `https://vimeo.com/99276873`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?vimeo.com\/(\S*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `99276873`
  * API URL (CORS/jsonp enabled):
    * `https://vimeo.com/api/v2/video/` + videoId + `.json`
  * Thumbnail aspect ratio:
    * Variable (matches uploaded media)

##### Soundcloud
  * Formats:
    * `https://soundcloud.com/itemsandthings/chlo-live-items-things`
    * `https://snd.sc/cacheflowe/sets/automate-everything-2005`
    * `https://soundcloud.com/groups/berlin-minimal-techno`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?(?:soundcloud.com|snd.sc)\/([a-zA-Z0-9_-]*(?:\/sets)?(?:\/groups)?\/[a-zA-Z0-9_-]*)(?:\/?|$|\s|\?|#)/`
    * Captures path: `itemsandthings/chlo-live-items-things` or `cacheflowe/sets/automate-everything-2005`
  * API URL (CORS/jsonp enabled):
    * `http://api.soundcloud.com/resolve.json?url=` + mediaUrl + `&client_id=` + YourClientID + `&callback=jsonpResponse`
  * Thumbnail aspect ratio:
    * 1:1

##### Instagram
  * Formats:
    * `https://instagram.com/p/xekoQiQY3-/`
    * `http://instagr.am/p/xekoQiQY3-/`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?(?:instagram.com|instagr.am)\/p\/([a-zA-Z0-9-_]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `xekoQiQY3-`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 1:1

##### Giphy
  * Formats:
    * `https://giphy.com/gifs/ken-lee-3ESp1RAn7PjOw`
    * `https://giphy.com/gifs/3ESp1RAn7PjOw`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?giphy.com\/gifs\/([a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `3ESp1RAn7PjOw`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * Variable (matches original .gif)

##### Mixcloud
  * Formats:
    * `https://www.mixcloud.com/Davealex/davealex-30m-electro-2010/`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?(?:mixcloud.com)\/(.*\/.*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `Davealex/davealex-30m-electro-2010`
  * API URL (CORS/jsonp enabled):
    * `http://www.mixcloud.com/oembed/?url=` + mediaUrl + `&format=jsonp`
  * Thumbnail aspect ratio:
    * 1:1

##### Dailymotion
  * Formats:
    * `http://www.dailymotion.com/video/x2681lh_the-ultimate-fainting-fails-compilation_fun`
    * `http://www.dailymotion.com/video/x2681lh`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?dailymotion.com\/video\/([a-zA-Z0-9-_]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `x2681lh`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 4:3

##### CodePen
  * Formats:
    * `http://codepen.io/nicoptere/pen/mgpxB`
    * `http://codepen.io/nicoptere/embed/mgpxB`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?(?:codepen.io)\/([a-zA…A-Z0-9_\-%]*\/[a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `nicoptere/embed/mgpxB`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 1024:600

##### Shadertoy
  * Formats:
    * `https://www.shadertoy.com/view/4dfGzs`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?shadertoy.com\/view\/([a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `4dfGzs`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 16:9

##### Bandcamp
  * Formats:
    * `https://swindleuk.bandcamp.com/album/swindle-walters-call`
    * `https://swindleuk.bandcamp.com/track/summer-fruits`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?([a-zA-Z0-9_\-]*.bandcamp.com\/(album|track)\/[a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `album=2659930103` and `track=1312622119`
  * API URL:
    * Must scrape metatags from the album/track page.
  * Thumbnail aspect ratio:
    * 1:1

##### Ustream
  * Formats:
    * `http://www.ustream.tv/channel/almost-home-adoptions-cat-cam`
    * `http://www.ustream.tv/recorded/69957739`
    * `http://www.ustream.tv/NASAHDTV`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?(?:ustream.tv|ustre.am)\/((?:(recorded|channel)\/)?[a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `channel/almost-home-adoptions-cat-cam` or `recorded/69957739` or `NASAHDTV`
  * API URL:
    * `http://www.ustream.tv/oembed?url=` + mediaUrl
  * Thumbnail aspect ratio:
    * 4:3 most of the time...
    * 10:9 or possibly otherwise

##### Imgur
  * Formats:
    * `http://imgur.com/gallery/iKQET`
    * `http://imgur.com/USbuZSo`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?(?:imgur.com)\/((?:gallery\/)?[a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `gallery/iKQET` and `USbuZSo`
  * API URL:
    * `http://api.imgur.com/oembed.json?url=` + mediaUrl
    * Must scrape metatags from the Imgur page, since the oembed service doesn't provide a thumbnail URL.
  * Thumbnail aspect ratio:
    * Variable (matches uploaded media)

##### Vine
  * Formats:
    * `https://vine.co/v/eWlADOIAEAd`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?vine.co\/v\/([a-zA-Z0-9-]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `eWlADOIAEAd`
  * API URL:
    * `https://vine.co/oembed/` + vineId + `.json`
  * Thumbnail aspect ratio:
    * 1:1

##### Slideshare
  * Formats:
    * `http://www.slideshare.net/HunterLoftis1/forwardjs-we-will-all-be-game-developers`
  * Regex:
    * `/(?:https?:\/\/)?(?:w{3}\.)?slideshare.net\/([a-zA-Z0-9_\-%]*\/[a-zA-Z0-9_\-%]*)(?:\/?|$|\s|\?|#)/`
    * Captures id: `eWlADOIAEAd`
  * API URL:
    * `http://www.slideshare.net/api/oembed/2?url=https://www.slideshare.net/` + slideshowId + `&format=json'`
  * Thumbnail aspect ratio:
    * 170:96
    * 170:121
    * 170:128
    * Variable, but 170px width


### TODO:

* More documentation about how each service gathers IDs to create iframes - add iframe src construction example
* Usage documentation - full API
* Add info about special per-service handling
* Make Slideshare iframe responsive to thumbnail aspect ratio
