// ==UserScript==
// @name        NULL Opener object
// @namespace   nullopenerobjectns
// @description Clears the window.openeer object.
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function() {
    "use strict";
    window.opener = null;
})();
