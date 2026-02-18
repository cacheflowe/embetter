class Video {
  static type = "video";
  static dataAttribute = "video-url";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(.+\.(?:mp4|mov|m4v))(?:\/|$|\s|\?|#)/;

  static embed(config) {
    const autoplayAttr = config.autoplay === true ? ' autoplay="true"' : "";
    const loopsAttr = config.loops === true ? ' loop="true"' : "";
    const mutedAttr = config.muted === true ? " muted" : "";
    return `<video src="${config.id}" width="${config.w}" height="${config.h}"${autoplayAttr}${loopsAttr}${mutedAttr} controls playsinline webkitallowfullscreen mozallowfullscreen allowfullscreen></video>`;
  }

  static thumbnail(url) {
    return url
      .replace(".mp4", "-poster.jpg")
      .replace(".mov", "-poster.jpg")
      .replace(".m4v", "-poster.jpg");
  }

  static link(url) {
    return url;
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const videoURL = match[1];
      const thumbnail = this.thumbnail(videoURL);
      callback(videoURL, videoURL, thumbnail);
    }
  }
}

export default Video;
