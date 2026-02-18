class Giphy {
  static type = "giphy";
  static dataAttribute = "giphy-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?giphy\.com\/gifs\/([a-zA-Z0-9_\-%]*)/;

  static embed(config) {
    return `<iframe width="${config.w}" height="${config.h}" src="https://giphy.com/embed/${config.id}/twitter/iframe" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    return `https://media.giphy.com/media/${id}/giphy_s.gif`;
  }

  static link(dashedId) {
    return `https://giphy.com/gifs/${dashedId}`;
  }

  static buildFromText(text, callback) {
    const splitPath = text.split("/");
    const longId = splitPath[splitPath.length - 1];
    const dashedParts = longId.split("-");
    const giphyId = dashedParts[dashedParts.length - 1];
    if (giphyId) {
      const giphyURL = this.link(longId);
      const thumbnailUrl = this.thumbnail(giphyId);
      callback(giphyId, giphyURL, thumbnailUrl);
    }
  }
}

export default Giphy;
