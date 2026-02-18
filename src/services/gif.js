class GIF {
  static type = "gif";
  static dataAttribute = "gif-url";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(.+\.gif)(?:\/|$|\s|\?|#)/;

  static embed(config) {
    return `<img class="gif" src="${config.id}" width="${config.w}" height="${config.h}">`;
  }

  static thumbnail(url) {
    return url.replace(".gif", "-poster.jpg");
  }

  static link(url) {
    return url;
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const gifURL = match[1];
      const thumbnail = this.thumbnail(gifURL);
      callback(gifURL, gifURL, thumbnail);
    }
  }
}

export default GIF;
