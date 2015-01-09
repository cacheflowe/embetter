# Embetter

#### Because iframes are janky

Media embeds can quickly bog your site down, so why not lazy-load them? The basic Embetter "player" consists of a tiny template with a thumbnail image, a play button, and the essential data needed to construct the responsive iframe embed code for each service. Add a dash of javascript & css to your web page, and you have a simple, lightweight media player.

#### Mobile-happy

Since media generally can't autoplay on mobile devices, we can work around that by requesting the iframe embed when an Embetter player is fully visible in the mobile viewport. By doing this, we still lazy-load as much as possible, but each embed only needs a single tap to start playing. 

#### Demo

Check out the [demo](http://cacheflowe.github.io/embetter) with the embed builder, or see it out [in the wild](http://plasticsoundsupply.com/video).

##### Supported services:

* YouTube
* Vimeo
* Soundcloud
* Mixcloud
* Instagram
* Dailymotion

