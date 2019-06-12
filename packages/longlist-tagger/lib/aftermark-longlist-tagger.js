'use strict';

function main (dom, options) {
  var minItemCount = options.minItemCount || 6;
  var className = options.className || "long-list";
  var lists = dom.window.document.querySelectorAll("ul, ol");
  lists.forEach(function (list) {
    list.querySelectorAll("li").length >= minItemCount && list.classList.add(className);
  });
  return dom;
}

module.exports = main;
