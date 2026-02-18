class Bandcamp {
  static type = "bandcamp";
  static dataAttribute = "bandcamp-id";
  static regex = /(?:https?:\/\/)?(?:w{3}\.)?([a-zA-Z0-9_\-]*\.bandcamp\.com\/(?:album|track)\/[a-zA-Z0-9_\-%]*)/;

  static embed(config) {
    return `<iframe src="https://bandcamp.com/EmbeddedPlayer/${config.id}/size=large/bgcol=ffffff/linkcol=333333/tracklist=true/artwork=small/transparent=true/" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen seamless></iframe>`;
  }

  static thumbnail(id) {
    return "";
  }

  static link(id) {
    // id could be "album=123" (embed format) or "artist.bandcamp.com/album/name" (URL path)
    if (id.match(/^(album|track)=/)) return "";
    return `https://${id}`;
  }

  static getData(url) {
    return fetch(`/api/bandcamp?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .catch(() => ({ id: null, thumbnail: null }));
  }

  static buildFromText(text, callback) {
    const match = text.match(this.regex);
    if (match && match[1]) {
      const bandcampPath = match[1];
      const bandcampURL = `https://${bandcampPath}`;
      this.getData(bandcampURL).then((data) => {
        if (data.id) {
          callback(data.id, bandcampURL, data.thumbnail || "");
        }
      });
    }
  }
}

export default Bandcamp;
