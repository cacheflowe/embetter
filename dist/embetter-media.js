let m = (
  /* css */
  `

  :host {
    --anim-speed: 0.25s;
    --embetter-aspect-ratio: auto;
    transition: background-color var(--anim-speed) linear, max-width var(--anim-speed) linear, max-height var(--anim-speed) linear;
    background-color: #000;
    position: relative;
    display: block;
    overflow: hidden;
    padding: 0;
    aspect-ratio: var(--embetter-aspect-ratio);
  }

  :host(:hover) {
    background-color: #000;
    border-color: #ffc;

    img {
      opacity: 0.9;
      transform: scale(1.02);
    }
    img.gif {
      opacity: 1;
      transform: initial;
    }
  }

  :host([playing]) {
    img {
      opacity: 0;
    }
    img.gif {
      opacity: 1;
    }

    .embetter-play-button {
      opacity: 0;
      pointer-events: none;
    }

    .embetter-loading {
      opacity: 1;
    }
  }

  :host([youtube-id]),
  :host([dailymotion-id]) {
    padding-bottom: 56.25%;
    height: 0;

    img {
      margin: -9.4% 0;
    }
  }

  :host([soundcloud-id]),
  :host([mixcloud-id]),
  :host([bandcamp-id]) {
    max-width: 660px;

    .embetter-play-button:before {
      background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2228%22%20fill%3D%22%23010101%22/%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M24%2018v24l20-12z%22/%3E%3C/svg%3E');
      background-size: 60px 60px;
      border-radius: 50%;
    }
  }

  a {
    display: block;
    line-height: 0;
    margin: 0;
  }

  img {
    transition: opacity var(--anim-speed) linear, transform var(--anim-speed) linear;
    width: 100%;
    margin: 0;
    display: block;
  }

  iframe,
  video,
  img.gif {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 1;
  }

  .embetter-play-button,
  .embetter-loading {
    transition: opacity 0.25s linear;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .embetter-play-button:before {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2286%22%20height%3D%2260%22%20viewBox%3D%220%200%2086%2060%22%3E%3Cpath%20fill%3D%22%23010101%22%20d%3D%22M0%200h86v60h-86z%22/%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M35.422%2017.6v24.8l22.263-12.048z%22/%3E%3C/svg%3E');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 33.333% auto;
    width: 100%;
    max-width: 258px;
    height: 100%;
    min-height: 100%;
    content: " ";
    margin: 0 auto;
    display: block;
  }

  .embetter-loading {
    background-color: #000;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .embetter-loading:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: embetter-spin 0.8s linear infinite;
  }

  @keyframes embetter-spin {
    to { transform: rotate(360deg); }
  }

`
);
class p {
  static type = "youtube";
  static dataAttribute = "youtube-id";
  static regex = /(?:.+?)?(?:youtube\.com\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/;
  static embed(t) {
    const i = t.autoplay === !0 ? "&autoplay=1" : "", e = t.loops === !0 ? `&loop=1&playlist=${t.id}` : "";
    return `<iframe class="video" enablejsapi="1" width="${t.w}" height="${t.h}" src="https://www.youtube.com/embed/${t.id}?rel=0&suggestedQuality=hd720&enablejsapi=1${i}${e}" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }
  static thumbnail(t) {
    return "http://img.youtube.com/vi/" + t + "/0.jpg";
  }
  static link(t) {
    return "https://www.youtube.com/watch?v=" + t;
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex)[1];
    if (e != null) {
      const a = this.link(e), s = this.thumbnail(e);
      i(e, a, s);
    }
  }
}
class b {
  static type = "vimeo";
  static dataAttribute = "vimeo-id";
  // Matches vimeo.com/12345678 or player.vimeo.com/video/12345678
  static regex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i;
  static embed(t) {
    const i = t.autoplay === !0 ? "&autoplay=1" : "", e = t.loops === !0 ? "&loop=1" : "";
    return `<iframe id="${t.id}" src="https://player.vimeo.com/video/${t.id}?title=0&byline=0&portrait=0&color=ffffff&api=1&player_id=${t.id}${i}${e}" width="${t.w}" height="${t.h}" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }
  static thumbnail(t) {
    return "";
  }
  static link(t) {
    return "https://vimeo.com/" + t;
  }
  static getData(t) {
    return new Promise((i, e) => {
      const a = `https://vimeo.com/api/v2/video/${t}.json`;
      fetch(a).then((s) => s.json()).then((s) => i(s[0].thumbnail_large)).catch(() => i(""));
    });
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      const a = e[1], s = this.link(a);
      this.getData(a).then((r) => {
        i(a, s, r);
      });
    }
  }
}
class g {
  static type = "soundcloud";
  static dataAttribute = "soundcloud-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:soundcloud\.com|snd\.sc)\/([a-zA-Z0-9_-]*(?:\/sets)?(?:\/groups)?\/[a-zA-Z0-9_-]*)/;
  static embed(t) {
    const i = t.autoplay === !0 ? "&auto_play=true" : "";
    return `<iframe width="100%" height="600" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(`https://soundcloud.com/${t.id}`)}${i}&hide_related=false&color=373737&show_comments=false&show_user=true&show_reposts=false&visual=true" allow="autoplay"></iframe>`;
  }
  static thumbnail(t) {
    return "";
  }
  static link(t) {
    return `https://soundcloud.com/${t}`;
  }
  static getData(t) {
    const i = `/api/soundcloud?url=${encodeURIComponent(t)}&format=json`;
    return fetch(i).then((e) => e.json()).then((e) => e.thumbnail_url || "").catch(() => "");
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      const a = e[1], s = this.link(a);
      this.getData(s).then((r) => {
        i(a, s, r);
      });
    }
  }
}
class A {
  static type = "instagram";
  static dataAttribute = "instagram-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:instagram\.com|instagr\.am)\/(p|reel|tv)\/([a-zA-Z0-9-_]+)/i;
  static normalizePath(t) {
    if (!t) return "p/";
    const i = String(t).replace(/^\/+|\/+$/g, "");
    return /^(p|reel|tv)\/[a-zA-Z0-9-_]+$/i.test(i) ? i : `p/${i}`;
  }
  static embed(t) {
    const i = this.normalizePath(t.id), e = t.captioned === !1 ? "" : "captioned/";
    return `<iframe width="100%" height="100%" scrolling="no" frameborder="0" src="https://www.instagram.com/${i}/embed/${e}?cr=1&v=14" allowfullscreen></iframe>`;
  }
  static thumbnail(t) {
    return "";
  }
  static link(t) {
    return `https://www.instagram.com/${this.normalizePath(t)}/`;
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[2]) {
      const a = `${e[1]}/${e[2]}`, s = this.link(a);
      i(a, s, "");
    }
  }
}
class f {
  static type = "dailymotion";
  static dataAttribute = "dailymotion-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?dailymotion\.com\/video\/([a-zA-Z0-9-_]*)/;
  static embed(t) {
    const i = t.autoplay === !0 ? "?autoPlay=1" : "";
    return `<iframe class="video" width="${t.w}" height="${t.h}" src="https://www.dailymotion.com/embed/video/${t.id}${i}" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }
  static thumbnail(t) {
    return `https://www.dailymotion.com/thumbnail/video/${t}`;
  }
  static link(t) {
    return `https://www.dailymotion.com/video/${t}`;
  }
  static buildFromText(t, i) {
    t = t.split("_")[0];
    const e = t.match(this.regex);
    if (e && e[1]) {
      const a = e[1], s = this.link(a), r = this.thumbnail(a);
      i(a, s, r);
    }
  }
}
class y {
  static type = "mixcloud";
  static dataAttribute = "mixcloud-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:mixcloud\.com)\/(.*\/.*)/;
  static embed(t) {
    const i = t.autoplay === !0 ? "&autoplay=true" : "";
    return `<iframe width="660" height="180" src="https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent("https://www.mixcloud.com/" + t.id)}&replace=0&hide_cover=1&stylecolor=ffffff&embed_type=widget_standard${i}" frameborder="0" scrolling="no"></iframe>`;
  }
  static thumbnail(t) {
    return "";
  }
  static link(t) {
    return `https://www.mixcloud.com/${t}`;
  }
  static getData(t) {
    const i = `/api/mixcloud/?url=${encodeURIComponent(t)}&format=json`;
    return fetch(i).then((e) => e.json()).then((e) => e.image || "").catch(() => "");
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      const a = e[1], s = this.link(a);
      this.getData(s).then((r) => {
        i(a, s, r);
      });
    }
  }
}
class w {
  static type = "codepen";
  static dataAttribute = "codepen-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:codepen\.io)\/([a-zA-Z0-9_\-%]*\/[a-zA-Z0-9_\-%]*\/[a-zA-Z0-9_\-%]*)/;
  static embed(t) {
    const i = t.id.replace("/pen/", "/embed/"), e = i.split("/")[0], a = i.split("/")[2];
    return `<iframe src="https://codepen.io/${i}?height=${t.h}&theme-id=0&slug-hash=${a}&default-tab=result&user=${e}" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen allow=autoplay></iframe>`;
  }
  static thumbnail(t) {
    return `https://codepen.io/${t}/image/large.png`;
  }
  static link(t) {
    return `https://codepen.io/${t.replace("/embed/", "/pen/")}`;
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      let a = e[1].replace("/embed/", "/pen/");
      const s = this.link(a), r = this.thumbnail(a);
      i(a, s, r);
    }
  }
}
class v {
  static type = "bandcamp";
  static dataAttribute = "bandcamp-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?([a-zA-Z0-9_\-]*\.bandcamp\.com\/(?:album|track)\/[a-zA-Z0-9_\-%]*)/;
  static embed(t) {
    return `<iframe src="https://bandcamp.com/EmbeddedPlayer/${t.id}/size=large/bgcol=ffffff/linkcol=333333/tracklist=true/artwork=small/transparent=true/" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen seamless></iframe>`;
  }
  static thumbnail(t) {
    return "";
  }
  static link(t) {
    return t.match(/^(album|track)=/) ? "" : `https://${t}`;
  }
  static getData(t) {
    return fetch(`/api/bandcamp?url=${encodeURIComponent(t)}`).then((i) => i.json()).catch(() => ({ id: null, thumbnail: null }));
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      const s = `https://${e[1]}`;
      this.getData(s).then((r) => {
        r.id && i(r.id, s, r.thumbnail || "");
      });
    }
  }
}
class $ {
  static type = "giphy";
  static dataAttribute = "giphy-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?giphy\.com\/gifs\/([a-zA-Z0-9_\-%]*)/;
  static embed(t) {
    return `<iframe width="${t.w}" height="${t.h}" src="https://giphy.com/embed/${t.id}/twitter/iframe" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }
  static thumbnail(t) {
    return `https://media.giphy.com/media/${t}/giphy_s.gif`;
  }
  static link(t) {
    return `https://giphy.com/gifs/${t}`;
  }
  static buildFromText(t, i) {
    const e = t.split("/"), a = e[e.length - 1], s = a.split("-"), r = s[s.length - 1];
    if (r) {
      const o = this.link(a), l = this.thumbnail(r);
      i(r, o, l);
    }
  }
}
class k {
  static type = "video";
  static dataAttribute = "video-url";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(.+\.(?:mp4|mov|m4v))(?:\/|$|\s|\?|#)/;
  static embed(t) {
    const i = t.autoplay === !0 ? ' autoplay="true"' : "", e = t.loops === !0 ? ' loop="true"' : "", a = t.muted === !0 ? " muted" : "";
    return `<video src="${t.id}" width="${t.w}" height="${t.h}"${i}${e}${a} controls playsinline webkitallowfullscreen mozallowfullscreen allowfullscreen></video>`;
  }
  static thumbnail(t) {
    return t.replace(".mp4", "-poster.jpg").replace(".mov", "-poster.jpg").replace(".m4v", "-poster.jpg");
  }
  static link(t) {
    return t;
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      const a = e[1], s = this.thumbnail(a);
      i(a, a, s);
    }
  }
}
class x {
  static type = "gif";
  static dataAttribute = "gif-url";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(.+\.gif)(?:\/|$|\s|\?|#)/;
  static embed(t) {
    return `<img class="gif" src="${t.id}" width="${t.w}" height="${t.h}">`;
  }
  static thumbnail(t) {
    return t.replace(".gif", "-poster.jpg");
  }
  static link(t) {
    return t;
  }
  static buildFromText(t, i) {
    const e = t.match(this.regex);
    if (e && e[1]) {
      const a = e[1], s = this.thumbnail(a);
      i(a, a, s);
    }
  }
}
const d = [
  p,
  b,
  g,
  A,
  f,
  y,
  w,
  v,
  $,
  // Shadertoy,
  // Kuula,
  k,
  x
];
class c extends HTMLElement {
  defaultThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGcAQMAAAABMOGrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURQAAAKd6PdoAAAA6SURBVHja7cGBAAAAAMOg+VPf4ARVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAN488AAGP4e1mAAAAAElFTkSuQmCC";
  static EMBETTER_ACTIVATED = "embetter-activated";
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" }), this.el = this.shadow, this.initComponent(), this.render(), this.checkThumbnail(), this.addListeners(), this.setupMobileObserver();
  }
  disconnectedCallback() {
    this.unembedMedia(), this.removeAttribute("ready"), this.playButton && this.playButton.removeEventListener("click", this.clickListener), document.removeEventListener(c.EMBETTER_ACTIVATED, this.embedListener), this.observer && (this.observer.disconnect(), this.observer = null);
  }
  initComponent() {
    this.markup = "embetter-media component not initialized properly.", this.loops = this.hasAttribute("loops"), this.muted = this.hasAttribute("muted"), this.posterURL = null;
    const t = this.querySelector("img");
    t && t.src && (this.posterURL = t.src), this.innerHTML = "", this.aspectRatio = this.getAttribute("aspect-ratio") || null, this.applyAspectRatio(this.aspectRatio), this.findAndActivateService();
  }
  applyAspectRatio(t) {
    if (!t) {
      this.style.removeProperty("--embetter-aspect-ratio");
      return;
    }
    const i = String(t).trim();
    if (!i) {
      this.style.removeProperty("--embetter-aspect-ratio");
      return;
    }
    (/^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(i) || /^\d+(?:\.\d+)?$/.test(i)) && this.style.setProperty("--embetter-aspect-ratio", i.replace(/\s+/g, ""));
  }
  applyAspectRatioFromDimensions(t, i) {
    const e = Number(t), a = Number(i);
    Number.isFinite(e) && Number.isFinite(a) && e > 0 && a > 0 && this.style.setProperty("--embetter-aspect-ratio", `${e}/${a}`);
  }
  getElements() {
    this.thumbnail = this.el.querySelector("img");
  }
  addListeners() {
    this.clickListener = this.onClick.bind(this), this.playButton = this.el.querySelector(".embetter-play-button"), this.playButton && this.playButton.addEventListener("click", this.clickListener), this.embedListener = this.onEmbedActivated.bind(this), document.addEventListener(c.EMBETTER_ACTIVATED, this.embedListener);
  }
  onClick(t) {
    t.preventDefault(), this.embedMedia();
  }
  onEmbedActivated(t) {
    t.detail !== this && this.unembedMedia();
  }
  findAndActivateService() {
    for (let t of d) {
      let i = t.dataAttribute;
      if (this.hasAttribute(i)) {
        this.service = t, this.serviceType = t.type, this.serviceId = this.getAttribute(i);
        let e = this.posterURL || t.thumbnail(this.serviceId);
        if (this.markup = this.playerHTML(t.link(this.serviceId), e), t.getData) {
          const a = t.link(this.serviceId);
          t.getData(a).then((s) => {
            const r = typeof s == "string" ? s : s?.thumbnail;
            !this.aspectRatio && typeof s == "object" && this.applyAspectRatioFromDimensions(s.width, s.height), !e && !this.posterURL && r && this.thumbnail && (this.thumbnail.src = r);
          });
        }
        break;
      }
    }
  }
  checkThumbnail() {
    this.thumbnail && (this.setAttribute("loading", ""), this.thumbnail.onload = () => {
      this.aspectRatio || this.applyAspectRatioFromDimensions(this.thumbnail.naturalWidth, this.thumbnail.naturalHeight), this.removeAttribute("loading"), this.setAttribute("ready", "");
    }, this.thumbnail.onerror = () => {
      this.thumbnail.src = this.defaultThumbnail, this.removeAttribute("loading"), this.setAttribute("ready", "");
    }, setTimeout(() => {
      this.thumbnail.height < 50 && (this.thumbnail.src = this.defaultThumbnail), this.removeAttribute("loading"), this.setAttribute("ready", "");
    }, 4e3));
  }
  setupMobileObserver() {
    this.isMobile() && (this.observer = new IntersectionObserver(
      (t) => {
        t.forEach((i) => {
          i.isIntersecting ? this.embedMedia(!1) : this.unembedMedia();
        });
      },
      { threshold: 0.3 }
    ), this.observer.observe(this));
  }
  embedMedia(t) {
    if (document.dispatchEvent(
      new CustomEvent(c.EMBETTER_ACTIVATED, {
        bubbles: !0,
        composed: !0,
        detail: this
      })
    ), this.hasAttribute("playing")) return;
    t === void 0 && (t = this.hasAttribute("autoplay") ? this.getAttribute("autoplay") !== "false" : !0);
    let i = this.service.embed({
      id: this.serviceId,
      w: this.thumbnail && this.thumbnail.width || "100%",
      h: this.thumbnail && this.thumbnail.height || "100%",
      autoplay: t,
      loops: this.loops,
      muted: this.muted || t
    });
    this.playerEl = c.stringToDomElement(i), this.el.appendChild(this.playerEl), this.setAttribute("playing", "");
  }
  unembedMedia() {
    this.playerEl != null && this.playerEl.parentNode != null && this.playerEl.parentNode.removeChild(this.playerEl), this.removeAttribute("playing");
  }
  isMobile() {
    return /iphone|ipad|ipod|android/i.test(navigator.userAgent);
  }
  static stringToDomElement(t) {
    var i = document.createElement("div");
    return i.innerHTML = t, i.firstChild;
  }
  static componentHTML(t, i, e = null, a = null) {
    let s = "";
    if (a || e) {
      const r = a || "#", o = e ? `<img src="${e}">` : "";
      s = `<a href="${r}" target="_blank">${o}</a>`;
    }
    return `<embetter-media ${t}="${i}">${s}</embetter-media>`;
  }
  playerHTML(t, i) {
    return (
      /* html */
      `
      <a href="${t}" target="_blank">
        <img src="${i}">
        <div class="embetter-loading"></div>
        <div class="embetter-play-button"></div>
      </a>
    `
    );
  }
  css() {
    return m;
  }
  html() {
    return this.markup;
  }
  render() {
    this.el.innerHTML = `
      ${this.html()}
      <style>${this.css()}</style>
    `, this.getElements();
  }
  static register() {
    customElements.define("embetter-media", c);
  }
  static upgradeLegacyEmbeds(t = document) {
    t.querySelectorAll(".embetter").forEach((e) => {
      for (const a of d) {
        const s = `data-${a.dataAttribute}`;
        if (e.hasAttribute(s)) {
          const r = e.getAttribute(s), o = document.createElement("embetter-media");
          o.setAttribute(a.dataAttribute, r);
          const l = e.querySelector("a");
          l && o.appendChild(l.cloneNode(!0)), e.hasAttribute("data-loops") && o.setAttribute("loops", ""), e.hasAttribute("data-muted") && o.setAttribute("muted", ""), e.replaceWith(o);
          break;
        }
      }
    });
  }
  static componentMarkupFromURL(t, i) {
    for (let e = 0; e < d.length; e++) {
      const a = d[e];
      if (t.match(a.regex) != null) {
        a.buildFromText(t, (s, r, o) => {
          const l = (h) => {
            let u = c.componentHTML(
              a.dataAttribute,
              s,
              h,
              r
            );
            i(u, a);
          };
          if (!o && a.getData && r) {
            a.getData(r).then((h) => {
              const u = typeof h == "string" ? h : h?.thumbnail;
              l(u || o);
            }).catch(() => l(o));
            return;
          }
          l(o);
        });
        break;
      }
    }
  }
}
c.register();
export {
  c as default
};
