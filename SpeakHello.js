(function (window) {
  "use strict";

  var speakWord = "Hello";
  var helloSpeaker = {};

  helloSpeaker.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  // Expose to global (as the assignment expects)
  window.helloSpeaker = helloSpeaker;
})(window);
