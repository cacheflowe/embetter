class Kuula {
  static type = "kuula";
  static dataAttribute = "kuula-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?kuula\.co\/post\/([a-zA-Z0-9_\-%]*)/;

  static embed(config) {
    return `<iframe width="${config.w}" height="${config.h}" src="https://kuula.co/share/${config.id}" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    return `https://kuula.co/cover/${id}`;
  }

  static link(id) {
    return `https://kuula.co/post/${id}`;
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const postId = match[1];
      const postURL = this.link(postId);
      const postThumbnail = this.thumbnail(postId);
      callback(postId, postURL, postThumbnail);
    }
  }
}

export default Kuula;
