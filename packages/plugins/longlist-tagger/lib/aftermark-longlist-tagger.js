'use strict';

function main (dom) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    minItemCount: 6,
    className: "long-list"
  };
  var lists = dom.window.document.querySelectorAll("ul, ol");
  lists.forEach(function (list) {
    list.querySelectorAll("li").length >= options.minItemCount && list.classList.add(options.className);
  });
  return dom;
}

module.exports = main;
