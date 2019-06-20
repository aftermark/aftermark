module.exports = [
  {
    name: "defaults",
    description:
      "adds default class to <ul>s and <ol>s with default number of <li>s"
  },
  {
    name: "custom",
    description:
      "adds custom class to <ul>s and <ol>s with custom number of <li>s",
    options: {
      className: "custom-long-list-class",
      minItemCount: 4
    }
  }
];
