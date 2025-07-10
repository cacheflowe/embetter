import css from "./embetter-css.js";
import services from "./services/_services.js";

class EmbetterMedia extends HTMLElement {
  defaultThumbnail =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGcAQMAAAABMOGrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURQAAAKd6PdoAAAA6SURBVHja7cGBAAAAAMOg+VPf4ARVAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAN488AAGP4e1mAAAAAElFTkSuQmCC";
  static EMBETTER_ACTIVATED = "embetter-activated";

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" }); // "open" allows querying and probably lots more
    this.el = this.shadow ? this.shadow : this;
    this.initComponent();
    this.render();
    this.checkThumbnail();
    this.addListeners();

    // temp for testing
    this.setAttribute("loading", "");
    setTimeout(() => {
      this.setAttribute("ready", "");
    }, 1000);
  }

  disconnectedCallback() {
    this.unembedMedia();
    this.removeAttribute("ready");
    this.playButton.removeEventListener("click", this.clickListener);
    document.removeEventListener(EmbetterMedia.EMBETTER_ACTIVATED, this.embedListener);
  }

  initComponent() {
    this.markup = `embetter-media component not initialized properly.`;
    this.loops = this.hasAttribute("loops");
    this.posterURL = this.getAttribute("poster") || null; // if a poster is provided, then the service can't infer the thumbnail URL
    this.findAndActivateService();
  }

  getElements() {
    this.thumbnail = this.el.querySelector("img");
  }

  addListeners() {
    // add click listener to play button
    this.clickListener = this.onClick.bind(this);
    this.playButton = this.el.querySelector(".embetter-play-button");
    this.playButton.addEventListener("click", this.clickListener);
    // listen for other embeds
    this.embedListener = this.onEmbedActivated.bind(this);
    document.addEventListener(EmbetterMedia.EMBETTER_ACTIVATED, this.embedListener);
  }

  onClick(e) {
    e.preventDefault();
    this.embedMedia();
    // TODO - store active player *somewhere* so we can unembed previous players
  }

  onEmbedActivated(e) {
    if (e.target !== this.el) {
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
        let thumbnail = this.posterURL || service.thumbnail(this.serviceId);
        console.log("embed info:", this.serviceType, this.serviceId);
        this.markup = this.playerHTML(service.link(this.serviceId), thumbnail);
        break; // stop after the first service that matches
      }
    }
  }

  checkThumbnail() {
    this.thumbnail.onerror = () => {
      this.thumbnail.src = this.defaultThumbnail;
    };
    // if onerror already happened but we still have a broken image, give it 4 seconds to load, then replace
    setTimeout(() => {
      if (this.thumbnail.height < 50) {
        this.thumbnail.src = this.defaultThumbnail;
      }
    }, 4000);
  }

  embedMedia() {
    document.dispatchEvent(new CustomEvent(EmbetterMedia.EMBETTER_ACTIVATED, { bubbles: true, composed: true }));
    if (this.hasAttribute("playing")) return; // already playing, do nothing

    // get config for embed
    this.autoplay = this.hasAttribute("autoplay") ? this.getAttribute("autoplay") === "true" : true;

    // load embed iframe into the component
    let embedStr = this.service.embed({
      id: this.serviceId,
      w: this.thumbnail.width || "100%",
      h: this.thumbnail.height || "100%",
      autoplay: this.autoplay || true,
    });
    this.playerEl = EmbetterMedia.stringToDomElement(embedStr);
    this.el.appendChild(this.playerEl);
    this.setAttribute("playing", ""); // mark as playing

    // if there's an API to load, connect to it
    this.implementAPI();

    // test unembed
    // setTimeout(() => {
    //   this.unembedMedia();
    // }, 5000); // auto unembed after 10 seconds for testing
  }

  implementAPI() {
    // if (this.serviceObj.loadAPI && embetter.apiEnabled == true && embetter.utils.isMobile == false) {
    //   this.serviceObj.loadAPI(startPlaying);
    // } else {
    //   startPlaying();
    // }
  }

  unembedMedia() {
    if (this.playerEl != null && this.playerEl.parentNode != null) {
      this.playerEl.parentNode.removeChild(this.playerEl);
    }
    this.removeAttribute("playing");
  }

  //////////////////////////////////////////////////////////////////
  // REGEX HELPERS
  //////////////////////////////////////////////////////////////////

  buildRegex(regexStr) {
    var optionalPrefix = "(?:https?:\\/\\/)?(?:w{3}\\.)?";
    var terminator = "(?:\\/?|$|\\s|\\?|#)";
    return new RegExp(optionalPrefix + regexStr + terminator);
  }

  /////////////////////////////////////////////////////////////
  // BUILD HTML TEMPLATES
  /////////////////////////////////////////////////////////////

  static stringToDomElement(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.firstChild;
  }

  static componentHTML(serviceType, serviceId, thumbnail = null) {
    let poster = thumbnail ? `poster="${thumbnail}"` : "";
    return `
      <embetter-media ${serviceType}="${serviceId}" ${poster}></embetter-media>
    `;
  }

  playerHTML(mediaUrl, thumbnail) {
    return `
      <a href="${mediaUrl}" target="_blank">
        <img src="${thumbnail}">
        <div class="embetter-loading"></div>
        <div class="embetter-play-button"></div>
      </a>
    `;
  }

  isMobile() {
    return navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod|android/) ? true : false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "key") {
      this.key = newValue;
    }
    this.render();
  }

  css() {
    return (
      /* css */ `
    ` + css
    );
    // return /*css*/ `
    //   my-component div {
    //   }
    // `;
  }

  html() {
    return /*html*/ `
      ${this.markup}
    `;
  }

  render() {
    this.el.innerHTML = /*html*/ `
      ${this.html()}
      <style>
        ${this.css()}
      </style>
    `;
    this.getElements();
  }

  static register() {
    customElements.define("embetter-media", EmbetterMedia);
  }

  static componentMarkupFromURL(inputStr, callback) {
    for (var i = 0; i < services.length; i++) {
      var service = services[i];
      if (inputStr.match(service.regex) != null) {
        service.buildFromText(inputStr, (mediaId, videoURL, thumbnail) => {
          // console.log("Embed player in container:", service, videoURL, thumbnail, mediaId);
          let componentHTML = EmbetterMedia.componentHTML(service.dataAttribute, mediaId, thumbnail);
          // console.log(componentHTML);
          callback(componentHTML, service);
        });
      }
    }
  }
}

