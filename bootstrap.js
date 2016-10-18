/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

Components.utils.import("resource://gre/modules/Services.jsm");

const CHROME_URL = "chrome://aboutaddons/content/index.html";

function install() {}
function uninstall() {}
function startup(data) {
  Services.obs.addObserver(ExtensionManager, "EM-loaded", false);
}
function shutdown(reason) {
  Services.obs.removeObserver(ExtensionManager, "EM-loaded", false);
}

let ExtensionManager = {
  observe: function(aSubject, aTopic, aData) {
    this.replaceContent(aSubject);
  },

  replaceContent: function(aWindow) {
    let oldContent = aWindow.document.getElementById("headered-views-content");
    oldContent.hidden = true;

    let iframe = aWindow.document.createElement("iframe");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("flex", "1");

    let headeredViews = aWindow.document.getElementById("headered-views");
    headeredViews.appendChild(iframe);

    let url = `${CHROME_URL}#extension`;
    iframe.setAttribute("src", url);

    aWindow.addEventListener("click", event => {
      let type = aWindow.document.getElementById("list-view").getAttribute("type");
      let url = `${CHROME_URL}#${type}`;
      if (iframe.src != url) {
        iframe.setAttribute("src", `${CHROME_URL}#${type}`);
        iframe.contentWindow.location.reload();
      }
    });
  }
}
