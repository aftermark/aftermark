export default function(dom, options) {
  const minItemCount = options.minItemCount || 6;
  const className = options.className || "long-list";

  const lists = dom.window.document.querySelectorAll("ul, ol");

  lists.forEach(list => {
    list.querySelectorAll("li").length >= minItemCount &&
      list.classList.add(className);
  });

  return dom;
}
