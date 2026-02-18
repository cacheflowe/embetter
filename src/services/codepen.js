class CodePen {
  static type = "codepen";
  static dataAttribute = "codepen-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?(?:codepen\.io)\/([a-zA-Z0-9_\-%]*\/[a-zA-Z0-9_\-%]*\/[a-zA-Z0-9_\-%]*)/;

  static embed(config) {
    const id = config.id.replace("/pen/", "/embed/");
    const user = id.split("/")[0];
    const slugHash = id.split("/")[2];
    return `<iframe src="https://codepen.io/${id}?height=${config.h}&theme-id=0&slug-hash=${slugHash}&default-tab=result&user=${user}" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    return `https://codepen.io/${id}/image/large.png`;
  }

  static link(id) {
    const penId = id.replace("/embed/", "/pen/");
    return `https://codepen.io/${penId}`;
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      let penId = match[1].replace("/embed/", "/pen/");
      const penURL = this.link(penId);
      const penThumbnail = this.thumbnail(penId);
      callback(penId, penURL, penThumbnail);
    }
  }
}

export default CodePen;
