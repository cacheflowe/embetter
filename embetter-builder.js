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

  embetter.utils.copyPropsToObject(embetter.services.soundcloud, {
    getData: function(mediaUrl, callback, sampleData) {
      reqwest({
        // url: 'http://soundcloud.com/oembed?url='+ mediaUrl +'&format=json',
        // http://soundcloud.com/oembed?url=https://soundcloud.com/cacheflowe/sets/automate-everything-2005&format=json
        url: sampleData || 'http://api.soundcloud.com/resolve.json?url='+ mediaUrl +'&client_id=YOUR_CLIENT_ID&callback=jsonpResponse',
        type: (sampleData) ? 'json' : 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      })
    },
    largerThumbnail: function(thumbnail) {
      return thumbnail.replace('large.jpg', 't500x500.jpg');
    },
    buildFromText: function(text, containerEl, sampleData) {
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
        }, sampleData);
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

  embetter.utils.copyPropsToObject(embetter.services.mixcloud, {
    getData: function(mediaUrl, callback, sampleData) {
      window.reqwest({
        url: sampleData || 'http://www.mixcloud.com/oembed/?url='+ mediaUrl +'&format=jsonp',
        type: (sampleData) ? 'json' : 'jsonp',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl, sampleData) {
      var self = this;
      var soundId = text.match(this.regex)[1];
      var soundURL = this.link(soundId);
      if(soundURL != null) {
        this.getData(soundURL, function(data) {
          if(data.image) {
            embetter.utils.embedPlayerInContainer(containerEl, self, soundURL, data.image, soundId);
          }
        }, sampleData);
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
    getData: function(bandcampURL, callback, sampleData) {
      window.reqwest({
        url: sampleData || bandcampURL,
        type: 'html',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      })
    },
    regexForId: /((?:album|track)=[0-9]*)/,
    regexForThumb: /https:\/\/(.)*_16.jpg/,
    buildFromText: function(text, containerEl, sampleData) {
      var self = this;
      var bandcampId = text.match(this.regex)[1];
      if(bandcampId != null) {
        var bandcampURL = this.link(bandcampId);
        this.getData(bandcampURL, function(html) {
          if(html.match(self.regexForId) != null) {
            var streamId = html.match(self.regexForId)[0];
            var thumbnailUrl = html.match(self.regexForThumb)[0];
            embetter.utils.embedPlayerInContainer(containerEl, self, bandcampURL, thumbnailUrl, streamId);
          }
        }, sampleData);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.ustream, {
    getData: function(mediaUrl, callback, sampleData) {
      window.reqwest({
        url: sampleData || 'https://www.ustream.tv/oembed?url='+ mediaUrl,
        type: 'json',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl, sampleData) {
      var self = this;
      var streamId = text.match(this.regex)[1];
      var streamURL = this.link(streamId);
      if(streamURL != null) {
        this.getData(streamURL, function(data) {
          if(data.thumbnail_url) {
            var channelId = data.html.match(/http:\/\/www.ustream.tv\/embed\/([0-9]*)/);
            var recordedId = data.html.match(/http:\/\/www.ustream.tv\/embed\/recorded\/([0-9]*)/);
            streamId = (recordedId != null) ? 'recorded/' + recordedId[1] : channelId[1];
            embetter.utils.embedPlayerInContainer(containerEl, self, streamURL, data.thumbnail_url, streamId);
          }
        }, sampleData);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.imgur, {
    getData: function(mediaUrl, callback, sampleData) {
      window.reqwest({
        // url: 'http://api.imgur.com/oembed.json?url='+ mediaUrl, // oembed URL doesn't return a thumbnail for us, so it's useless here
        url: sampleData || bandcampURL,
        type: 'html',
        error: function (err) {
          console.log('imgur error', err);
        },
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl, sampleData) {
      var self = this;
      var imgurId = text.match(this.regex)[1];
      if(imgurId != null) {
        var mediaURL = this.link(imgurId);
        this.getData(mediaURL, function(data) {
          if(data.match('content="gallery"') != null) {
            var thumbMatch = data.match(/image_src(?:.)*(http(.)*jpg)/);
            var thumbnail = thumbMatch[1];
            if(thumbMatch && thumbMatch.length) {
              // check for gallery, then prepend "/a/" before the image ID embed
              var embedId = imgurId.replace('gallery', 'a');
              embetter.utils.embedPlayerInContainer(containerEl, self, mediaURL, thumbnail, embedId);
            }
          } else if(data.match('twitter:image:src') != null) {
            var thumbMatch = data.match(/twitter:image:src(?:.)*(http(.)*jpg)/);
            var thumbnail = thumbMatch[1];
            if(thumbMatch && thumbMatch.length) {
              // if not an actual gallery, remove gallery/ from the url for a proper embed ID
              var embedId = imgurId.replace('gallery/', '');
              embetter.utils.embedPlayerInContainer(containerEl, self, mediaURL, thumbnail, embedId);
            }
          }
        }, sampleData);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.vine, {
    getData: function(imgId, callback, sampleData) {
      window.reqwest({
        url: sampleData || 'https://vine.co/oembed/' + imgId + '.json',
        type: 'json',
        error: function (err) {
          console.log('vine error', err);
        },
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl, sampleData) {
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var self = this;
        this.getData(videoId, function(data) {
          if(data.thumbnail_url) {
            var vineURL = self.link(videoId);
            embetter.utils.embedPlayerInContainer(containerEl, self, vineURL, data.thumbnail_url, videoId);
          }
        }, sampleData);
      }
    }
  });

  embetter.utils.copyPropsToObject(embetter.services.slideshare, {
    getData: function(imgId, callback, sampleData) {
      window.reqwest({
        url: sampleData || 'http://www.slideshare.net/api/oembed/2?url=https://www.slideshare.net/' + imgId + '&format=json',
        type: 'json',
        error: function (err) {},
        success: function (data) {
          callback(data);
        }
      });
    },
    buildFromText: function(text, containerEl, sampleData) {
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var self = this;
        this.getData(videoId, function(data) {
          if(data.thumbnail) {
            var imgId = data.html.match(/embed_code\/key\/([a-zA-Z0-9\-\/]*)/)[1];
            var slideshareURL = self.link(videoId);
            embetter.utils.embedPlayerInContainer(containerEl, self, slideshareURL, data.thumbnail, imgId);
          }
        }, sampleData);
      }
    }
  });


})();
