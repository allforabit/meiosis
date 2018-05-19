/*global define, exports, module, require*/

// This boilerplate is to support running this code with either, just the browser, or RequireJS,
// or node.js / npm (browserify, webpack, etc.) Do not think this boilerplate is necessary to run
// Meiosis. It is for convenience to be able to run the example with your preferred module system.
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["meiosis-mithril", "./runapp"], function(meiosisMithril, runapp) {
      return (root.mithrilApp = factory(meiosisMithril, runapp));
    });
  }
  else if (typeof module === "object" && module.exports) {
    module.exports = (root.mithrilApp = factory(require("meiosis-mithril"), require("./runapp")));
  }
  else {
    root.mithrilApp = factory(root.meiosisMithril, root.runapp);
  }
}(this || window, // ^^ the code above is boilerplate. the "real" code starts below. vv

  function(meiosisMithril, runapp) {
    runapp(meiosisMithril);
  }
));