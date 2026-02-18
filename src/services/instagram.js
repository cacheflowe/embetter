class Instagram {
  static type = "instagram";
  static dataAttribute = "instagram-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:instagram\.com|instagr\.am)\/(p|reel|tv)\/([a-zA-Z0-9-_]+)/i;

  static normalizePath(idOrPath) {
    if (!idOrPath) return "p/";
    const cleaned = String(idOrPath).replace(/^\/+|\/+$/g, "");
    if (/^(p|reel|tv)\/[a-zA-Z0-9-_]+$/i.test(cleaned)) {
      return cleaned;
    }
    return `p/${cleaned}`;
  }

  static embed(config) {
    const mediaPath = this.normalizePath(config.id);
    const captioned = config.captioned === false ? "" : "captioned/";
    return `<iframe width="100%" height="100%" scrolling="no" frameborder="0" src="https://www.instagram.com/${mediaPath}/embed/${captioned}?cr=1&v=14" allowfullscreen></iframe>`;
  }

  static thumbnail(id) {
    // Instagram blocks all server-side access to media data; use poster attribute
    return "";
  }

  static link(id) {
    return `https://www.instagram.com/${this.normalizePath(id)}/`;
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[2]) {
      const mediaId = `${match[1]}/${match[2]}`;
      const mediaURL = this.link(mediaId);
      callback(mediaId, mediaURL, "");
    }
  }
}

export default Instagram;
