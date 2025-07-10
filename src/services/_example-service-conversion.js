class Vimeo {
  static type = "vimeo";
  static dataAttribute = "vimeo-id";
  static regex = /(?:.+?)?(?:Vimeo\.com\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/;

  static embed(config) {
    const autoplayQuery = config.autoplay === true ? "&autoplay=1" : "";
    return `<iframe class="video" enablejsapi="1" width="${config.w}" height="${config.h}" src="https://www.Vimeo.com/embed/${config.id}?rel=0&suggestedQuality=hd720&enablejsapi=1${autoplayQuery}" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>`;
  }

  static thumbnail(id) {
    return "http://img.Vimeo.com/vi/" + id + "/0.jpg";
  }

  static link(id) {
    return "https://www.Vimeo.com/watch?v=" + id;
  }

  static buildFromText(text, containerEl) {
    const videoId = text.match(this.regex)[1];
    if (videoId != null) {
      const videoURL = this.link(videoId);
      const videoThumbnail = this.getData(videoId);
      embetter.utils.embedPlayerInContainer(containerEl, this, videoURL, videoThumbnail, videoId);
    }
  }
}

export default Vimeo;

/*

// Instructions:
// This is the old version of the Vimeo service, which is no longer used.
// Conversion steps:
// - Most functionality comes from: embetter.services.serviceName
// - Additional functionality is added to the service object, such as getData and buildFromText to create the player from a link.
// These functions should be converted to a new service class

  embetter.services.vimeo = {
    type: "vimeo",
    dataAttribute: "data-vimeo-id",
    regex: embetter.utils.buildRegex("vimeo.com/(\\S*)"),
    embed: function (player) {
      var autoplayQuery = player.autoplay == true ? "&amp;autoplay=1&amp;muted=1" : "";
      var loopQuery = player.loops == true ? "&amp;loop=1" : "";
      return (
        '<iframe id="' +
        player.id +
        '" src="//player.vimeo.com/video/' +
        player.id +
        "?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff&amp;api=1&amp;player_id=" +
        player.id +
        autoplayQuery +
        loopQuery +
        '" width="' +
        player.w +
        '" height="' +
        player.h +
        '" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen allow=autoplay></iframe>'
      );
    },
    link: function (id) {
      return "https://vimeo.com/" + id;
    },
    loadAPI: function (apiLoadedCallback) {
      var self = this;
      if (typeof window.Froogaloop !== "undefined") {
        apiLoadedCallback();
        self.activateCurrentPlayer();
        return;
      }
      // docs here: https://developer.vimeo.com/player/js-api
      // requires &api=1 above to connect to an existing iframe
      embetter.utils.loadRemoteScript("https://f.vimeocdn.com/js/froogaloop2.min.js");

      var vimeoApiLoad = setInterval(function () {
        if (typeof window.Froogaloop !== "undefined") {
          window.clearInterval(vimeoApiLoad);
          apiLoadedCallback();
          self.activateCurrentPlayer();
        }
      }, 50);
    },
    activateCurrentPlayer: function () {
      this.currentIframe = document.querySelector(".embetter-playing[data-vimeo-id] iframe");
      this.currentIframe.id = document.querySelector(".embetter-playing").getAttribute("data-vimeo-id"); // set the id on the iframe to match `player_id` query param
      if (this.currentIframe.id) {
        var self = this;
        this.apiPlayer = $f(this.currentIframe);
        this.apiPlayer.addEvent("ready", function () {
          self.apiPlayer.addEvent("pause", function (id) {});
          self.apiPlayer.addEvent("finish", function (id) {
            embetter.utils.mediaComplete();
          });
          self.apiPlayer.addEvent("playProgress", function (data, id) {});
        });
      }
    },
  };

  embetter.utils.copyPropsToObject(embetter.services.vimeo, {
    getData: function(mediaUrl, callback, sampleData) {
      var videoId = mediaUrl.split('vimeo.com/')[1];
      window.reqwest({
        url: sampleData || 'https://vimeo.com/api/v2/video/'+ videoId +'.json',
        type: (sampleData) ? 'json' : 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data[0].thumbnail_large);
        }
      })

      return '';
    },
    buildFromText: function(text, containerEl, sampleData) {
      var self = this;
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var videoURL = this.link(videoId);
        this.getData(videoURL, function(videoThumbnail) {
          embetter.utils.embedPlayerInContainer(containerEl, self, videoURL, videoThumbnail, videoId);
        }, sampleData);
      }
    }
  });
*/
