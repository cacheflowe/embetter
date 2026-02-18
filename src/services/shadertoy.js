class Shadertoy {
  static type = "shadertoy";
  static dataAttribute = "shadertoy-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?shadertoy\.com\/view\/([a-zA-Z0-9_\-%]*)/;

  static embed(config) {
    return `<iframe width="${config.w}" height="${config.h}" src="https://www.shadertoy.com/embed/${config.id}?gui=true&t=10&paused=true&muted=false" frameborder="0" allowfullscreen></iframe>`;
  }

  static thumbnail(id) {
    // Shadertoy blocks cross-origin image requests; use poster attribute
    return "";
  }

  static link(id) {
    return `https://www.shadertoy.com/view/${id}`;
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const shaderId = match[1];
      const shaderURL = this.link(shaderId);
      callback(shaderId, shaderURL, "");
    }
  }
}

export default Shadertoy;
