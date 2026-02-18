class Dailymotion {
  static type = "dailymotion";
  static dataAttribute = "dailymotion-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?dailymotion\.com\/video\/([a-zA-Z0-9-_]*)/;

  static embed(config) {
    const autoplayQuery = config.autoplay === true ? "?autoPlay=1" : "";
    return `<iframe class="video" width="${config.w}" height="${config.h}" src="https://www.dailymotion.com/embed/video/${config.id}${autoplayQuery}" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    return `https://www.dailymotion.com/thumbnail/video/${id}`;
  }

  static link(id) {
    return `https://www.dailymotion.com/video/${id}`;
  }

  static buildFromText(text, callback) {
    text = text.split("_")[0];
    const match = text.match(this.regex);
    if (match && match[1]) {
      const videoId = match[1];
      const videoURL = this.link(videoId);
      const videoThumbnail = this.thumbnail(videoId);
      callback(videoId, videoURL, videoThumbnail);
    }
  }
}

export default Dailymotion;
