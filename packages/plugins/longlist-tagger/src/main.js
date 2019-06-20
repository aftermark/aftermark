export default function(
  dom,
  options = {
    minItemCount: 6,
    className: "long-list"
  }
) {
  const lists = dom.window.document.querySelectorAll("ul, ol");

  lists.forEach(list => {
    list.querySelectorAll("li").length >= options.minItemCount &&
      list.classList.add(options.className);
  });

  return dom;
}
