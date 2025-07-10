// Create an array of services to export
// we want to load the service-specific files, and make them available to the web component
// we also want to create an array of service so the web component can check for service attribute ids to figure out which embed service to use

import YouTube from "./youtube.js";
import Vimeo from "./vimeo.js";

const services = [
  YouTube,
  Vimeo,
  // Add other services here as needed
];

export default services;
