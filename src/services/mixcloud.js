class Mixcloud {
  static type = "mixcloud";
  static dataAttribute = "mixcloud-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:mixcloud\.com)\/(.*\/.*)/;

  static embed(config) {
    const autoplayQuery = config.autoplay === true ? "&autoplay=true" : "";
    return `<iframe width="660" height="180" src="https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent("https://www.mixcloud.com/" + config.id)}&replace=0&hide_cover=1&stylecolor=ffffff&embed_type=widget_standard${autoplayQuery}" frameborder="0" scrolling="no"></iframe>`;
  }

  static thumbnail(id) {
    return "";
  }

  static link(id) {
    return `https://www.mixcloud.com/${id}`;
  }

  static getData(url) {
    const oembedPath = `/api/mixcloud/?url=${encodeURIComponent(url)}&format=json`;
    return fetch(oembedPath)
      .then((res) => res.json())
      .then((data) => data.image || "")
      .catch(() => "");
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const soundId = match[1];
      const soundURL = this.link(soundId);
      this.getData(soundURL).then((thumbnail) => {
        callback(soundId, soundURL, thumbnail);
      });
    }
  }
}

export default Mixcloud;
