class Vimeo {
  static type = "vimeo";
  static dataAttribute = "vimeo-id";
  // Matches vimeo.com/12345678 or player.vimeo.com/video/12345678
  static regex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i;

  static embed(config) {
    const autoplayQuery = config.autoplay === true ? "&autoplay=1" : "";
    const loopQuery = config.loops === true ? "&loop=1" : "";
    return `<iframe id="${config.id}" src="https://player.vimeo.com/video/${config.id}?title=0&byline=0&portrait=0&color=ffffff&api=1&player_id=${config.id}${autoplayQuery}${loopQuery}" width="${config.w}" height="${config.h}" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    // This method requires async fetching, see getData below.
    // Return a placeholder or empty string.
    return "";
  }

  static link(id) {
    return "https://vimeo.com/" + id;
  }

  static getData(id) {
    // Returns a Promise that resolves to the thumbnail URL
    return new Promise((resolve, reject) => {
      const url = `https://vimeo.com/api/v2/video/${id}.json`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data[0].thumbnail_large))
        .catch(() => resolve(""));
    });
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const videoId = match[1];
      const videoURL = this.link(videoId);
      this.getData(videoId).then((videoThumbnail) => {
        callback(videoId, videoURL, videoThumbnail);
      });
    }
  }
}

export default Vimeo;
