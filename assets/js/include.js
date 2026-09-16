/* =============================================================
   include.js — lightweight HTML partial loader
   -------------------------------------------------------------
   Usage in a page:
       <div data-include="partials/header.html" data-active="about"></div>
       <div data-include="partials/footer.html"></div>

   It replaces each host element with the fetched markup, marks the
   active nav item, then fires a "partials:loaded" event that
   main.js waits on before wiring up behaviour.

   MIGRATING TO A BACKEND
   ----------------------
   Delete this file and the <script> tag, then render the same
   partials/*.html with your server include of choice, e.g.
       PHP      <?php include 'partials/header.html'; ?>
       Nunjucks {% include "partials/header.html" %}
       SSI      <!--#include virtual="/partials/header.html" -->
   No other markup changes are required.
   ============================================================= */
(function () {
  "use strict";

  var hosts = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));

  function markActive(scope, key) {
    if (!key) return;
    scope.querySelectorAll('.nav [data-nav="' + key + '"]').forEach(function (el) {
      el.setAttribute("aria-current", "page");
    });
  }

  function inject(host) {
    var url = host.getAttribute("data-include");
    var active = host.getAttribute("data-active");
    return fetch(url, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status + " " + r.statusText);
        return r.text();
      })
      .then(function (html) {
        // <template> parses arbitrary HTML into an inert DocumentFragment using
        // normal document parsing rules — more robust than Range.createContextualFragment
        // for structural content like this (no "context element" edge cases).
        var tpl = document.createElement("template");
        tpl.innerHTML = html;
        var nodes = Array.prototype.slice.call(tpl.content.childNodes);
        if (!nodes.length) {
          console.warn("[include.js] " + url + " fetched but parsed to zero nodes.");
          return;
        }
        markActive(tpl.content, active);
        host.replaceWith.apply(host, nodes);
      })
      .catch(function (err) {
        console.warn(
          "[include.js] Could not load " + url + " — " + err.message +
          "\nServe the folder over HTTP (e.g. `npx serve` or `python -m http.server`) " +
          "rather than opening the file directly."
        );
      });
  }

  Promise.all(hosts.map(inject)).then(function () {
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  });
})();
