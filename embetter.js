(function(){

  window.embetter = {};
  var embetter = window.embetter;

  /////////////////////////////////////////////////////////////
  // COMMON UTIL HELPERS
  /////////////////////////////////////////////////////////////

  embetter.debug = true;
  embetter.curEmbeds = [];
  embetter.mobileScrollTimeout = null;
  embetter.mobileScrollSetup = false;

  embetter.utils = {
    /////////////////////////////////////////////////////////////
    // REGEX HELPERS
    /////////////////////////////////////////////////////////////
    buildRegex: function(regexStr) {
      var optionalPrefix = '(?:https?:\\/\\/)?(?:w{3}\\.)?';
      var terminator = '(?:\\/?|$|\\s|\\?|#)';
      return new RegExp(optionalPrefix + regexStr + terminator);
    },
    /////////////////////////////////////////////////////////////
    // BUILD HTML TEMPLATES
    /////////////////////////////////////////////////////////////
    stringToDomElement: function(str) {
      var div = document.createElement('div');
      div.innerHTML = str;
      return div.firstChild;
    },
    playerHTML: function(service, mediaUrl, thumbnail, id) {
      return '<div class="embetter" ' + service.dataAttribute + '="' + id + '">\
          <a href="' + mediaUrl + '" target="_blank"><img src="' + thumbnail + '"></a>\
        </div>';
    },
    playerCode: function(htmlStr) {
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
    },
    /////////////////////////////////////////////////////////////
    // MEDIA PLAYERS PAGE MANAGEMENT
    /////////////////////////////////////////////////////////////
    initMediaPlayers: function(el, services) {
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        var serviceEmbedContainers = el.querySelectorAll('div['+service.dataAttribute+']');
        for(var j=0; j < serviceEmbedContainers.length; j++) {
          embetter.utils.initPlayer(serviceEmbedContainers[j], service);
        }
      }
      // handle mobile auto-embed on scroll
      if(navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod|android/) && embetter.mobileScrollSetup == false) {
        window.addEventListener('scroll', embetter.utils.scrollListener);
        embetter.mobileScrollSetup = true;
        // force scroll to trigger listener on page load
        window.scroll(window.scrollX, window.scrollY+1);
        window.scroll(window.scrollX, window.scrollY-1);
      };
    },
    scrollListener: function() {
      // throttled scroll listener
      if(embetter.mobileScrollTimeout != null) {
        window.clearTimeout(embetter.mobileScrollTimeout);
      }
      // check to see if embeds are on screen. if so, embed! otherwise, unembed
      // exclude codepen since we don't know what might execute
      embetter.mobileScrollTimeout = setTimeout(function() {
        for (var i = 0; i < embetter.curEmbeds.length; i++) {
          var player = embetter.curEmbeds[i];
          if(player.getType() != 'codepen') {
            var playerRect = player.el.getBoundingClientRect();
            if(playerRect.bottom < window.innerHeight && playerRect.top > 0) {
              player.embedMedia();
            } else {
              player.unembedMedia();
            }
          }
        };
      }, 500);
    },
    initPlayer: function(embedEl, service) {
      if(embedEl.classList.contains('embetter-ready') == true) return;
      if(embedEl.classList.contains('embetter-static') == true) return;
      embetter.curEmbeds.push( new embetter.EmbetterPlayer(embedEl, service) );
    },
    unembedPlayers: function(containerEl) {
      for (var i = 0; i < embetter.curEmbeds.length; i++) {
        if(containerEl.contains(embetter.curEmbeds[i].el)) {
          embetter.curEmbeds[i].unembedMedia();
        }
      };
    },
    disposePlayers: function() {
      for (var i = 0; i < embetter.curEmbeds.length; i++) {
        embetter.curEmbeds[i].dispose();
      };
      window.removeEventListener('scroll', embetter.utils.scrollListener);
      embetter.mobileScrollSetup = false;
      embetter.curEmbeds.splice(0, embetter.curEmbeds.length-1);
    },
    disposeDetachedPlayers: function() {
      // dispose any players no longer in the DOM
      for (var i = embetter.curEmbeds.length - 1; i >= 0; i--) {
        var embed = embetter.curEmbeds[i];
        if(document.body.contains(embed.el) == false || embed.el == null) {
          embed.dispose();
          delete embetter.curEmbeds.splice(i,1);
        }
      };
    },

    /////////////////////////////////////////////////////////////
    // BUILD PLAYER FROM PASTE
    /////////////////////////////////////////////////////////////
    buildPlayerFromServiceURL: function(el, string, services) {
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        if(string.match(service.regex) != null) {
          service.buildFromText(string, el);
        }
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // 3RD-PARTY SERVICE SUPPORT
  /////////////////////////////////////////////////////////////

  embetter.services = {};

  /////////////////////////////////////////////////////////////
  // YOUTUBE
  // http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
  // https://developers.google.com/youtube/iframe_api_reference
  // http://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
  /////////////////////////////////////////////////////////////
  embetter.services.youtube = {
    type: 'youtube',
    dataAttribute: 'data-youtube-id',
    regex: /(?:.+?)?(?:\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/,
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay == true) ? '&autoplay=1' : '';
      return '<iframe class="video" width="'+ w +'" height="'+ h +'" src="https://www.youtube.com/embed/'+ id +'?rel=0&suggestedQuality=hd720'+ autoplayQuery +'" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    getData: function(id) {
      return 'http://img.youtube.com/vi/'+ id +'/0.jpg';
    },
    link: function(id) {
      return 'https://www.youtube.com/watch?v=' + id;
    },
    buildFromText: function(text, containerEl) {
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        // build embed
        var videoURL = this.link(videoId);
        var videoThumbnail = this.getData(videoId);
        var newEmbedHTML = embetter.utils.playerHTML(this, videoURL, videoThumbnail, videoId);
        var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
        embetter.utils.initPlayer(newEmbedEl, this, embetter.curEmbeds);
        containerEl.appendChild(newEmbedEl);
        // show embed code
        var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
        var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
        containerEl.appendChild(newEmbedCodeEl);
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // VIMEO
  // http://lolobobo.fr/poireau/
  /////////////////////////////////////////////////////////////
  embetter.services.vimeo = {
    type: 'vimeo',
    dataAttribute: 'data-vimeo-id',
    regex: embetter.utils.buildRegex('vimeo.com\/(\\S*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay == true) ? '&amp;autoplay=1' : '';
      return '<iframe src="//player.vimeo.com/video/'+ id +'?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'+ autoplayQuery +'" width="'+ w +'" height="'+ h +'" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    },
    getData: function(mediaUrl, callback) {
      var videoId = mediaUrl.split('vimeo.com/')[1];
      reqwest({
        url: 'http://vimeo.com/api/v2/video/'+ videoId +'.json',
        type: 'jsonp',
        error: function (err) {
          // console.log('vimeo error');
        },
        success: function (data) {
          callback(data[0].thumbnail_large);
        }
      })

      return '';
    },
    link: function(id) {
      return 'https://vimeo.com/' + id;
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var videoURL = this.link(videoId);
        this.getData(videoURL, function(videoThumbnail) {
          var newEmbedHTML = embetter.utils.playerHTML(self, videoURL, videoThumbnail, videoId);
          var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
          containerEl.appendChild(newEmbedEl);
          embetter.utils.initPlayer(newEmbedEl, self, embetter.curEmbeds);
          // show embed code
          var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
          var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
          containerEl.appendChild(newEmbedCodeEl);
        });
      }
    }
  };




  /////////////////////////////////////////////////////////////
  // SOUNDCLOUD
  // https://soundcloud.com/pages/embed
  // https://developers.soundcloud.com/docs/api/sdks
  // http://soundcloud.com/oembed?format=js&url=https%3A//soundcloud.com/cacheflowe/patter&iframe=true
  /////////////////////////////////////////////////////////////
  embetter.services.soundcloud = {
    type: 'soundcloud',
    dataAttribute: 'data-soundcloud-id',
    regex: embetter.utils.buildRegex('(?:soundcloud.com|snd.sc)\\/([a-zA-Z0-9_-]*(?:\\/sets)?(?:\\/groups)?\\/[a-zA-Z0-9_-]*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay == true) ? '&amp;auto_play=true' : '';
      if(!id.match(/^(playlist|track|group)/)) id = 'tracks/' + id; // if no tracks/sound-id, prepend tracks/ (mostly for legacy compatibility)
      return '<iframe width="100%" height="600" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/'+ id + autoplayQuery +'&amp;hide_related=false&amp;color=373737&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';
    },
    getData: function(mediaUrl, callback) {
      reqwest({
        url: 'http://api.soundcloud.com/resolve.json?url='+ mediaUrl +'&client_id=YOUR_CLIENT_ID&callback=jsonpResponse',
        type: 'jsonp',
        error: function (err) {
          // console.log('soundcloud error');
        },
        success: function (data) {
          callback(data);
        }
      })
    },
    link: function(id) {
      return 'https://soundcloud.com/' + id;
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
            var soundId = data.id;
            if(soundURL.indexOf('/sets/') != -1) soundId = 'playlists/' + soundId;
            else if(soundURL.indexOf('/groups/') != -1) soundId = 'groups/' + soundId;
            else soundId = 'tracks/' + soundId;

            var newEmbedHTML = embetter.utils.playerHTML(self, soundURL, thumbnail, soundId);
            var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
            containerEl.appendChild(newEmbedEl);
            embetter.utils.initPlayer(newEmbedEl, self, embetter.curEmbeds);
            // show embed code
            var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
            var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
            containerEl.appendChild(newEmbedCodeEl);
          } else {
            // console.log('There was a problem with your Soundcloud link.');
          }
        });
      }
    }
  };



  /////////////////////////////////////////////////////////////
  // INSTAGRAM
  // http://instagram.com/p/fA9uwTtkSN/media/?size=l
  // https://instagram.com/p/fA9uwTtkSN/embed/
  // http://api.instagram.com/oembed?url=http://instagr.am/p/fA9uwTtkSN/?blah
  /////////////////////////////////////////////////////////////
  embetter.services.instagram = {
    type: 'instagram',
    dataAttribute: 'data-instagram-id',
    regex: embetter.utils.buildRegex('instagram.com\/p\/([a-zA-Z0-9-]*)'),
    embed: function(id, w, h, autoplay) {
      return '<iframe width="100%" height="600" scrolling="no" frameborder="no" src="https://instagram.com/p/'+ id +'/embed/"></iframe>';
    },
    getData: function(id) {
      return 'https://instagram.com/p/' + id +'/media/?size=l';
    },
    link: function(id) {
      return 'https://instagram.com/p/' + id +'/';
    },
    buildFromText: function(text, containerEl) {
      var mediaId = text.match(this.regex)[1];
      var mediaURL = this.link(mediaId);
      if(mediaURL != null) {
        var thumbnail = this.getData(mediaId);
        var newEmbedHTML = embetter.utils.playerHTML(this, mediaURL, thumbnail, mediaId);
        var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
        containerEl.appendChild(newEmbedEl);
        embetter.utils.initPlayer(newEmbedEl, this, embetter.curEmbeds);
        // show embed code
        var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
        var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
        containerEl.appendChild(newEmbedCodeEl);
      }
    }
  };



  /////////////////////////////////////////////////////////////
  // DAILYMOTION
  /////////////////////////////////////////////////////////////
  embetter.services.dailymotion = {
    type: 'dailymotion',
    dataAttribute: 'data-dailymotion-id',
    regex: embetter.utils.buildRegex('dailymotion.com\/video\/([a-zA-Z0-9-_]*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay == true) ? '?autoPlay=1' : '';
      return '<iframe class="video" width="'+ w +'" height="'+ h +'" src="//www.dailymotion.com/embed/video/'+ id + autoplayQuery +'" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
    },
    getData: function(id) {
      return 'http://www.dailymotion.com/thumbnail/video/'+ id;
    },
    link: function(id) {
      return 'http://www.dailymotion.com/video/'+ id;
    },
    buildFromText: function(text, containerEl) {
      text = text.split('_')[0];
      var videoId = text.match(this.regex)[1];
      if(videoId != null) {
        var videoURL = this.link(videoId);
        var videoThumbnail = this.getData(videoId);
        var newEmbedHTML = embetter.utils.playerHTML(this, videoURL, videoThumbnail, videoId);
        var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
        embetter.utils.initPlayer(newEmbedEl, this, embetter.curEmbeds);
        containerEl.appendChild(newEmbedEl);
        // show embed code
        var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
        var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
        containerEl.appendChild(newEmbedCodeEl);
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // RDIO
  /////////////////////////////////////////////////////////////
  embetter.services.rdio = {
    type: 'rdio',
    dataAttribute: 'data-rdio-id',
    regex: embetter.utils.buildRegex('rdio.com\/(\\S*)'),
    embed: function(id, w, h, autoplay) {
      // var autoplayQuery = (autoplay == true) ? '?autoplay=' : '';
      var autoplayQuery = '';
      return '<iframe width="100%" height="400" src="https://rd.io/i/'+ id + '/' + autoplayQuery +'" frameborder="0" scrolling="no"></iframe>';
    },
    getData: function(mediaUrl, callback) {
      reqwest({
        url: 'http://www.rdio.com/api/oembed/?format=json&url='+ mediaUrl,
        type: 'jsonp',
        error: function (err) {
          // console.log('rdio error');
        },
        success: function (data) {
          callback(data);
        }
      })
    },
    link: function(path) {
      return 'http://www.rdio.com/' + path;
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var soundURL = text; // this.link(text.match(this.regex)[1]);
      if(soundURL != null) {
        this.getData(soundURL, function(data) {
          var thumbnail = data.thumbnail_url;
          var embedCode = data.html;
          var soundId = embedCode.match(/https:\/\/rd.io\/i\/(\S*)\//)[1];
          if(thumbnail && soundId) {
            var newEmbedHTML = embetter.utils.playerHTML(self, soundURL, thumbnail, soundId);
            var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
            containerEl.appendChild(newEmbedEl);
            embetter.utils.initPlayer(newEmbedEl, self, embetter.curEmbeds);
            // show embed code
            var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
            var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
            containerEl.appendChild(newEmbedCodeEl);
          } else {
            // console.log('There was a problem with your Rdio link.');
          }
        });
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // MIXCLOUD
  /////////////////////////////////////////////////////////////
  embetter.services.mixcloud = {
    type: 'mixcloud',
    dataAttribute: 'data-mixcloud-id',
    regex: embetter.utils.buildRegex('(?:mixcloud.com)\\/(.*\\/.*)'),
    embed: function(id, w, h, autoplay) {
      var autoplayQuery = (autoplay == true) ? '&amp;autoplay=true' : '';
      return '<iframe width="660" height="180" src="https://www.mixcloud.com/widget/iframe/?feed=http%3A%2F%2Fwww.mixcloud.com%2F' + escape(id) + '%2F&amp;replace=0&amp;hide_cover=1&amp;stylecolor=ffffff&amp;embed_type=widget_standard&amp;'+ autoplayQuery +'" frameborder="0" scrolling="no"></iframe>';
    },
    getData: function(mediaUrl, callback) {
      reqwest({
        url: 'http://www.mixcloud.com/oembed/?url='+ mediaUrl +'&format=jsonp',
        type: 'jsonp',
        error: function (err) {
          console.log('mixcloud error', err);
        },
        success: function (data) {
          callback(data);
        }
      })
    },
    link: function(id) {
      return 'https://www.mixcloud.com/' + id;
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var soundId = text.match(this.regex)[1];
      var soundURL = this.link(soundId);
      if(soundURL != null) {
        this.getData(soundURL, function(data) {
          var thumbnail = data.image;
          if(thumbnail) {
            var newEmbedHTML = embetter.utils.playerHTML(self, soundURL, thumbnail, soundId);
            var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
            containerEl.appendChild(newEmbedEl);
            embetter.utils.initPlayer(newEmbedEl, self, embetter.curEmbeds);
            // show embed code
            var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
            var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
            containerEl.appendChild(newEmbedCodeEl);
          } else {
            // console.log('There was a problem with your mixcloud link.');
          }
        });
      }
    }
  };


  /////////////////////////////////////////////////////////////
  // CODEPEN
  /////////////////////////////////////////////////////////////
  embetter.services.codepen = {
    type: 'codepen',
    dataAttribute: 'data-codepen-id',
    regex: embetter.utils.buildRegex('(?:codepen.io)\\/([a-zA-Z0-9_\\-%]*\\/[a-zA-Z0-9_\\-%]*\\/[a-zA-Z0-9_\\-%]*)'),
    embed: function(id, w, h, autoplay) {
     id = id.replace('/pen/', '/embed/');
     var user = id.split('/')[0];
     var slugHash = id.split('/')[2];
     return '<iframe src="//codepen.io/' + id + '?height=' + h + '&amp;theme-id=0&amp;slug-hash=' + slugHash + '&amp;default-tab=result&amp;user=' + user + '" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"</iframe>';
    },
    getData: function(mediaUrl, callback) {
      reqwest({
        url: 'http://codepen.io/api/oembed?url='+ mediaUrl +'&format=json',
        type: 'json',
        error: function (err) {
          console.log('codepen error', err);
        },
        success: function (data) {
          callback(data);
        }
      })
    },
    link: function(id) {
      return 'http://codepen.io/' + id;
    },
    buildFromText: function(text, containerEl) {
      var self = this;
      var penId = text.match(this.regex)[1].replace('/pen/', '/embed/');
      var penId = text.match(this.regex)[1];
      var penURL = this.link(penId);
      if(penURL != null) {
        this.getData(penURL, function(data) {
          var thumbnail = data.thumbnail_url;
          if(thumbnail) {
            var newEmbedHTML = embetter.utils.playerHTML(self, penURL, thumbnail, soundId);
            var newEmbedEl = embetter.utils.stringToDomElement(newEmbedHTML);
            containerEl.appendChild(newEmbedEl);
            embetter.utils.initPlayer(newEmbedEl, self, embetter.curEmbeds);
            // show embed code
            var newEmbedCode = embetter.utils.playerCode(newEmbedHTML);
            var newEmbedCodeEl = embetter.utils.stringToDomElement(newEmbedCode);
            containerEl.appendChild(newEmbedCodeEl);
          } else {
            // console.log('There was a problem with your codepen link.');
          }
        });
      }
    }
  };

  // MEDIA PLAYER INSTANCE
  /////////////////////////////////////////////////////////////

  embetter.curPlayer = null;

  embetter.EmbetterPlayer = function(el, serviceObj) {
    this.el = el;
    this.el.classList.add('embetter-ready');
    this.serviceObj = serviceObj;
    this.id = this.el.getAttribute(serviceObj.dataAttribute);
    this.thumbnail = this.el.querySelector('img');
    this.playerEl = null;
    this.buildPlayButton();
  };

  embetter.EmbetterPlayer.prototype.buildPlayButton = function() {
    this.playButton = document.createElement('div');
    this.playButton.classList.add('embetter-loading');
    this.el.appendChild(this.playButton);

    this.playButton = document.createElement('div');
    this.playButton.classList.add('embetter-play-button');
    this.el.appendChild(this.playButton);

    var self = this;
    this.playHandler = function() { self.play(); }; // for event listener removal
    this.playButton.addEventListener('click', this.playHandler);

    // codepen hack to fix changing thumbnail URLs
    if(this.serviceObj.type == 'codepen') {
      if(this.thumbnail.height < 50) {
        this.thumbnail.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAGaBAMAAAAfiY3GAAAAMFBMVEUwMDD///8lJSUtLS0pKSllZWXc3NycnJw3NzfKysrv7+9UVFS1tbVFRUV6enqKiorEPXaKAAAESElEQVR42u3YT2ibZRzA8Zckijd5DqY0FA2ZpYcpC61gdyiGbgehqKzaeZgKERY33AYdYgWRSeufHLx0sEmdCjkNHTqcZcPdWifKvM0iiANt2RxsMtYdFBTE532Tst1SYT35+RySPG/eXr48/PrkTRIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBdClUNNrDuSEGEjfPw+WObVLjThqrt9+1XQ+lGWY87Kl+5J5ft2dzF0Gr1nspaj1YqD2bfVqJN6U2VSi0uB9N1vGN79ofidVd7rrHv15iu8GTr5Oo39ZO5eK3w7NTUtTRhcmVqaur1WjLy59Sh+WqS/yUup35Ikl3xD0YOzajXTe6nEELvUhy8C72nlhcvhnT8Vuvx4vdxTozF9/BAORmIbz35JLearueTsdKp+F1pSb5uxlq9l38vzSePXC3dqCwvbv+tdKOWDNf3ztVL40nSH+bm5o7UkoHS3NFwM8lNfhLXS/Hy/pq865C/uzReqUzU8u/FbTu4uliNm/jLmHe8clf9RC3pL01ns3egr7Jpck81N3k4m739ofctedczG5bvK6f/qXI7ihcKj7V6pnNbw8E0bzL4Y1+at51woK+c++JELebNlv2lcK4q7zp27+zBduYdYffm2d70pZM3btH5bPfWsryVyvJnad50Lyf9xdWesrzdPdEa7+TdG86XLu0M54uznbzD9ZWY95/rT6d5e69faS3G2Xvg+rVqmvfRsCJvd2Nxi7bzHl4I+8vlhbBntZM3N3sz7uAQXkzzxvfiUsybnSNi3sLsic3yds/bWsv7cSscn763FU5OdvIWZleyk8Mrad7S3NwbtezkEM8RMe/0O8Wf5e1quH6zkzf0nQkHZuPL2uwdi3Pj9tkbh+6t2TuzuXVM3q5yk3tivqGYt3SpcjrEl52dvPmHijO3nxzad3dODsWZeNT4VN5uCmf7ckODzWrhbGmlVl74qDx4OlzKzr3lyfvLt5171/K2z72x/JZg93a3JRxpvv1hPhmb7buQW17MvRt2p7/a/p74I5xLD7iXJyaer97K+/LExMRMljc3Ke86psNqaNTDM0n8TfH56PJif71nOp3I8aRwPJ9kJ4fsmcNa3vYzhzRvfqu83eX7PwilI9X4rPGr8N3y15PF8Vq8+Gqj8X76aHLkaKPROFBLnnqplo2SnXHZiI909sWHZY9/W5Wvq8LYC7tG0w/b/iouzIXXsm063GwOpkHz9zSbzTfjh2b75ni92ews89vkXU/fzpPzfPw9HHZ3Pg8Ntb8citKKnWU+Xd9a8l86p490ZNgwg2fSwctGGVUXAAAAAOD/7V+iFBKVw6oUoAAAAABJRU5ErkJggg=='
      }
    }
  };

  embetter.EmbetterPlayer.prototype.getType = function() {
    return this.serviceObj.type;
  };

  embetter.EmbetterPlayer.prototype.play = function() {
    if(embetter.curPlayer != null) {
      embetter.curPlayer.unembedMedia();
      embetter.curPlayer = null;
    }

    if(this.id != null) this.playerEl = embetter.utils.stringToDomElement(this.serviceObj.embed(this.id, this.thumbnail.width, this.thumbnail.height, true));
    this.el.appendChild(this.playerEl);
    this.el.classList.add('embetter-playing');
    embetter.curPlayer = this;
  };

  embetter.EmbetterPlayer.prototype.unembedMedia = function() {
    if(this.playerEl != null && this.playerEl.parentNode != null) {
      this.playerEl.parentNode.removeChild(this.playerEl);
    }
    this.el.classList.remove('embetter-playing');
  };

  // embed if mobile
  embetter.EmbetterPlayer.prototype.embedMedia = function() {
    if(this.el.classList.contains('embetter-playing') == true) return;
    if(this.id != null) this.playerEl = embetter.utils.stringToDomElement(this.serviceObj.embed(this.id, this.thumbnail.width, this.thumbnail.height, false));
    this.el.appendChild(this.playerEl);
    this.el.classList.add('embetter-playing');
  };

  embetter.EmbetterPlayer.prototype.dispose = function() {
    this.el.classList.remove('embetter-ready');
    this.unembedMedia();
    this.playButton.removeEventListener('click', this.playHandler);
    if(this.playButton != null && this.playButton.parentNode != null) {
      this.playButton.parentNode.removeChild(this.playButton);
    }
  };
})();