class YouTube {
  static type = "youtube";
  static dataAttribute = "youtube-id";
  static regex = /(?:.+?)?(?:youtube\.com\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/;

  static embed(config) {
    const autoplayQuery = config.autoplay === true ? "&autoplay=1" : "";
    const loopQuery = config.loops === true ? `&loop=1&playlist=${config.id}` : "";
    return `<iframe class="video" enablejsapi="1" width="${config.w}" height="${config.h}" src="https://www.youtube.com/embed/${config.id}?rel=0&suggestedQuality=hd720&enablejsapi=1${autoplayQuery}${loopQuery}" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    return "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
  }

  static link(id) {
    return "https://www.youtube.com/watch?v=" + id;
  }

  static buildFromText(text, callback) {
    const videoId = text.match(this.regex)[1];
    if (videoId != null) {
      const videoURL = this.link(videoId);
      const videoThumbnail = this.thumbnail(videoId);
      callback(videoId, videoURL, videoThumbnail);
    }
  }
}

export default YouTube;
