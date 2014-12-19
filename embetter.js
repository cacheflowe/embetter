window.embetter = {};

/////////////////////////////////////////////////////////////
// COMMON UTIL HELPERS
/////////////////////////////////////////////////////////////

window.embetter.debug = true;
window.embetter.curEmbeds = [];
window.embetter.mobileScrollTimeout = null;

window.embetter.utils = {
  /////////////////////////////////////////////////////////////
  // REGEX HELPERS
  /////////////////////////////////////////////////////////////
  buildRegex: function(regexStr) {
    var optionalPrefix = '(?:https?:\/\/)?(?:w{3}\.)?';
    return new RegExp(optionalPrefix + regexStr);
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
    return '<div class="embetter-container" ' + service.dataAttribute + '="' + id + '">\
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
  initMediaPlayers: function(el, services, embedsArray) {
    embedsArray = embedsArray || window.embetter.curEmbeds;
    for (var i = 0; i < services.length; i++) {
      var service = services[i];
      var serviceEmbedContainers = el.querySelectorAll('div['+service.dataAttribute+']');
      for(var j=0; j < serviceEmbedContainers.length; j++) {
        window.embetter.utils.initPlayer(serviceEmbedContainers[j], service, embedsArray);
      }
    }
    // handle mobile auto-embed on scroll
    if(navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod|android/)) {
      // throttled scroll listener
      window.addEventListener('scroll', function() {
        if(window.embetter.mobileScrollTimeout != null) {
          window.clearTimeout(window.embetter.mobileScrollTimeout);
        }
        // check to see if embeds are on screen. if so, embed! otherwise, unembed
        window.embetter.mobileScrollTimeout = setTimeout(function() {
          for (var i = 0; i < embedsArray.length; i++) {
            var player = embedsArray[i];
            var playerRect = player.el.getBoundingClientRect();
            if(playerRect.bottom < window.innerHeight && playerRect.top > 0) {
              player.embedMedia();
            } else {
              player.stop();
            }
          };
        }, 500)
      });
      // force scroll to trigger listener
      window.scroll(window.scrollX, window.scrollY+1); 
      window.scroll(window.scrollX, window.scrollY-1);
    };
  },
  initPlayer: function(embedEl, service, embedsArray) {
    if(embedEl.classList.contains('embetter-player-ready') == true) {
      console.log('already inited: ', embedEl);
      return;
    }
    embedsArray = embedsArray || window.embetter.curEmbeds;
    embedsArray.push( new window.embetter.EmbetterPlayer(embedEl, service) );
  },
  disposeVideoPlayers: function(embedsArray) {
    embedsArray = embedsArray || window.embetter.curEmbeds;
    for (var i = 0; i < embedsArray.length; i++) {
      embedsArray[i].dispose();
    };
  },
  /////////////////////////////////////////////////////////////
  // BUILD PLAYER FROM PASTE
  /////////////////////////////////////////////////////////////
  buildPlayerFromServiceURL: function(el, string, services, embedsArray) {
    embedsArray = embedsArray || window.embetter.curEmbeds;
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

window.embetter.services = {};

/////////////////////////////////////////////////////////////
// YOUTUBE
// http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
// https://developers.google.com/youtube/iframe_api_reference
// http://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
/////////////////////////////////////////////////////////////
window.embetter.services.youtube = {
  type: 'youtube',
  dataAttribute: 'data-youtube-id',
  regex: /(?:.+?)?(?:\/v\/|watch\/|\?v=|\&v=|youtu\.be\/|\/v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})+/,
  embed: function(id, w, h, autoplay) {
    var autoplayQuery = (autoplay == true) ? '&autoplay=1' : '';
    return '<iframe class="video" width="'+ w +'" height="'+ h +'" src="http://www.youtube.com/embed/'+ id +'?rel=0&suggestedQuality=hd720'+ autoplayQuery +'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
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
      var newEmbedHTML = window.embetter.utils.playerHTML(this, videoURL, videoThumbnail, videoId);
      var newEmbedEl = window.embetter.utils.stringToDomElement(newEmbedHTML);
      window.embetter.utils.initPlayer(newEmbedEl, this, window.embetter.curEmbeds);
      containerEl.appendChild(newEmbedEl);
      // show embed code
      var newEmbedCode = window.embetter.utils.playerCode(newEmbedHTML);
      var newEmbedCodeEl = window.embetter.utils.stringToDomElement(newEmbedCode);
      containerEl.appendChild(newEmbedCodeEl);
    }
  }
};


