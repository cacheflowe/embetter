(function(){
  var embetter = window.embetter;

  /////////////////////////////////////////////////////////////
  // BUILD PLAYER FROM PASTE
  /////////////////////////////////////////////////////////////
  embetter.utils.buildPlayerFromServiceURL = function(el, string, services) {
    for (var i = 0; i < services.length; i++) {
      var service = services[i];
      if(string.match(service.regex) != null) {
        service.buildFromText(string, el);
      }
    }
  };

  embetter.utils.playerCode = function(htmlStr) {
    var entityMap = {
      "<": "&lt;",
      ">": "&gt;",
    };
    function escapeHtml(string) {
      return String(string).replace(/[<>]/g, function (s) {
        return entityMap[s];
      });
    }
    htmlStr = htmlStr.replace(/\>\s+\</g,'><'); // remove whitespace between tags
    return '<p>Embed code:<textarea class="u-full-width">' + escapeHtml(htmlStr) + '</textarea></p>';
  };

  embetter.utils.embedPlayerInContainer = function(containerEl, serviceObj, mediaUrl, thumbnail, id) {
    // create service title
    containerEl.appendChild(embetter.utils.stringToDomElement('<h3>' + serviceObj.type.toUpperCase() + '</h3>'));
    // create embed
    var newEmbedHTML = embetter.utils.playerHTML(serviceObj, mediaUrl, thumbnail, id);
    var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
    embetter.utils.initPlayer(newEmbedEl, serviceObj, embetter.curEmbeds);
    containerEl.appendChild(newEmbedEl);
    // show embed code
    var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
    var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
    containerEl.appendChild(newEmbedCodeEl);
  };

  embetter.utils.copyPropsToObject = function(destObj, sourceObj) {
    for( var key in sourceObj ){
      destObj[key] = sourceObj[key];
    }
  };

  embetter.utils.copyPropsToObject(embetter.services.youtube, {
	getData: function(id) {
      return 'http://img.youtube.com/vi/'+ id +'/0.jpg';
    },
    buildFromText: function(text, containerEl) {
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var videoURL = this.link(videoId);
        var videoThumbnail = this.getData(videoId);
        embetter.utils.embedPlayerInContainer(containerEl, this, videoURL, videoThumbnail, videoId);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.vimeo, {
    getData: function(mediaUrl, callback) {
      var videoId = mediaUrl.split('vimeo.com/')[1];
      window.reqwest({
        url: 'https://vimeo.com/api/v2/video/'+ videoId +'.json',
        type: 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data[0].thumbnail_large);
        }
      })

      return '';
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var videoURL = this.link(videoId);
        this.getData(videoURL, function(videoThumbnail) {
          embetter.utils.embedPlayerInContainer(containerEl, self, videoURL, videoThumbnail, videoId);
        });
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.soundcloud, {
    getData: function(mediaUrl, callback) {
      reqwest({
        url: 'http://api.soundcloud.com/resolve.json?url='+ mediaUrl +'&client_id=YOUR_CLIENT_ID&callback=jsonpResponse',
        type: 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      })
    },
    largerThumbnail: function(thumbnail) {
      return thumbnail.replace('large.jpg', 't500x500.jpg');
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var soundURL = this.link(text.match(this.regex)[1]);
      if(soundURL != null) {
        this.getData(soundURL, function(data) {
          // progressively fall back from sound image to user image to group creator image. grab larger image where possible
          var thumbnail = data.artwork_url;
          if(thumbnail) thumbnail = self.largerThumbnail(thumbnail);

          if(thumbnail == null) {
            thumbnail = (data.user) ? data.user.avatar_url : null;
            if(thumbnail) thumbnail = self.largerThumbnail(thumbnail);
          }

          if(thumbnail == null) {
            thumbnail = (data.creator) ? data.creator.avatar_url : null;
            if(thumbnail) thumbnail = self.largerThumbnail(thumbnail);
          }

          if(thumbnail) {
            // handle special soundcloud ids
            var soundId = data.id;
            if(soundURL.indexOf('/sets/') != -1) soundId = 'playlists/' + soundId;
            else if(soundURL.indexOf('/groups/') != -1) soundId = 'groups/' + soundId;
            else soundId = 'tracks/' + soundId;

            // create embed
            embetter.utils.embedPlayerInContainer(containerEl, self, soundURL, thumbnail, soundId);
          }
        });
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.instagram, {
    getData: function(id) {
      return 'https://instagram.com/p/' + id +'/media/?size=l';
    },
    buildFromText: function(text, containerEl) {
      var mediaId = text.match(this.regex)[1];
      var mediaURL = this.link(mediaId);
      if(mediaURL != null) {
        var thumbnail = this.getData(mediaId);
        embetter.utils.embedPlayerInContainer(containerEl, this, mediaURL, thumbnail, mediaId);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.dailymotion, {
    getData: function(id) {
      return 'http://www.dailymotion.com/thumbnail/video/'+ id;
    },
    buildFromText: function(text, containerEl) {
      text = text.split('_')[0];
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var videoURL = this.link(videoId);
        var videoThumbnail = this.getData(videoId);
        embetter.utils.embedPlayerInContainer(containerEl, this, videoURL, videoThumbnail, videoId);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.rdio, {
    getData: function(mediaUrl, callback) {
      window.reqwest({
        url: 'http://www.rdio.com/api/oembed/?format=json&url='+ mediaUrl,
        type: 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      })
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var soundURL = text; // this.link(text.match(this.regex)[1]);
      if(soundURL != null) {
        this.getData(soundURL, function(data) {
          var soundId = data.html.match(/https:\/\/rd.io\/i\/(\S*)\//)[1];
          if(data.thumbnail_url && soundId) {
            embetter.utils.embedPlayerInContainer(containerEl, self, soundURL, data.thumbnail_url, soundId);
          }
        });
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.mixcloud, {
    getData: function(mediaUrl, callback) {
      window.reqwest({
        url: 'http://www.mixcloud.com/oembed/?url='+ mediaUrl +'&format=jsonp',
        type: 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var soundId = text.match(this.regex)[1];
      var soundURL = this.link(soundId);
      if(soundURL != null) {
        this.getData(soundURL, function(data) {
          if(data.image) {
            embetter.utils.embedPlayerInContainer(containerEl, self, soundURL, data.image, soundId);
          }
        });
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.codepen, {
    getData: function(id) {
      return 'http://codepen.io/' + id + '/image/large.png';
    },
    buildFromText: function(text, containerEl) {
      var penId = text.match(this.regex)[1];
      penId = penId.replace('/embed/', '/pen/');
      if(penId != null) {
        var penURL = this.link(penId);
        var penThumbnail = this.getData(penId);
        embetter.utils.embedPlayerInContainer(containerEl, this, penURL, penThumbnail, penId);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.bandcamp, {
    buildFromText: function(text, containerEl) {
      console.warn('Bandcamp embeds don\'t work without an opengraph metatag scraper. Hardcoded values will be used.');
      var bandcampId = text.match(this.regex)[1];
      if(bandcampId != null) {
        var soundURL = this.link(bandcampId);
        var soundThumbnail = 'https://f1.bcbits.com/img/a0883249002_16.jpg';
        embetter.utils.embedPlayerInContainer(containerEl, this, soundURL, soundThumbnail, 'album=2659930103');
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.ustream, {
    getData: function(mediaUrl, callback) {
      window.reqwest({
        url: 'http://localhost/embetter/vendor/proxy.php?csurl=' + 'http://www.ustream.tv/oembed?url='+ mediaUrl,
        type: 'json',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      })
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var streamId = text.match(this.regex)[1];
      var streamURL = this.link(streamId);
      if(streamURL != null) {
        this.getData(streamURL, function(data) {
          if(data.thumbnail_url) {
            var channelId = data.html.match(/cid=([0-9]*)/);
            streamId = (channelId) ? channelId[1] : streamId;
            embetter.utils.embedPlayerInContainer(containerEl, self, streamURL, data.thumbnail_url, streamId);
          }
        });
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.imgur, {
    getData: function(mediaUrl, callback) {
      window.reqwest({
        url: 'http://localhost/embetter/vendor/proxy.php?csurl=' + 'http://api.imgur.com/oembed.json?url='+ mediaUrl,
        type: 'json',
        error: function (err) {
          console.log('imgur error', err);
        },
        success: function (data) {
          callback(data);
        }
      });
    },
    getThumbnail: function(id) {
      return 'https://i.imgur.com/'+ id +'m.jpg';
    },
    buildFromText: function(text, containerEl) {
      var imgId = text.match(this.regex)[1];
      imgId = imgId.replace('gallery/', ''); // for testing, don't deal with galleries
      if(imgId != null) {
        /*
        // <meta name="twitter:card" content="gallery"/>
        // don't really need the endpoint, since oembed doesn't give us the gallery embed code *and* a thumbnail. we need to scrape og tags and check for gallery, then prepend "/a/" before the image ID embed
        var self = this;
        // build embed
        var mediaURL = this.link(imgId);
        this.getData(mediaURL, function(data) {
          var imgId = data.html.match(/data-id="([a-zA-Z0-9\-\/]*)/)[1];
          var thumbnail = self.getThumbnail(imgId);
          if(thumbnail) {
            var imgURL = self.link(imgId);
            embetter.utils.embedPlayerInContainer(containerEl, self, imgURL, thumbnail, imgId);
          }
        });
        */
        var mediaURL = this.link(imgId);
        var thumbnail = this.getThumbnail(imgId);
        embetter.utils.embedPlayerInContainer(containerEl, this, mediaURL, thumbnail, imgId);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.vine, {
    getData: function(imgId, callback) {
      window.reqwest({
        url: 'http://localhost/embetter/vendor/proxy.php?csurl=' + 'https://vine.co/oembed/' + imgId + '.json',
        type: 'json',
        error: function (err) {
          console.log('imgur error', err);
        },
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl) {
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var self = this;
        this.getData(videoId, function(data) {
          if(data.thumbnail_url) {
            var vineURL = self.link(videoId);
            embetter.utils.embedPlayerInContainer(containerEl, self, vineURL, data.thumbnail_url, videoId);
          }
        });
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.slideshare, {
    getData: function(imgId, callback) {
      window.reqwest({
        url: 'http://localhost/embetter/vendor/proxy.php?csurl=' + 'http://www.slideshare.net/api/oembed/2?url=https://www.slideshare.net/' + imgId + '&format=json',
        type: 'json',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl) {
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var self = this;
        this.getData(videoId, function(data) {
          if(data.thumbnail) {
            var imgId = data.html.match(/embed_code\/key\/([a-zA-Z0-9\-\/]*)/)[1];
            var slideshareURL = self.link(videoId);
            embetter.utils.embedPlayerInContainer(containerEl, self, slideshareURL, data.thumbnail, imgId);
          }
        });
      }
    }
  });


})();
