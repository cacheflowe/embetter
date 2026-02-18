import YouTube from "./youtube.js";
import Vimeo from "./vimeo.js";
import SoundCloud from "./soundcloud.js";
import Instagram from "./instagram.js";
import Dailymotion from "./dailymotion.js";
import Mixcloud from "./mixcloud.js";
import CodePen from "./codepen.js";
import Bandcamp from "./bandcamp.js";
import Giphy from "./giphy.js";
// import Shadertoy from "./shadertoy.js"; // Shadertoy blocks iframe embedding (X-Frame-Options: SAMEORIGIN)
// import Kuula from "./kuula.js";
import Video from "./video.js";
import GIF from "./gif.js";

const services = [
  YouTube,
  Vimeo,
  SoundCloud,
  Instagram,
  Dailymotion,
  Mixcloud,
  CodePen,
  Bandcamp,
  Giphy,
  // Shadertoy,
  // Kuula,
  Video,
  GIF,
];

export default services;
