(function (window) {
  "use strict";

  var speakWord = "Good Bye";
  var byeSpeaker = {};

  byeSpeaker.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  // Expose to global (as the assignment expects)
  window.byeSpeaker = byeSpeaker;
})(window);
