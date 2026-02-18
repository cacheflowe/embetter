class SoundCloud {
  static type = "soundcloud";
  static dataAttribute = "soundcloud-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:soundcloud\.com|snd\.sc)\/([a-zA-Z0-9_-]*(?:\/sets)?(?:\/groups)?\/[a-zA-Z0-9_-]*)/;

  static embed(config) {
    const autoplayQuery = config.autoplay === true ? "&auto_play=true" : "";
    const url = encodeURIComponent(`https://soundcloud.com/${config.id}`);
    return `<iframe width="100%" height="600" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${url}${autoplayQuery}&hide_related=false&color=373737&show_comments=false&show_user=true&show_reposts=false&visual=true" allow="autoplay"></iframe>`;
  }

  static thumbnail(id) {
    return "";
  }

  static link(id) {
    return `https://soundcloud.com/${id}`;
  }

  static getData(url) {
    const oembedPath = `/api/soundcloud?url=${encodeURIComponent(url)}&format=json`;
    return fetch(oembedPath)
      .then((res) => res.json())
      .then((data) => data.thumbnail_url || "")
      .catch(() => "");
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const soundPath = match[1];
      const soundURL = this.link(soundPath);
      this.getData(soundURL).then((thumbnail) => {
        callback(soundPath, soundURL, thumbnail);
      });
    }
  }
}

export default SoundCloud;