/////////////////////////////////////////////////////////////
// VIMEO
// http://lolobobo.fr/poireau/
/////////////////////////////////////////////////////////////
window.embetter.services.vimeo = {
  type: 'vimeo',
  dataAttribute: 'data-vimeo-id',
  regex: window.embetter.utils.buildRegex('vimeo.com\/(\\S*)'),
  embed: function(id, w, h, autoplay) { 
    var autoplayQuery = (autoplay == true) ? '&amp;autoplay=1' : '';
    return '<iframe src="//player.vimeo.com/video/'+ id +'?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff'+ autoplayQuery +'" width="'+ w +'" height="'+ h +'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
  },
  getData: function(mediaUrl, callback) {
    var videoId = mediaUrl.split('vimeo.com/')[1];
    reqwest({
      url: 'http://vimeo.com/api/v2/video/'+ videoId +'.json',
      type: 'jsonp',
      error: function (err) { 
        console.log('vimeo error');
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
        var newEmbedHTML = window.embetter.utils.playerHTML(self, videoURL, videoThumbnail, videoId);
        var newEmbedEl = window.embetter.utils.stringToDomElement(newEmbedHTML);
        containerEl.appendChild(newEmbedEl);
        window.embetter.utils.initPlayer(newEmbedEl, self, window.embetter.curEmbeds);
        // show embed code
        var newEmbedCode = window.embetter.utils.playerCode(newEmbedHTML);
        var newEmbedCodeEl = window.embetter.utils.stringToDomElement(newEmbedCode);
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
window.embetter.services.soundcloud = {
  type: 'soundcloud',
  dataAttribute: 'data-soundcloud-id',
  regex: window.embetter.utils.buildRegex('(?:soundcloud.com|snd.sc)\/(\\S*)(?:\\s|\\?|#)'),
  embed: function(id, w, h, autoplay) { 
    var autoplayQuery = (autoplay == true) ? '&amp;auto_play=true' : '';
    return '<iframe width="100%" height="600" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+ id + autoplayQuery +'&amp;hide_related=false&amp;color=373737&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';
  },
  getData: function(mediaUrl, callback) {
    reqwest({
      url: 'http://api.soundcloud.com/resolve.json?url='+ mediaUrl +'&client_id=YOUR_CLIENT_ID&callback=jsonpResponse',
      type: 'jsonp',
      error: function (err) { 
        console.log('soundcloud error');
      }, 
      success: function (data) {
        callback(data);
      }
    })
  },
  link: function(id) {
    return 'https://soundcloud.com/' + id;
  },
  buildFromText: function(text, containerEl) {
    var self = this;
    var soundURL = this.link(text.match(this.regex)[1]);
    if(soundURL != null) {
      this.getData(soundURL, function(data) {
        var thumbnail = data.artwork_url;
        if(thumbnail) {
          thumbnail = thumbnail.replace('large.jpg', 't500x500.jpg')
          console.warn('Soundcloud thumbnail string replacement should validate that larger image exists');
          var soundId = data.id;
          var newEmbedHTML = window.embetter.utils.playerHTML(self, soundURL, thumbnail, soundId);
          var newEmbedEl = window.embetter.utils.stringToDomElement(newEmbedHTML);
          containerEl.appendChild(newEmbedEl);
          window.embetter.utils.initPlayer(newEmbedEl, self, window.embetter.curEmbeds);
          // show embed code
          var newEmbedCode = window.embetter.utils.playerCode(newEmbedHTML);
          var newEmbedCodeEl = window.embetter.utils.stringToDomElement(newEmbedCode);
          containerEl.appendChild(newEmbedCodeEl);
        } else {
          console.log('There was a problem with your Soundcloud link.');
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
window.embetter.services.instagram = {
  type: 'instagram',
  dataAttribute: 'data-instagram-id',
  regex: window.embetter.utils.buildRegex('instagram.com\/p\/([a-zA-Z0-9-]*)\/?'),
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
      var newEmbedHTML = window.embetter.utils.playerHTML(this, mediaURL, thumbnail, mediaId);
      var newEmbedEl = window.embetter.utils.stringToDomElement(newEmbedHTML);
      containerEl.appendChild(newEmbedEl);
      window.embetter.utils.initPlayer(newEmbedEl, this, window.embetter.curEmbeds);
      // show embed code
      var newEmbedCode = window.embetter.utils.playerCode(newEmbedHTML);
      var newEmbedCodeEl = window.embetter.utils.stringToDomElement(newEmbedCode);
      containerEl.appendChild(newEmbedCodeEl);
    }
  }
};



/////////////////////////////////////////////////////////////
// DAILYMOTION
/////////////////////////////////////////////////////////////
window.embetter.services.dailymotion = {
  type: 'dailymotion',
  dataAttribute: 'data-dailymotion-id',
  regex: window.embetter.utils.buildRegex('dailymotion.com\/video\/([a-zA-Z0-9-]*)'),
  embed: function(id, w, h, autoplay) {
    var autoplayQuery = (autoplay == true) ? '?autoPlay=1' : '';
    return '<iframe class="video" width="'+ w +'" height="'+ h +'" src="//www.dailymotion.com/embed/video/'+ id + autoplayQuery +'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>';
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
      var newEmbedHTML = window.embetter.utils.playerHTML(this, videoURL, videoThumbnail, videoId);
      var newEmbedEl = window.embetter.utils.stringToDomElement(newEmbedHTML);
      window.embetter.utils.initPlayer(newEmbedEl, this, window.embetter.curEmbeds);
      containerEl.appendChild(newEmbedEl);
      // show embed code
      var newEmbedCode = window.embetter.utils.playerCode(newEmbedHTML);
      var newEmbedCodeEl = window.embetter.utils.stringToDomElement(newEmbedCode);
      containerEl.appendChild(newEmbedCodeEl);
    }
  }
};




/////////////////////////////////////////////////////////////
// MEDIA PLAYER INSTANCE
/////////////////////////////////////////////////////////////

window.embetter.curPlayer = null;

window.embetter.EmbetterPlayer = function(el, serviceObj) {
  this.el = el;
  this.el.classList.add('embetter-player-ready');
  this.serviceObj = serviceObj;
  this.id = this.el.getAttribute(serviceObj.dataAttribute);
  this.thumbnail = this.el.querySelector('img');
  this.playerEl = null;
  this.buildPlayButton();
};

window.embetter.EmbetterPlayer.prototype.buildPlayButton = function() {
  this.playButton = document.createElement('button');
  this.playButton.innerHTML = 'Play'
  this.el.appendChild(this.playButton);

  var self = this;
  this.playHandler = function() { self.play(); }; // for event listener removal
  this.playButton.addEventListener('click', this.playHandler);
};

window.embetter.EmbetterPlayer.prototype.play = function() {
  if(window.embetter.curPlayer != null) {
    window.embetter.curPlayer.stop();
    window.embetter.curPlayer = null;
  }

  if(this.id != null) this.playerEl = window.embetter.utils.stringToDomElement(this.serviceObj.embed(this.id, this.thumbnail.width, this.thumbnail.height, true));
  this.el.appendChild(this.playerEl);
  this.el.classList.add('playing');
  window.embetter.curPlayer = this;
};

window.embetter.EmbetterPlayer.prototype.stop = function() {
  if(this.playerEl != null && this.playerEl.parentNode != null) {
    this.playerEl.parentNode.removeChild(this.playerEl);
  }
  this.el.classList.remove('playing');
};

  // embed if mobile
window.embetter.EmbetterPlayer.prototype.embedMedia = function() {
  if(this.el.classList.contains('playing') == true) return;
  if(this.id != null) this.playerEl = window.embetter.utils.stringToDomElement(this.serviceObj.embed(this.id, this.thumbnail.width, this.thumbnail.height, false));
  this.el.appendChild(this.playerEl);
  this.el.classList.add('playing');
};

window.embetter.EmbetterPlayer.prototype.dispose = function() {
  this.stop();
  this.playButton.removeEventListener('click', this.playHandler);
};