EmbetterMedia.register();

export default EmbetterMedia;

/* 
// This code is commented out because it was part of the original embetter-player class.
// We need to implement the player functionality in the web component instead.
embetter.EmbetterPlayer = function (el, serviceObj) {
  this.el = el;
  this.el.classList.add("embetter-ready");
  this.serviceObj = serviceObj;
  this.id = this.el.getAttribute(serviceObj.dataAttribute);
  this.loops = this.el.getAttribute("data-loops") == "true";
  this.thumbnail = this.el.querySelector("img");
  this.playerEl = null;
  this.buildPlayButton();
  this.checkForBadThumbnail();
};

embetter.EmbetterPlayer.prototype.buildPlayButton = function () {
  this.playButton = document.createElement("div");
  this.playButton.classList.add("embetter-loading");
  this.el.appendChild(this.playButton);

  this.playButton = document.createElement("div");
  this.playButton.classList.add("embetter-play-button");
  this.el.appendChild(this.playButton);

  var self = this;
  this.playHandler = function () {
    self.play();
  }; // for event listener removal
  this.playButton.addEventListener("click", this.playHandler);
};

embetter.EmbetterPlayer.prototype.getType = function () {
  return this.serviceObj.type;
};

embetter.EmbetterPlayer.prototype.play = function () {
  if (embetter.curPlayer != null) {
    embetter.curPlayer.unembedMedia();
    embetter.curPlayer = null;
  }

  var self = this;
  var startPlaying = function () {
    self.embedMedia(true);
    embetter.curPlayer = self;
  };
  // load API if one exists for service, otherwise just play
  if (this.serviceObj.loadAPI && embetter.apiEnabled == true && embetter.utils.isMobile == false) {
    this.serviceObj.loadAPI(startPlaying);
  } else {
    startPlaying();
  }
};

*/
