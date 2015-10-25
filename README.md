# Embetter

#### Because iframes are janky

Media embeds can quickly bog your site down, so why not lazy-load them? The basic Embetter "player" consists of a tiny template with a thumbnail image, a play button, and the essential data needed to construct the responsive iframe embed code for each service. Add a dash of javascript & css to your web page, and you have a simple, lightweight media player.

#### Mobile-happy

Since media generally can't autoplay on mobile devices, we can work around that by requesting the iframe embed when an Embetter player is fully visible in the mobile viewport. By doing this, we still lazy-load as much as possible, but each embed only needs a single tap to start playing.

#### Demo

Check out the [demo](http://cacheflowe.github.io/embetter) with the embed builder, see an [auto-playthrough playlist](http://cacheflowe.github.io/embetter/playlist/#/2-step-chunes/oG_La5R9HQk|C4xDtB_9SZM|QFxdkHRpz7Q|0Yt_Ts26PLM|VIOMoOYOTQQ|IlNNrXzi60o|F73WxhZPvJ4|4_uggscguzs|5sDW7AMoHVs|gXCN1DhHTZA|xy3RjUX3UeQ|ewHYBOCypXc|uNWTlETtuGM|B1JK9FJf0cE|mIE92NdE4ww|qpa09-OuZek|IqrYbXNnGmc|yUrOSCkoJ6w|VDqBbSBjsuw|nves7T9ThZI|OhKypM3H0iY|Z7nvb8kTPl8|Shtc5vtjui0|Aw4I7-jHw7s|YDi9i5JT5Co|lZ3KM5E8wl8|E48rwBeHf-A|MFu-PSawX1k|SgaHZIobQms|oG_La5R9HQk|mapbdUAbcrY) or see it out [in the wild](http://plasticsoundsupply.com/video).

##### Supported services & URL formats:

##### YouTube
  * Formats:
    * `https://www.youtube.com/watch?v=Fb4bCgWkZRc`
    * `https://youtube.com/watch?v=Fb4bCgWkZRc`
    * `https://youtube.com/v/Fb4bCgWkZRc`
    * `http://youtu.be/Fb4bCgWkZRc`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 4:3

##### Vimeo
  * Formats:
    * `https://vimeo.com/99276873`
  * API URL (CORS/jsonp enabled):
    * `https://vimeo.com/api/v2/video/` + videoId + `.json`
  * Thumbnail aspect ratio:
    * Variable (matches uploaded media)

##### Soundcloud
  * Formats:
    * `https://soundcloud.com/itemsandthings/chlo-live-items-things`
    * `https://soundcloud.com/cacheflowe/sets/automate-everything-2005`
    * `https://soundcloud.com/groups/berlin-minimal-techno`
  * API URL (CORS/jsonp enabled):
    * `http://api.soundcloud.com/resolve.json?url=` + mediaUrl + `&client_id=` + YourClientID + `&callback=jsonpResponse`
  * Thumbnail aspect ratio:
    * 1:1

##### Mixcloud
  * Formats:
    * `https://www.mixcloud.com/Davealex/davealex-30m-electro-2010/`
  * API URL (CORS/jsonp enabled):
    * `http://www.mixcloud.com/oembed/?url=` + mediaUrl + `&format=jsonp`
  * Thumbnail aspect ratio:
    * 1:1

##### Instagram
  * Formats:
    * `https://instagram.com/p/xekoQiQY3-/`
    * `http://instagr.am/p/xekoQiQY3-/`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 1:1

##### Dailymotion
  * Formats:
    * `http://www.dailymotion.com/video/x2681lh_the-ultimate-fainting-fails-compilation_fun`
    * `http://www.dailymotion.com/video/x2681lh`
  * API URL:
    * 4:3

##### CodePen
  * Formats:
    * `http://codepen.io/nicoptere/pen/mgpxB`
    * `http://codepen.io/nicoptere/embed/mgpxB`
  * API URL:
    * None needed
  * Thumbnail aspect ratio:
    * 1024:600

##### Bandcamp
  * Formats:
    * `https://swindleuk.bandcamp.com/album/swindle-walters-call`
    * `https://swindleuk.bandcamp.com/track/summer-fruits`
  * API URL:
    * Must scrape metatags from the album/track page.
  * Thumbnail aspect ratio:
    * 1:1

##### Ustream
  * Formats:
    * `http://www.ustream.tv/recorded/69957739`
    * `http://www.ustream.tv/NASAHDTV`
  * API URL:
    * `http://www.ustream.tv/oembed?url=` + mediaUrl
  * Thumbnail aspect ratio:
    * 4:3 most of the time...
    * 10:9 or possibly otherwise

##### Imgur
  * Formats:
    * `http://imgur.com/gallery/iKQET`
    * `http://imgur.com/USbuZSo`
  * API URL:
    * `http://api.imgur.com/oembed.json?url=` + mediaUrl
  * Thumbnail aspect ratio:
    * Variable (matches uploaded media)

##### Vine
  * Formats:
    * `https://vine.co/v/eWlADOIAEAd`
  * API URL:
    * `https://vine.co/oembed/` + vineId + `.json`
  * Thumbnail aspect ratio:
    * 1:1

##### Slideshare
  * Formats:
    * `http://www.slideshare.net/HunterLoftis1/forwardjs-we-will-all-be-game-developers`
  * API URL:
    * `http://www.slideshare.net/api/oembed/2?url=https://www.slideshare.net/` + slideshowId + `&format=json'`
  * Thumbnail aspect ratio:
    * 170:96
    * 170:121
    * 170:128
    * Variable, but 170px width


### TODO:

* More documentation about how each service gathers IDs and creates iframes
* Usage documentation
* Make Slideshare iframe responsive to thumbnail aspect ratio
* Add API onComplete callbacks where possible
