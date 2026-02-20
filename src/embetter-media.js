import css from "./embetter-css.js";
import services from "./services/_services.js";

class EmbetterMedia extends HTMLElement {
  defaultThumbnail =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGcAQMAAAABMOGrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURQAAAKd6PdoAAAA6SURBVHja7cGBAAAAAMOg+VPf4ARVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAN488AAGP4e1mAAAAAElFTkSuQmCC";
  static EMBETTER_ACTIVATED = "embetter-activated";

  connectedCallback() {
    setTimeout(() => {
      if (!this.isConnected) return;

      if (!this.shadow) {
        this.initialHTML = this.innerHTML;
        this.innerHTML = "";
        this.shadow = this.attachShadow({ mode: "open" });
        this.el = this.shadow ?? this;
        this.initComponent();
        this.render();
        this.getElements();
        this.checkThumbnail();
      }

      this.addListeners();
      // this.setupMobileObserver();
    }, 0);
  }

  disconnectedCallback() {
    this.unembedMedia();
    this.removeAttribute("ready");
    if (this.playButton) {
      this.playButton.removeEventListener("click", this.clickListener);
    }
    document.removeEventListener(EmbetterMedia.EMBETTER_ACTIVATED, this.embedListener);
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  initComponent() {
    this.markup = `embetter-media component not initialized properly.`;
    this.loops = this.hasAttribute("loops");
    this.muted = this.hasAttribute("muted");
    this.findAndActivateService();
  }

  getElements() {
    this.thumbnail = this.el.querySelector("img");
  }

  addListeners() {
    this.clickListener = this.onClick.bind(this);
    this.playButton = this.el.querySelector(".embetter-play-button");
    if (this.playButton) {
      this.playButton.addEventListener("click", this.clickListener);
    }
    this.embedListener = this.onEmbedActivated.bind(this);
    document.addEventListener(EmbetterMedia.EMBETTER_ACTIVATED, this.embedListener);
  }

  onClick(e) {
    e.preventDefault();
    this.embedMedia();
  }

  onEmbedActivated(e) {
    if (e.detail !== this) {
      this.unembedMedia();
    }
  }

  findAndActivateService() {
    for (let service of services) {
      let serviceId = service.dataAttribute;
      if (this.hasAttribute(serviceId)) {
        this.service = service;
        this.serviceType = service.type;
        this.serviceId = this.getAttribute(serviceId);
        this.markup = this.playerHTML(service.link(this.serviceId));
        break;
      }
    }
  }

  onReady() {
    this.removeAttribute("loading");
    this.setAttribute("ready", "");
  }

  checkThumbnail() {
    if (!this.thumbnail) return;
    this.setAttribute("loading", "");

    if (this.thumbnail.complete) {
      this.onReady();
    } else {
      this.thumbnail.onload = () => {
        this.onReady();
      };
      this.thumbnail.onerror = () => {
        // YouTube maxresdefault.jpg doesn't exist for all videos — fall back to 0.jpg
        if (this.thumbnail.src.includes("/maxresdefault.jpg")) {
          this.thumbnail.src = this.thumbnail.src.replace("/maxresdefault.jpg", "/0.jpg");
          return;
        }
        this.thumbnail.src = this.defaultThumbnail;
        this.onReady();
      };
    }

    setTimeout(() => {
      if (this.thumbnail.height < 50) {
        this.thumbnail.src = this.defaultThumbnail;
      }
      this.onReady();
    }, 4000);
  }

  setupMobileObserver() {
    if (!this.isMobile()) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.embedMedia(false);
          } else {
            this.unembedMedia();
          }
        });
      },
      { threshold: 0.3 },
    );
    this.observer.observe(this);
  }

  embedMedia(autoplay) {
    document.dispatchEvent(
      new CustomEvent(EmbetterMedia.EMBETTER_ACTIVATED, {
        bubbles: true,
        composed: true,
        detail: this,
      }),
    );
    if (this.hasAttribute("playing")) return;

    if (autoplay === undefined) {
      autoplay = this.hasAttribute("autoplay") ? this.getAttribute("autoplay") !== "false" : true;
    }

    let embedStr = this.service.embed({
      id: this.serviceId,
      w: this.thumbnail ? this.thumbnail.width || "100%" : "100%",
      h: this.thumbnail ? this.thumbnail.height || "100%" : "100%",
      autoplay: autoplay,
      loops: this.loops,
      muted: this.muted || autoplay,
    });
    this.playerEl = EmbetterMedia.stringToDomElement(embedStr);
    this.el.appendChild(this.playerEl);
    this.setAttribute("playing", "");
  }

  unembedMedia() {
    if (this.playerEl != null && this.playerEl.parentNode != null) {
      this.playerEl.parentNode.removeChild(this.playerEl);
    }
    this.removeAttribute("playing");
  }

  isMobile() {
    return /iphone|ipad|ipod|android/i.test(navigator.userAgent);
  }

  static stringToDomElement(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.firstChild;
  }

  static componentHTML(serviceAttr, serviceId, thumbnail = null, mediaURL = null) {
    let fallbackContent = "";
    if (mediaURL || thumbnail) {
      const href = mediaURL || "#";
      const img = thumbnail ? `<img src="${thumbnail}">` : "";
      fallbackContent = `<a href="${href}">${img}</a>`;
    }
    return `<embetter-media ${serviceAttr}="${serviceId}">${fallbackContent}</embetter-media>`;
  }

  playerHTML(mediaUrl) {
    return /* html */ `
      ${this.initialHTML}
      <div class="embetter-loading"></div>
      <div class="embetter-play-button"></div>
    `;
  }

  css() {
    return css;
  }

  html() {
    return this.markup;
  }

  render() {
    this.el.innerHTML = `
      ${this.html()}
      <style>${this.css()}</style>
    `;
  }

  static register() {
    customElements.define("embetter-media", EmbetterMedia);
  }

  static upgradeLegacyEmbeds(container = document) {
    const legacyEls = container.querySelectorAll(".embetter");
    legacyEls.forEach((el) => {
      for (const service of services) {
        const legacyAttr = `data-${service.dataAttribute}`;
        if (el.hasAttribute(legacyAttr)) {
          const id = el.getAttribute(legacyAttr);
          const newEl = document.createElement("embetter-media");
          newEl.setAttribute(service.dataAttribute, id);
          // Preserve inner <a><img> as fallback content
          const link = el.querySelector("a");
          if (link) newEl.appendChild(link.cloneNode(true));
          // Copy loops/muted if present
          if (el.hasAttribute("data-loops")) newEl.setAttribute("loops", "");
          if (el.hasAttribute("data-muted")) newEl.setAttribute("muted", "");
          el.replaceWith(newEl);
          break;
        }
      }
    });
  }

  static componentMarkupFromURL(inputStr, callback) {
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      if (inputStr.match(service.regex) != null) {
        service.buildFromText(inputStr, (mediaId, mediaURL, thumbnail) => {
          const finalize = (resolvedThumbnail) => {
            let componentHTML = EmbetterMedia.componentHTML(
              service.dataAttribute,
              mediaId,
              resolvedThumbnail,
              mediaURL,
            );
            callback(componentHTML, service);
          };

          if (!thumbnail && service.getData && mediaURL) {
            service
              .getData(mediaURL)
              .then((data) => {
                const fetchedThumbnail = typeof data === "string" ? data : data?.thumbnail;
                finalize(fetchedThumbnail || thumbnail);
              })
              .catch(() => finalize(thumbnail));
            return;
          }

          finalize(thumbnail);
        });
        break;
      }
    }
  }
}

EmbetterMedia.register();

export default EmbetterMedia;
